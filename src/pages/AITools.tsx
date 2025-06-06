
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Download, RefreshCw, Zap, CheckCircle, Clock, FileText, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // Dummy AI analysis results
  const analysisResults = {
    requirements: `Based on the tender analysis, here are the key requirements:

• Technical Requirements:
  - 10MW solar photovoltaic installation
  - Grid-tied system with utility interconnection
  - Inverter efficiency minimum 98%
  - 25-year performance warranty required

• Compliance Requirements:
  - Licensed electrical contractor (✓ You qualify)
  - Environmental impact assessment compliance
  - Local building codes and electrical standards
  - OSHA safety regulations compliance

• Experience Requirements:
  - Minimum 5 years utility-scale solar experience
  - Portfolio of projects >5MW required
  - Financial capacity $1M+ working capital
  - References from government contracts

• Scoring Criteria:
  - Technical approach (40%)
  - Experience and qualifications (30%)
  - Price competitiveness (20%)
  - Local workforce hiring (10%)`,

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

    proposalStructure: `PROPOSAL STRUCTURE - Solar Power Facility Construction

1. EXECUTIVE SUMMARY
   - Project understanding and approach
   - Key value propositions
   - Total project cost summary

2. COMPANY QUALIFICATIONS
   - Company overview and history
   - Relevant project portfolio (focus on 5MW+ projects)
   - Team qualifications and certifications
   - Financial capacity documentation

3. TECHNICAL APPROACH
   - Site assessment and design methodology
   - Solar panel and equipment specifications
   - Electrical infrastructure design
   - Grid interconnection strategy
   - Quality assurance procedures

4. PROJECT MANAGEMENT
   - Project timeline and milestones
   - Resource allocation plan
   - Risk management strategy
   - Safety protocols and OSHA compliance

5. COMPLIANCE & CERTIFICATIONS
   - Licensing and regulatory compliance
   - Environmental compliance plan
   - Local building code adherence
   - Warranty and performance guarantees

6. PRICING & VALUE
   - Detailed cost breakdown
   - Payment schedule
   - Value-added services
   - Long-term maintenance options

7. LOCAL IMPACT
   - Local workforce hiring plan
   - Community engagement strategy
   - Economic impact projections
   - Sustainability commitments

8. APPENDICES
   - Licenses and certifications
   - Reference project case studies
   - Technical specifications
   - Financial statements`
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
          <div className="lg:col-span-1">
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

            <Card className="mt-4">
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
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">Requirements Analysis</TabsTrigger>
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                <TabsTrigger value="proposal">Proposal Structure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      AI Requirements Analysis
                      {analysisComplete && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopy(analysisResults.requirements, "Requirements analysis")}
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
                      AI-extracted key requirements and compliance criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Run AI analysis to see requirements breakdown</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {analysisResults.requirements}
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
              
              <TabsContent value="proposal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      AI Proposal Structure
                      {analysisComplete && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopy(analysisResults.proposalStructure, "Proposal structure")}
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
                      Suggested proposal outline optimized for this tender
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!analysisComplete ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Run AI analysis to generate proposal structure</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {analysisResults.proposalStructure}
                        </pre>
                      </div>
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
