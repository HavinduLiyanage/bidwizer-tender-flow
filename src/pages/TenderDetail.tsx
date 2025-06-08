
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
  Download, 
  Clock, 
  Users, 
  Zap,
  Eye,
  MessageSquare
} from "lucide-react";

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const { toast } = useToast();

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

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setSummary("");
    const res = await fetch("http://localhost:4000/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderText: tender.fullDescription }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoadingSummary(false);
  };

  const handleAsk = async () => {
    if (!question) return;
    setLoadingAnswer(true);
    setAnswer("");
    const res = await fetch("http://localhost:4000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderText: tender.fullDescription, question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoadingAnswer(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{tender.description}</p>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
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
                    <Button asChild>
                      <a
                        href={`http://localhost:4000/${tender.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
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
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => navigate(`/ai-tools/${tender.id}`)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Launch AI Analysis
                </Button>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleSummarize}
                    disabled={loadingSummary}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {loadingSummary ? "Summarizing..." : "Quick Summary"}
                  </Button>
                  
                  {summary && (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-800 border">
                      <strong className="text-blue-900">Summary:</strong> {summary}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask about this tender..."
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleAsk}
                    disabled={loadingAnswer || !question}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {loadingAnswer ? "Asking..." : "Ask AI"}
                  </Button>
                  
                  {answer && (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-800 border">
                      <strong className="text-blue-900">AI Answer:</strong> {answer}
                    </div>
                  )}
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
