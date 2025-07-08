import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Building, 
  DollarSign, 
  FileText, 
  Eye, 
  Clock, 
  Users, 
  Zap
} from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

// Set workerSrc using the public directory to avoid Vite import issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/tenders/${id}`);
        const data = await res.json();
        setTender(data);
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch tender.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchTender();
  }, [id, toast]);

  const getStatusColor = (deadline: string) => {
    const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 7) return "destructive";
    if (daysLeft < 14) return "secondary";
    return "default";
  };

  const getDaysLeft = (deadline: string) => {
    const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tender details...</p>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tender Not Found</h2>
            <p className="text-gray-600 mb-4">The tender you're looking for doesn't exist or may have been removed.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysLeft = getDaysLeft(tender.deadline);
  const normalizedPath = tender.filePath ? tender.filePath.replace(/\\/g, '/') : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* Logo removed */}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">Jane Silva</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-gray-900">{tender.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {tender.category || "Government"}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tender.region || "California"}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {tender.value || "$2.5M - $5M"}
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(tender.deadline)}>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Submission Deadline</h4>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(tender.deadline).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Estimated Value</h4>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {tender.value || "$2.5M - $5M"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advertisement Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Project Advertisement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tender.advertisementImagePath ? (
                  <div className="flex justify-center items-center">
                    <img
                      src={`http://localhost:4000/${tender.advertisementImagePath}`}
                      alt="Advertisement"
                      className="rounded-lg max-h-64 object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600">No Advertisement Image</p>
                        <p className="text-sm text-gray-500 mt-2">Project promotional content from publisher</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            {tender.requirements && Array.isArray(tender.requirements) && tender.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Key Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 text-gray-700">
                    {tender.requirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <div><span className="font-medium">Name:</span> {tender.contactPersonName || 'N/A'}</div>
                  <div><span className="font-medium">Phone:</span> {tender.contactNumber || 'N/A'}</div>
                  <div><span className="font-medium">Email:</span> {tender.contactEmail || 'N/A'}</div>
                  {tender.companyWebsite && (
                    <div><span className="font-medium">Website:</span> <a href={tender.companyWebsite} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{tender.companyWebsite}</a></div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Tender Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Tender Document Package</h4>
                        <p className="text-sm text-gray-600">Complete specifications and requirements</p>
                      </div>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="mt-2" onClick={() => setOpen(true)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
                        <div
                          style={{
                            flex: 1,
                            overflow: "auto",
                            position: "relative",
                            userSelect: "none",
                          }}
                          onContextMenu={e => e.preventDefault()}
                        >
                          <Document
                            file={`http://localhost:4000/${normalizedPath}`}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading="Loading PDF..."
                            renderMode="canvas"
                          >
                            {Array.from(new Array(numPages), (el, index) => (
                              <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                              />
                            ))}
                          </Document>
                          {/* Overlay to discourage screenshots */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0, left: 0, right: 0, bottom: 0,
                              pointerEvents: "none",
                              background: "rgba(255,255,255,0.01)",
                              zIndex: 10,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Downloading, printing, and screenshots are restricted for this document.
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Views</span>
                  </div>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Interested</span>
                  </div>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Time Left</span>
                  </div>
                  <span className="font-medium">{daysLeft > 0 ? `${daysLeft} days` : 'Expired'}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Tools */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Bot className="w-5 h-5 mr-2" />
                  AI Tools
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Analyze this tender with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => navigate(`/ai-tools/${tender.id}`)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Launch AI Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
