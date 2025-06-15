const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Login endpoint (dummy, no JWT yet)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// Get all tenders
app.get('/api/tenders', async (req, res) => {
  const tenders = await prisma.tender.findMany({ include: { publisher: true } });
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
app.post('/api/tenders', upload.fields([
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
  const { companyName, ceoName, tenderTitle, tenderSummary } = req.body;

  const prompt = `
Write a professional cover letter for a company bidding on a tender.
Company Name: ${companyName}
CEO Name: ${ceoName}
Tender Title: ${tenderTitle}
Tender Summary: ${tenderSummary}

The letter should be formal, concise, and highlight the company's strengths.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
    });

    const letter = completion.choices[0].message.content;
    res.json({ letter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.post('/api/ai/summary', async (req, res) => {
  const { tenderText } = req.body;

  const prompt = `Summarize the following tender document in plain language for a business team:\n\n${tenderText}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const { tenderText, question } = req.body;

  const prompt = `
Given the following tender document:

${tenderText}

Answer this question as clearly and concisely as possible for a business team:
${question}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI Q&A failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));