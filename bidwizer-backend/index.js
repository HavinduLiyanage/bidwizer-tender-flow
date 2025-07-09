const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');

// === Reference PDF Embedding and Retrieval ===
// Remove Pinecone-related code and prepare for PostgreSQL-based embedding storage and retrieval

const REFERENCE_PDF_DIR = path.join(__dirname, 'reference_pdfs');
const REFERENCE_INDEX_NAME = 'reference-framework';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// File upload setup
const upload = multer({ dest: 'uploads/' });
const documentUpload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Email transport setup (configure your SMTP in .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function getEmbeddings(texts) {
  // texts: array of strings
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: texts,
  });
  return response.data.map(obj => obj.embedding);
}

// Helper: Chunk text into ~500 token chunks
function chunkText(text, maxLength = 1500) {
  const paragraphs = text.split(/\n+/).filter(Boolean);
  let chunks = [];
  let current = '';
  for (let para of paragraphs) {
    if ((current + para).length > maxLength) {
      chunks.push(current);
      current = '';
    }
    current += para + '\n';
  }
  if (current) chunks.push(current);
  return chunks;
}

// Helper: Process all PDFs in reference_pdfs, embed, and store in PostgreSQL
async function processReferencePDFs() {
  // Clear the table first to avoid duplicates
  await prisma.referenceEmbedding.deleteMany();
  const files = fs.readdirSync(REFERENCE_PDF_DIR).filter(f => f.endsWith('.pdf'));
  let totalChunks = 0;
  for (const file of files) {
    const filePath = path.join(REFERENCE_PDF_DIR, file);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const chunks = chunkText(pdfData.text);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      // Get embedding from OpenAI
      const embedding = (await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunk
      })).data[0].embedding;
      // Store in DB as Buffer
      await prisma.referenceEmbedding.create({
        data: {
          fileName: file,
          chunkIndex: i,
          chunkText: chunk,
          embedding: Buffer.from(new Float32Array(embedding).buffer)
        }
      });
      totalChunks++;
    }
    console.log(`Processed ${chunks.length} chunks from ${file}`);
  }
  console.log(`Reference PDFs processed and embedded to DB. Total chunks: ${totalChunks}`);
}

// Helper: Compute cosine similarity between two Float32Arrays
function cosineSimilarity(a, b) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper: Query DB for all reference chunks, compute similarity, return top N
async function getRelevantReferenceChunks(question, topK = 5) {
  // Get embedding for the question
  const embedding = (await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question
  })).data[0].embedding;
  // Get all reference chunks
  const allChunks = await prisma.referenceEmbedding.findMany();
  // Compute similarity
  const scored = allChunks.map(chunk => {
    // Prisma returns Bytes as Buffer (Node.js)
    let chunkEmbedding;
    try {
      // Convert Buffer to Float32Array
      const buf = Buffer.from(chunk.embedding);
      chunkEmbedding = new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
      if (chunkEmbedding.length !== embedding.length) {
        throw new Error(`Embedding length mismatch: got ${chunkEmbedding.length}, expected ${embedding.length}`);
      }
    } catch (e) {
      console.error('Error converting embedding from DB:', e);
      return { text: chunk.chunkText, score: -Infinity };
    }
    return {
      text: chunk.chunkText,
      score: cosineSimilarity(embedding, Array.from(chunkEmbedding))
    };
  });
  // Sort and return topK
  return scored.sort((a, b) => b.score - a.score).slice(0, topK).map(s => s.text);
}

// Expose a route to trigger PDF processing (admin only, or run manually)
app.post('/api/reference/process', async (req, res) => {
  try {
    await processReferencePDFs();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JWT middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Missing token' });
  }
}

// Login endpoint (now with JWT)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Please confirm your email before logging in.' });
  }
  // Issue JWT
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
  });
});

// Example protected route
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: `Hello, user ${req.user.email}! This is a protected route.` });
});

// Get all tenders (optionally filter by publisherId)
app.get('/api/tenders', async (req, res) => {
  const { publisherId } = req.query;
  let where = {};
  if (publisherId) {
    where.publisherId = parseInt(publisherId);
  }
  const tenders = await prisma.tender.findMany({ where, include: { publisher: true } });
  res.json(tenders);
});

