import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Download, RefreshCw, Zap, CheckCircle, Clock, FileText, Bot, MessageSquare, Send, Users, Building2, Mail, Phone, MapPin, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIChat from "@/components/AIChat";

const AITools = () => {
  const { tenderId } = useParams();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

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

    coverLetter: `Dear Procurement Officer,

${companyData.name} is pleased to submit our proposal for the Construction of Solar Power Facility tender. As a leading solar contractor with over 8 years of experience in utility-scale installations, we are uniquely positioned to deliver this critical infrastructure project.

Our company has successfully completed 15+ utility-scale solar projects totaling over 150MW across California, including similar 10MW installations for municipal and state agencies. Our certified team of engineers and electricians brings deep expertise in grid-tied solar systems, regulatory compliance, and project management.

Key qualifications that make us the ideal partner:

• Licensed electrical contractor (License #${companyData.license})
• Proven track record with government solar projects
• Strong financial position with $2.5M working capital  
• Commitment to local workforce development
• ISO 9001 certified quality management systems

We understand the critical importance of this renewable energy initiative and are committed to delivering exceptional value while meeting all technical specifications and timeline requirements. Our proposed approach emphasizes quality, safety, and long-term performance.

We look forward to the opportunity to discuss how ${companyData.name} can contribute to this important sustainability project.

Sincerely,

${companyData.ceo}
Chief Executive Officer
${companyData.name}
${companyData.phone} | ${companyData.email}`,

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

  const handleReleaseDocument = () => {
    toast({
      title: "Document Released",
      description: "Tender document has been released to relevant office personnel.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">BidWizer AI Tools</span>
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
                  <Button 
                    onClick={handleReleaseDocument}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Release to Office
                  </Button>
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
                      {analysisComplete && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopy(analysisResults.tenderBrief, "Tender brief")}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription>
                      AI-generated summary of key tender information and requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Run AI analysis to see tender brief</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {analysisResults.tenderBrief}
                        </pre>
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
                      {analysisComplete && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopy(analysisResults.coverLetter, "Cover letter")}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export DOC
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Professional cover letter tailored to this tender
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Run AI analysis to generate cover letter</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-white border p-6 rounded-lg shadow-sm">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-serif leading-relaxed">
                            {analysisResults.coverLetter}
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
                      {analysisComplete && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopy(analysisResults.supplementaryDocuments, "Supplementary documents")}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Required documents and certifications for tender submission
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Run AI analysis to generate document checklist</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {analysisResults.supplementaryDocuments}
                        </pre>
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
                    <AIChat 
                      tenderTitle="Construction of Solar Power Facility"
                      isAnalysisComplete={analysisComplete}
                    />
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
