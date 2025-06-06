
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Building, Download, ArrowLeft, Zap, Users, Bot } from "lucide-react";

const TenderDetail = () => {
  const { id } = useParams();
  
  // Dummy tender data - in real app this would come from API
  const tender = {
    id: id,
    title: "Construction of Solar Power Facility",
    summary: "Government project requiring the design and construction of a 10MW solar power station in the industrial district. The project includes site preparation, installation of solar panels, electrical infrastructure, and grid connection.",
    fullDescription: `The Department of Energy is seeking qualified contractors for the design, construction, and commissioning of a 10MW solar photovoltaic power generation facility. The project scope includes:

• Site preparation and civil works
• Procurement and installation of solar panels and mounting systems  
• Electrical infrastructure including inverters, transformers, and switchgear
• Grid connection and utility interconnection
• Testing, commissioning, and performance validation
• 25-year operations and maintenance contract

The facility must meet all applicable building codes, electrical standards, and environmental regulations. Contractors must demonstrate experience with utility-scale solar installations and provide comprehensive warranties.`,
    deadline: "2025-07-30",
    publishedDate: "2025-01-15",
    region: "California, USA",
    value: "$2.5M - $5M",
    category: "Construction & Energy",
    status: "Open",
    requirements: [
      "Licensed electrical contractor certification",
      "Minimum 5 years utility-scale solar experience", 
      "Financial capacity of $1M+ working capital",
      "Environmental compliance certifications",
      "Local workforce hiring preference"
    ],
    documents: [
      { name: "Request for Proposal (RFP)", size: "2.4 MB", type: "PDF" },
      { name: "Technical Specifications", size: "1.8 MB", type: "PDF" },
      { name: "Site Survey Report", size: "5.2 MB", type: "PDF" },
      { name: "Environmental Assessment", size: "3.1 MB", type: "PDF" }
    ]
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
              <Link to="/" className="text-2xl font-bold text-gray-900">
                BidWizer
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="text-sm text-gray-600">
                SunWorks Ltd
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{tender.title}</CardTitle>
                    <CardDescription className="text-base">{tender.summary}</CardDescription>
                  </div>
                  <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    {tender.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {new Date(tender.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {tender.region}
                  </div>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {tender.category}
                  </div>
                  <div className="font-medium text-green-600">
                    {tender.value}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Full Description</h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {tender.fullDescription.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 whitespace-pre-line">{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Requirements</h3>
                  <ul className="space-y-2">
                    {tender.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tender Documents</CardTitle>
                <CardDescription>Download all available documents and specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tender.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-red-600 font-semibold text-xs">{doc.type}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Bot className="w-5 h-5 mr-2" />
                  AI Tools
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Use AI to analyze this tender and generate responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/ai-tools/${tender.id}`} className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Launch AI Analysis
                  </Button>
                </Link>
                
                <div className="text-sm text-blue-700 space-y-1">
                  <p>✨ Analyze requirements automatically</p>
                  <p>📄 Generate cover letter</p>
                  <p>📝 Create proposal structure</p>
                  <p>⏰ Track deadlines</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Assign team members to work on this tender:</p>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Assign Team Members
                </Button>
                
                <div className="text-xs text-gray-500">
                  Currently unassigned
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tender Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium">{new Date(tender.publishedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium text-red-600">{new Date(tender.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Days Remaining:</span>
                  <span className="font-bold text-orange-600">
                    {Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