// Get tender by id
app.get('/api/tenders/:id', async (req, res) => {
  const tender = await prisma.tender.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { publisher: true }
  });
  if (!tender) return res.status(404).json({ error: 'Not found' });
  if (tender && tender.requirements) {
    try {
      tender.requirements = JSON.parse(tender.requirements);
    } catch {
      tender.requirements = [];
    }
  }
  res.json(tender);
});

// Upload tender (publisher only)
app.post('/api/tenders', authenticateJWT, upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'advertisementImage', maxCount: 1 }
]), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);

  const {
    publisherId, title, description, deadline, value, category,
    preBidMeetingDate, preBidMeetingTime, region,
    contactPersonName, contactNumber, contactEmail, companyWebsite, requirements
  } = req.body;

  // Handle tender document file
  let filePath = '';
  let tenderText = '';
  if (req.files['file'] && req.files['file'][0]) {
    const file = req.files['file'][0];
    const ext = path.extname(file.originalname) || '.pdf';
    const newPath = file.path + ext;
    fs.renameSync(file.path, newPath);
    filePath = newPath.replace(/\\/g, '/');

    // Extract text from PDF
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(newPath);
      const pdfData = await pdfParse(dataBuffer);
      tenderText = pdfData.text;
      // Chunk and embed
      const chunkSize = 1500, overlap = 200;
      const chunks = [];
      let i = 0;
      while (i < tenderText.length) {
        const chunk = tenderText.slice(i, i + chunkSize);
        chunks.push(chunk);
        i += chunkSize - overlap;
      }
      let chunkEmbeddings = [];
      if (chunks.length > 0) {
        const embeddings = await getEmbeddings(chunks);
        chunkEmbeddings = chunks.map((chunk, idx) => ({ chunk, embedding: embeddings[idx] }));
      }
      // Store as JSON string
      req.body.chunkEmbeddings = JSON.stringify(chunkEmbeddings);
    }
  }

  // Handle advertisement image
  let advertisementImagePath = '';
  if (req.files['advertisementImage'] && req.files['advertisementImage'][0]) {
    const img = req.files['advertisementImage'][0];
    const imgExt = path.extname(img.originalname) || '';
    const imgNewPath = img.path + imgExt;
    fs.renameSync(img.path, imgNewPath);
    advertisementImagePath = imgNewPath.replace(/\\/g, '/');
  }

  // Parse requirements if sent as JSON string
  let requirementsToSave = null;
  if (requirements) {
    try {
      requirementsToSave = JSON.stringify(JSON.parse(requirements));
    } catch {
      requirementsToSave = JSON.stringify(requirements);
    }
  }

  const safe = (v) => (v === undefined || v === '' ? null : v);

  const tender = await prisma.tender.create({
    data: {
      publisherId: parseInt(publisherId),
      title,
      description: safe(description),
      deadline: deadline ? new Date(deadline) : null,
      filePath,
      advertisementImagePath,
      tenderText,
      chunkEmbeddings: req.body.chunkEmbeddings || null,
      status: 'active',
      value: safe(value),
      category: safe(category),
      preBidMeetingDate: preBidMeetingDate ? new Date(preBidMeetingDate) : null,
      preBidMeetingTime: safe(preBidMeetingTime),
      region: safe(region),
      contactPersonName: safe(contactPersonName),
      contactNumber: safe(contactNumber),
      contactEmail: safe(contactEmail),
      companyWebsite: safe(companyWebsite),
      requirements: requirementsToSave,
    }
  });
  res.json(tender);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/ai/cover-letter', async (req, res) => {
  const { tenderText, companyProfile } = req.body;

  // Truncate tenderText to avoid OpenAI context length errors (max 12000 chars)
  const MAX_CHARS = 12000;
  let truncatedText = tenderText;
  if (tenderText && tenderText.length > MAX_CHARS) {
    truncatedText = tenderText.slice(0, MAX_CHARS);
  }

  // Build a detailed prompt
  const prompt = `You are an expert proposal writer. Write a professional, persuasive cover letter for a company bidding on a tender. Use the company's profile and the actual tender document as context. Reference the tender's requirements and the company's strengths, and make the letter specific to this opportunity. Be formal, concise, and highlight why the company is an ideal fit. If any information is missing, use only what is provided.

Company Profile:
${JSON.stringify(companyProfile, null, 2)}

Tender Document:
${truncatedText}

The cover letter should be addressed to the procurement officer and signed by the CEO. Format it as a real business letter.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
    });

    const letter = completion.choices[0].message.content;
    res.json({ letter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.post('/api/ai/summary', async (req, res) => {
  let { tenderText } = req.body;
  // Truncate tenderText to avoid OpenAI context length errors (max 12000 chars)
  const MAX_CHARS = 12000;
  if (tenderText && tenderText.length > MAX_CHARS) {
    tenderText = tenderText.slice(0, MAX_CHARS);
  }

  const prompt = `You are an expert at extracting structured information from unstructured documents. I will give you the full text of a Request for Proposal (RFP) document. Extract the following information as comprehensively and specifically as possible, using only details clearly present in the document. If an item is not found, state "Not specified" and explain briefly.

