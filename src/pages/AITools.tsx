import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Download, RefreshCw, Zap, CheckCircle, Clock, FileText, Bot, MessageSquare, Send, Users, Building2, Mail, Phone, MapPin, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIChat from "@/components/AIChat";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import jsPDF from "jspdf";

const SUPPLEMENTARY_DOCS = [
  { key: 'environmentalLicense', label: 'Environmental License' },
  { key: 'isoCertificate', label: 'ISO Certificate' },
  { key: 'companyProfile', label: 'Company Profile' },
  { key: 'tradeLicense', label: 'Trade License' },
  { key: 'brochure', label: 'Brochure' },
  { key: 'financialReports', label: 'Last 5 Years of Financial Reports' },
  { key: 'staffDetail', label: 'Staff Detail' },
  { key: 'availabilityOfFunds', label: 'Availability of Funds' },
  { key: 'awards', label: 'Awards' },
];

const AITools = () => {
  const { tenderId } = useParams();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [teamMessage, setTeamMessage] = useState("");
  const [brief, setBrief] = useState<any>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [tenderText, setTenderText] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [coverLetterError, setCoverLetterError] = useState<string | null>(null);
  const [tenderTitle, setTenderTitle] = useState("");
  const [releaseLetter, setReleaseLetter] = useState("");
  const [releaseLetterLoading, setReleaseLetterLoading] = useState(false);
  const [releaseLetterError, setReleaseLetterError] = useState<string | null>(null);
  const [showReleaseLetter, setShowReleaseLetter] = useState(false);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  // Dummy company data
  const companyData = {
    name: "SunWorks Ltd",
    ceo: "Jane Silva",
    address: "1234 Innovation Drive, San Francisco, CA 94107",
    phone: "(555) 123-4567",
    email: "contact@sunworks.com",
    license: "CA-ELE-2023-8901"
  };

  // Tender publisher company profile
  const publisherData = {
    name: "California Department of Energy",
    type: "Government Agency",
    contact: "procurement@energy.ca.gov",
    phone: "(916) 654-4058",
    address: "1516 9th Street, Sacramento, CA 95814",
    website: "www.energy.ca.gov",
    established: "1975",
    employees: "2,500+",
    description: "The California Energy Commission is the state's primary energy policy and planning agency, committed to reducing energy costs and environmental impacts while ensuring a safe, resilient, and clean energy system."
  };

  // Team members data
  const teamMembers = [
    { name: "Mike Johnson", role: "Project Manager", email: "mike@sunworks.com", status: "online" },
    { name: "Sarah Wilson", role: "Technical Lead", email: "sarah@sunworks.com", status: "online" },
    { name: "David Chen", role: "Financial Analyst", email: "david@sunworks.com", status: "offline" },
    { name: "Lisa Rodriguez", role: "Legal Counsel", email: "lisa@sunworks.com", status: "away" }
  ];

  // Updated AI analysis results with new content
  const analysisResults = {
    tenderBrief: `TENDER BRIEF SUMMARY

Project: Construction of 10MW Solar Power Facility
Publisher: California Department of Energy
Location: Riverside County, California
Contract Type: Design-Build-Operate

Key Project Details:
• Solar photovoltaic installation capacity: 10MW
• Grid interconnection required with Southern California Edison
• 25-year operational period with performance guarantees
• Environmental compliance and permitting included
• Local workforce preference (10% scoring weight)

Technical Specifications:
• Minimum 98% inverter efficiency requirement
• Tier 1 solar panels with 25-year warranty
• Smart monitoring and control systems
• Grid-tied configuration with revenue metering

Submission Requirements:
• Technical proposal with detailed design
• Financial proposal with lifecycle costs
• Company qualifications and experience portfolio
• Project timeline and resource allocation plan
• Safety and quality management procedures

Evaluation Criteria:
• Technical approach and innovation (40%)
• Experience and qualifications (30%)
• Price competitiveness (20%)
• Local economic impact (10%)`,

    supplementaryDocuments: `SUPPLEMENTARY DOCUMENTS CHECKLIST

Required Documentation Package:

1. CORPORATE DOCUMENTS
   ✓ Certificate of Incorporation
   ✓ Business License and Permits
   ✓ Professional Liability Insurance ($2M minimum)
   ✓ Workers' Compensation Insurance
   ✓ Bonding Capacity Documentation

2. TECHNICAL CERTIFICATIONS
   ✓ Electrical Contractor License (CA-ELE-2023-8901)
   ✓ NABCEP Solar Installation Certifications
   ✓ OSHA 30-Hour Safety Training Certificates
   ✓ Equipment Manufacturer Authorizations
   ✓ Grid Interconnection Experience Letters

3. FINANCIAL DOCUMENTATION
   ✓ Audited Financial Statements (Last 3 years)
   ✓ Bank References and Credit Rating
   ✓ Working Capital Verification ($1M+ required)
   ✓ Performance Bond Capacity Confirmation
   ✓ Project-Specific Financial Guarantees

4. PROJECT PORTFOLIO
   ✓ Similar Solar Project Case Studies (>5MW)
   ✓ Government Contract References
   ✓ Client Testimonials and Recommendations
   ✓ Project Photos and Performance Data
   ✓ Warranty and Maintenance Records

5. COMPLIANCE DOCUMENTATION
   ✓ Environmental Management Plan
   ✓ Safety Management System Documentation
   ✓ Quality Assurance Procedures
   ✓ Local Workforce Development Plan
   ✓ Minority Business Enterprise Certifications

6. TECHNICAL SUBMITTALS
   ✓ Preliminary Design Drawings
   ✓ Equipment Specifications and Data Sheets
   ✓ System Performance Calculations
   ✓ Interconnection Study Results
   ✓ Environmental Impact Assessment

Note: All documents must be current, notarized where required, and submitted in both digital and hard copy formats as specified in the tender requirements.`
  };

  // Simulate company uploaded docs (in real app, fetch from backend)
  const companyDocs = SUPPLEMENTARY_DOCS.map(doc => ({
    ...doc,
    uploaded: true, // Assume all are uploaded for now
    fileName: `${doc.label.replace(/ /g, '_').toLowerCase()}.pdf`,
  }));

  const handleDocToggle = (key: string) => {
    setSelectedDocs(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  useEffect(() => {
    const fetchBrief = async () => {
      setBriefLoading(true);
      setBriefError(null);
      try {
        // Fetch the tender details to get the extracted text and title
        const tenderRes = await fetch(`http://localhost:4000/api/tenders/${tenderId}`);
        const tenderData = await tenderRes.json();
        setTenderText(tenderData.tenderText || "");
        setTenderTitle(tenderData.title || "");
        // Fetch the structured summary from the backend
        const res = await fetch("http://localhost:4000/api/ai/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenderText: tenderData.tenderText || "" })
        });
        const data = await res.json();
        setBrief(data);
      } catch (err) {
        setBriefError("Failed to load tender brief.");
      } finally {
        setBriefLoading(false);
      }
    };
    fetchBrief();
  }, [tenderId]);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete",
        description: "AI has successfully analyzed the tender requirements.",
      });
    }, 3000);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${type} has been copied to your clipboard.`,
    });
  };

  const handleReleaseDocument = async () => {
    setReleaseLetter("");
    setReleaseLetterError(null);
    setReleaseLetterLoading(true);
    setReleaseDialogOpen(true);
    try {
      const response = await fetch("http://localhost:4000/api/ai/release-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderTitle,
          authorizedPerson: publisherData.contact || publisherData.name || "Authorized Officer",
          companyProfile: companyData
        })
      });
      const data = await response.json();
      if (data.letter) {
        setReleaseLetter(data.letter);
      } else {
        setReleaseLetterError("Failed to generate release letter.");
      }
    } catch (err) {
      setReleaseLetterError("Failed to generate release letter.");
    } finally {
      setReleaseLetterLoading(false);
    }
  };

  const handleSendTeamMessage = () => {
    if (!teamMessage.trim()) return;
    
    toast({
      title: "Message Sent",
      description: `Message sent to all team members regarding tender ${tenderId}.`,
    });
    setTeamMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const generateCoverLetter = async () => {
    setCoverLetterLoading(true);
    setCoverLetterError(null);
    try {
      const response = await fetch("http://localhost:4000/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderText,
          companyProfile: companyData
        })
      });
      const data = await response.json();
      if (data.letter) {
        setCoverLetter(data.letter);
      } else {
        setCoverLetterError("Failed to generate cover letter.");
      }
    } catch (err) {
      setCoverLetterError("Failed to generate cover letter.");
    } finally {
      setCoverLetterLoading(false);
    }
  };

  useEffect(() => {
    if (analysisComplete && tenderText && companyData) {
      generateCoverLetter();
    }
    // eslint-disable-next-line
  }, [analysisComplete, tenderText]);

  const handleDownloadReleaseLetter = () => {
    if (!releaseLetter) return;
    const doc = new jsPDF();
    // Split text into lines for PDF
    const lines = doc.splitTextToSize(releaseLetter, 180);
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(lines, 15, 20);
    doc.save("release-letter.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* Logo removed */}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to={`/tender/${tenderId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tender
                </Button>
              </Link>
              <div className="text-sm text-gray-600">
                {companyData.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Analysis Tools</h1>
          <p className="text-gray-600">Analyze the tender and generate professional responses using AI</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!analysisComplete && !isAnalyzing && (
                  <Button 
                    onClick={handleRunAnalysis}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Run Analysis
                  </Button>
                )}
                
                {isAnalyzing && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing tender...</span>
                  </div>
                )}
                
                {analysisComplete && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Analysis Complete</span>
                  </div>
                )}

                {analysisComplete && (
                  <>
                    <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={handleReleaseDocument}
                          variant="outline"
                          className="w-full mt-4"
                          disabled={releaseLetterLoading}
                        >
                          <Send className="w-4 h-4 mr-2" />Release to Office
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl w-full h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex justify-between items-center w-full">
                            <DialogTitle>Release Letter</DialogTitle>
                          </div>
                        </DialogHeader>
                        {releaseLetterLoading ? (
                          <div className="text-xs text-blue-600 mt-2">Generating release letter...</div>
                        ) : releaseLetterError ? (
                          <div className="text-xs text-red-600 mt-2">{releaseLetterError}</div>
                        ) : releaseLetter ? (
                          <>
                            <pre className="whitespace-pre-wrap text-base text-gray-800 font-serif leading-relaxed mb-4 max-h-[60vh] overflow-y-auto bg-white p-4 rounded shadow-inner border">
                              {releaseLetter}
                            </pre>
                            <div className="text-sm text-gray-700 mb-4">
                              The download button below will download all relevant documents for this tender for your company, including the cover letter, release letter, and selected supplementary documents.
                            </div>
                            <Button size="lg" variant="default" onClick={handleDownloadReleaseLetter}>
                              Download All Documents
                            </Button>
                          </>
                        ) : null}
                      </DialogContent>
                    </Dialog>
                    <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full mt-2"
                          disabled={selectedDocs.length === 0}
                        >
                          Download Relevant Documents
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg w-full">
                        <DialogHeader>
                          <DialogTitle>Download Confirmation</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="mb-2 text-gray-700">You are about to download the following files:</p>
                          <ul className="list-disc pl-6 text-sm text-gray-800 mb-4">
                            <li>Cover Letter (docx)</li>
                            <li>Release Letter (docx)</li>
                            {selectedDocs.map(key => {
                              const doc = companyDocs.find(d => d.key === key);
                              return doc ? <li key={key}>{doc.label} ({doc.fileName})</li> : null;
                            })}
                          </ul>
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button variant="default" onClick={() => { setDownloadDialogOpen(false); toast({ title: 'Download started', description: 'Your files are being prepared.' }); }}>Confirm Download</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>Tender: Solar Power Facility</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3 h-3" />
                    <span>4 documents processed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Publisher Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-sm">{publisherData.name}</div>
                  <div className="text-xs text-gray-600">{publisherData.type}</div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span>{publisherData.contact}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>{publisherData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs">{publisherData.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-3 h-3 text-gray-400" />
                    <span>Est. {publisherData.established}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 pt-2 border-t">
                  <p>{publisherData.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Company Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{companyData.name}</span>
                </div>
                <div className="text-gray-600">
                  CEO: {companyData.ceo}
                </div>
                <div className="text-gray-600">
                  License: {companyData.license}
                </div>
                <div className="text-gray-600">
                  Solar Experience: 8+ years
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="tender-brief" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tender-brief">Tender Brief</TabsTrigger>
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                <TabsTrigger value="supplementary">Supplementary Documents</TabsTrigger>
                <TabsTrigger value="chat">Chat with Bid Document</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tender-brief" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Tender Brief Summary
                    </CardTitle>
                    <CardDescription>
                      AI-extracted key tender information and requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="font-semibold">You must run AI analysis to activate this feature.</p>
                        <p>Click the <b>Run Analysis</b> button in the left panel to get started.</p>
                      </div>
                    ) : briefLoading ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Loading tender brief...</p>
                      </div>
                    ) : briefError ? (
                      <div className="text-center py-12 text-red-500">{briefError}</div>
                    ) : !brief ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Run AI analysis to see tender brief</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {typeof brief.summary === 'string' ? (
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{brief.summary}</pre>
                        ) : (
                          <ul className="list-disc pl-6 text-sm text-gray-700">
                            <li><b>Brief Description:</b> {brief.briefDescription}</li>
                            <li><b>Value:</b> {brief.value}</li>
                            <li><b>Source of Funds:</b> {brief.sourceOfFunds}</li>
                            <li><b>Experience Criteria:</b> {brief.experienceCriteria}</li>
                            <li><b>Financial Criteria:</b> {brief.financialCriteria}</li>
                            <li><b>Time Duration:</b> {brief.timeDuration}</li>
                            <li><b>Special Requirements:</b> {brief.specialRequirements}</li>
                          </ul>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cover-letter" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      AI-Generated Cover Letter
                    </CardTitle>
                    <CardDescription>
                      Professional cover letter tailored to this tender
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="font-semibold">You must run AI analysis to activate this feature.</p>
                        <p>Click the <b>Run Analysis</b> button in the left panel to get started.</p>
                      </div>
                    ) : coverLetterLoading ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50 animate-spin" />
                        <p>Generating cover letter...</p>
                      </div>
                    ) : coverLetterError ? (
                      <div className="text-center py-12 text-red-500">{coverLetterError}</div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-white border p-6 rounded-lg shadow-sm">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-serif leading-relaxed">
                            {coverLetter}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="supplementary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Supplementary Documents Checklist
                    </CardTitle>
                    <CardDescription>
                      Select the documents you want to include for this tender
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="font-semibold">You must run AI analysis to activate this feature.</p>
                        <p>Click the <b>Run Analysis</b> button in the left panel to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 mb-6">
                        {companyDocs.map(doc => (
                          <label key={doc.key} className={`flex items-center space-x-3 p-2 rounded ${!doc.uploaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                              type="checkbox"
                              checked={selectedDocs.includes(doc.key)}
                              onChange={() => handleDocToggle(doc.key)}
                              disabled={!doc.uploaded}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-sm">{doc.label}</span>
                            {!doc.uploaded && <span className="text-xs text-red-500 ml-2">Not uploaded</span>}
                          </label>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Chat with Bid Document
                    </CardTitle>
                    <CardDescription>
                      Ask questions about the tender requirements, documents, or get personalized advice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="font-semibold">You must run AI analysis to activate this feature.</p>
                        <p>Click the <b>Run Analysis</b> button in the left panel to get started.</p>
                      </div>
                    ) : (
                      <AIChat 
                        tenderId={tenderId as string}
                        tenderTitle={tenderTitle}
                        isAnalysisComplete={analysisComplete}
                        tenderText={tenderText}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