1. Detailed Brief Description (3-5 sentences summarizing the main project, its background, objectives, and expected outcomes)
2. Project Background (Context, history, and rationale for the project)
3. Objectives (Key goals and what the project aims to achieve)
4. Deliverables (List of expected deliverables or outputs)
5. Value (Total project value or cost, if available)
6. Source of Funds (How the project is to be funded)
7. Experience Criteria (Requirements for prior experience of the bidder)
8. Financial Criteria (Financial requirements for the bidder, such as turnover, assets, etc.)
9. Time Duration (Duration of the contract, project, or deliverables)
10. Evaluation Criteria (How bids will be evaluated, if specified)
11. Special Requirements (Any special conditions, requirements, or constraints)
12. Risks or Challenges (Any risks, challenges, or constraints mentioned)
13. Contact Details (Contact person, email, phone, or address if available)

Please use clear, numbered headings and keep answers as detailed and direct as possible. If the answer is inferred or based on interpretation, say so. 

Here is the document:

<<DOCUMENT>>`;

  // Replace <<DOCUMENT>> with the actual tender text
  const finalPrompt = prompt.replace('<<DOCUMENT>>', tenderText);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: finalPrompt }],
      max_tokens: 900,
    });

    // Try to parse the response as JSON if possible, otherwise return as plain text
    let content = completion.choices[0].message.content.trim();
    // Remove code block markers if present
    if (content.startsWith('```json')) content = content.replace(/^```json/, '').trim();
    if (content.startsWith('```')) content = content.replace(/^```/, '').trim();
    if (content.endsWith('```')) content = content.replace(/```$/, '').trim();

    // Try to parse as JSON, otherwise return as plain text
    let structured;
    try {
      structured = JSON.parse(content);
      // Ensure all fields are present
      const keys = [
        "briefDescription",
        "value",
        "sourceOfFunds",
        "experienceCriteria",
        "financialCriteria",
        "timeDuration",
        "specialRequirements"
      ];
      for (const k of keys) {
        if (!structured[k]) structured[k] = "Not specified";
      }
      res.json(structured);
    } catch (e) {
      // If not JSON, return as plain text
      res.json({ summary: content });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  let { tenderText, question, tenderId } = req.body;
  // If tenderId is provided, fetch chunkEmbeddings and tenderText from DB
  let chunkEmbeddings = null;
  let dbTenderText = null;
  if (tenderId) {
    const tender = await prisma.tender.findUnique({ where: { id: parseInt(tenderId) } });
    if (tender) {
      dbTenderText = tender.tenderText;
      if (tender.chunkEmbeddings) {
        try {
          chunkEmbeddings = JSON.parse(tender.chunkEmbeddings);
        } catch {}
      }
    }
  }
  // If not found, fallback to chunking and embedding using tenderText from DB
  if (!chunkEmbeddings && (dbTenderText || tenderText)) {
    const textToChunk = dbTenderText || tenderText;
    const chunkSize = 1500, overlap = 200;
    const chunks = [];
    let i = 0;
    while (i < textToChunk.length) {
      const chunk = textToChunk.slice(i, i + chunkSize);
      chunks.push(chunk);
      i += chunkSize - overlap;
    }
    if (chunks.length > 0) {
      const embeddings = await getEmbeddings(chunks);
      chunkEmbeddings = chunks.map((chunk, idx) => ({ chunk, embedding: embeddings[idx] }));
    }
  }
  // Get embedding for the question
  let selectedChunks = [];
  if (chunkEmbeddings && question) {
    const questionEmbedding = (await getEmbeddings([question]))[0];
    // Score each chunk by cosine similarity
    const scored = chunkEmbeddings.map(obj => ({ chunk: obj.chunk, score: cosineSimilarity(obj.embedding, questionEmbedding) }));
    scored.sort((a, b) => b.score - a.score);
    selectedChunks = scored.slice(0, 5).map(s => s.chunk); // Use top 5 chunks
  }
  // Fallback: if no relevant chunk found, use the first chunk
  const fallbackText = dbTenderText || tenderText || '';
  if (selectedChunks.length === 0 && fallbackText) {
    selectedChunks = [fallbackText.slice(0, 1500)];
  }
  const contextText = selectedChunks.join('\n\n---\n\n');
  const systemPrompt = `You are a helpful AI assistant for a tender management platform. The user will ask questions about a tender. Here are the most relevant sections of the tender document for their question. Use ONLY these sections to answer. If the answer is not present, say so.\n\nRelevant Tender Sections:\n${contextText}`;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: question }
  ];
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 400,
    });
    const answer = completion.choices[0].message.content;
    res.json({ answer, retrieval: 'embedding' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI Q&A failed" });
  }
});

app.post('/api/ai/release-letter', async (req, res) => {
  const { tenderTitle, authorizedPerson, companyProfile } = req.body;
  const prompt = `You are an expert business writer. Write a formal letter addressed to ${authorizedPerson} requesting the release of the tender document titled "${tenderTitle}" to the authorized person/office. If company profile is provided, use it for the sender's details. The letter should be concise, polite, and formatted as a real business letter. Sign the letter as the CEO or authorized representative.` + (companyProfile ? `\n\nCompany Profile:\n${JSON.stringify(companyProfile, null, 2)}` : "");
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
    });
    const letter = completion.choices[0].message.content;
    res.json({ letter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI release letter generation failed" });
  }
});

// Example Q&A endpoint (update to always include reference context)
app.post('/api/qa', async (req, res) => {
  try {
    const { question, tenderText } = req.body; // tenderText is the specific tender document (if any)
    // 1. Get relevant framework context
    const referenceChunks = await getRelevantReferenceChunks(question, 5);
    // 2. Build prompt
    let prompt = `You are an AI assistant for tenders. Here are excerpts from the official framework documents:\n`;
    prompt += referenceChunks.map((c, i) => `[Framework ${i+1}]: ${c}`).join('\n');
    if (tenderText) {
      prompt += `\n\nHere is the specific tender document:\n${tenderText}`;
    }
    prompt += `\n\nUser question: ${question}`;
    // 3. Get answer from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful tender and bidding assistant. Always use the framework context if relevant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to list all tables in the database
app.get('/api/db-tables', async (req, res) => {
  try {
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`;
    res.json({ tables: tables.map(t => t.table_name) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Validate email format
function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Helper: Validate password strength (min 8 chars, at least one letter and one number)
function isStrongPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password);
}

// Registration endpoint for admin (bidder or publisher)
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, position } = req.body;
  if (!name || typeof name !== 'string' || name.length < 2) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (!password || !isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include at least one letter and one number.' });
  }
  if (!role || (role !== 'BIDDER' && role !== 'PUBLISHER')) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const safePosition = position && typeof position === 'string' ? position.replace(/[^a-zA-Z0-9 .,-]/g, '') : '';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  try {
    let companyId = null;
    if (role === 'BIDDER') {
      const company = await prisma.company.create({ data: { name: name.trim(), plan: 'BASIC' } });
      companyId = company.id;
    }
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        status: 'INVITED',
        position: safePosition,
        confirmToken: token,
        confirmTokenExpiry: expiry,
        companyId: companyId,
      }
    });
    // Send confirmation email
    const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-email?token=${token}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@bidwizer.com',
      to: email,
      subject: 'Confirm your BidWizer account',
      html: `<div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fb; padding: 40px 0;"><div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px 32px 24px 32px;"><div style="text-align: center; margin-bottom: 24px;"><img src='https://bidwizer.com/logo.png' alt='BidWizer Logo' style='height: 48px; margin-bottom: 8px;' /><h2 style="color: #2d3a4a; font-size: 1.5rem; margin: 0;">Welcome to BidWizer!</h2></div><p style="color: #3b4252; font-size: 1.1rem;">Hello <b>${name}</b>,</p><p style="color: #3b4252;">Thank you for registering your organization with BidWizer. To continue setting up your account, please confirm your email address by clicking the button below. This link will expire in 24 hours.</p><div style="text-align: center; margin: 32px 0;"><a href="${confirmUrl}" style="display: inline-block; background: linear-gradient(90deg, #2563eb, #6366f1); color: #fff; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 1.1rem; letter-spacing: 0.5px;">Confirm Email</a></div><p style="color: #64748b; font-size: 0.97rem;">If you did not request this, you can safely ignore this email.</p><div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} BidWizer. All rights reserved.</div></div></div>`
    });
    res.json({ message: 'Registration successful. Please check your email to confirm your account.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again later.' });
  }
});

// Team member registration endpoint
app.post('/api/team-member-register', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, position, token, inviteEmail } = req.body;
  
  // Validation
  if (!firstName || typeof firstName !== 'string' || firstName.length < 2) {
    return res.status(400).json({ error: 'Invalid first name' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.length < 2) {
    return res.status(400).json({ error: 'Invalid last name' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (!password || !isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include at least one letter and one number.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  if (email.toLowerCase() !== inviteEmail.toLowerCase()) {
    return res.status(400).json({ error: 'Email does not match the invitation' });
  }
  if (!token) {
    return res.status(400).json({ error: 'Invalid invitation token' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // TODO: In a real implementation, you would validate the token against a stored invitation
    // For now, we'll create the user directly
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const safePosition = position && typeof position === 'string' ? position.replace(/[^a-zA-Z0-9 .,-]/g, '') : '';

    // Create the user as a team member (BIDDER role, but not admin)
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'BIDDER',
        status: 'ACTIVE', // Team members are immediately active
        position: safePosition,
        // Note: companyId should be set based on the invitation token in a real implementation
        // For now, we'll leave it null and handle it in the business logic
      }
    });

    res.json({ 
      message: 'Account created successfully. You can now login.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.error('Team member registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again later.' });
  }
});

// Email confirmation endpoint
app.get('/api/confirm-email', async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) {
      return res.status(400).json({ error: 'Missing token or email.' });
    }
    const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
    if (!user || user.confirmToken !== token) {
      return res.status(400).json({ error: 'Invalid or expired confirmation link.' });
    }
    // Check token expiry
    if (!user.confirmTokenExpiry || new Date() > new Date(user.confirmTokenExpiry)) {
      return res.status(400).json({ error: 'Confirmation link has expired. Please register again.' });
    }
    await prisma.user.update({
      where: { email: String(email).toLowerCase() },
      data: { status: 'ACTIVE', confirmToken: null, confirmTokenExpiry: null },
    });
    res.json({ message: 'Email confirmed! You can now log in.' });
  } catch (err) {
    console.error('Email confirmation error:', err);
    res.status(500).json({ error: 'Email confirmation failed. Please try again later.' });
  }
});

// Invite team members endpoint (company-centric)
app.post('/api/invite-team', async (req, res) => {
  const { adminEmail, teamMembers } = req.body;
  if (!adminEmail || !isValidEmail(adminEmail)) {
    return res.status(400).json({ error: 'Missing or invalid admin email.' });
  }
  if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
    return res.status(400).json({ error: 'No team members provided.' });
  }
  // Find the admin user and their company
  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail.toLowerCase() }, include: { company: true } });
  if (!adminUser || adminUser.role !== 'BIDDER' || !adminUser.companyId) {
    return res.status(400).json({ error: 'Admin user or company not found.' });
  }
  const company = adminUser.company;
  if (!company) {
    return res.status(400).json({ error: 'Company not found.' });
  }
  // Count current users in the company
  const currentCount = await prisma.user.count({ where: { companyId: company.id } });
  // Determine max allowed based on plan
  const maxAccounts = company.plan === 'PRO' ? 5 : 4;
  if (currentCount + teamMembers.length > maxAccounts) {
    return res.status(400).json({ error: `Your plan allows up to ${maxAccounts} accounts (including admin). You already have ${currentCount}.` });
  }
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  let sent = 0;
  for (const email of teamMembers) {
    const token = randomBytes(24).toString('hex');
    const inviteUrl = `${frontendUrl}/join-team?email=${encodeURIComponent(email)}&token=${token}`;
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@bidwizer.com',
        to: email,
        subject: 'You are invited to join a BidWizer company',
        html: `<div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fb; padding: 40px 0;"><div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px 32px 24px 32px;"><div style="text-align: center; margin-bottom: 24px;"><img src='https://bidwizer.com/logo.png' alt='BidWizer Logo' style='height: 48px; margin-bottom: 8px;' /><h2 style="color: #2d3a4a; font-size: 1.5rem; margin: 0;">You've been invited to join a company!</h2></div><p style="color: #3b4252; font-size: 1.1rem;">Hello,</p><p style="color: #3b4252;">You have been invited to join a company on BidWizer. Click the button below to create your account and join the company.</p><div style="text-align: center; margin: 32px 0;"><a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(90deg, #2563eb, #6366f1); color: #fff; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 1.1rem; letter-spacing: 0.5px;">Join Company</a></div><p style="color: #64748b; font-size: 0.97rem;">If you did not expect this invitation, you can safely ignore this email.</p><div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} BidWizer. All rights reserved.</div></div></div>`
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send invite to ${email}:`, err);
    }
  }
  res.json({ message: `Invitations sent to ${sent} team members.` });
});

// --- Company Document Management ---
// Upload a document (BIDDER only)
app.post('/api/documents', authenticateJWT, documentUpload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'BIDDER' || !user.companyId) {
      return res.status(403).json({ error: 'Only bidder users with a company can upload documents.' });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    // File type and size validation
    const allowedTypes = ['.pdf', '.docx', '.xlsx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      fs.unlinkSync(req.file.path); // Remove invalid file
      return res.status(400).json({ error: 'Unsupported file type.' });
    }
    if (req.file.size > 10 * 1024 * 1024) { // 10MB
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File too large (max 10MB).' });
    }

    const newPath = req.file.path + ext;
    fs.renameSync(req.file.path, newPath);
    const filePath = newPath.replace(/\\/g, '/');

    const { name, type, category, description, tags } = req.body;
    const document = await prisma.document.create({
      data: {
        companyId: user.companyId,
        uploadedById: userId,
        name: name || req.file.originalname,
        type: type || req.file.mimetype,
        category: category || null,
        description: description || null,
        filePath,
        tags: tags ? JSON.parse(tags) : [],
        status: 'active',
        metadata: {
          size: req.file.size,
          originalname: req.file.originalname,
        },
      },
    });
    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

// List all documents for the user's team
app.get('/api/documents', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.companyId) return res.status(403).json({ error: 'User must belong to a company.' });
    const documents = await prisma.document.findMany({ where: { companyId: user.companyId, status: 'active' }, orderBy: { uploadDate: 'desc' } });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

// Download a document (team only)
app.get('/api/documents/:id/download', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const docId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const document = await prisma.document.findUnique({ where: { id: docId } });
    if (!document || document.companyId !== user.companyId) return res.status(403).json({ error: 'Access denied.' });
    res.download(path.join(__dirname, '..', document.filePath), document.name);
  } catch (err) {
    res.status(500).json({ error: 'Download failed.' });
  }
});

// Delete a document (soft delete)
app.delete('/api/documents/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const docId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const document = await prisma.document.findUnique({ where: { id: docId } });
    if (!document || document.companyId !== user.companyId) return res.status(403).json({ error: 'Access denied.' });
    await prisma.document.update({ where: { id: docId }, data: { status: 'deleted' } });
    res.json({ message: 'Document deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
