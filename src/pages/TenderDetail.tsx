
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  Zap,
  Send,
  Building2,
  Mail,
  Phone,
  Award
} from "lucide-react";

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("");
  const [individualMessage, setIndividualMessage] = useState<string>("");
  const { toast } = useToast();

  // Company data
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

  const getTeamStatusColor = (status: string) => {
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

  const handleSendIndividualMessage = () => {
    if (!individualMessage.trim() || !selectedTeamMember) return;
    
    const member = teamMembers.find(m => m.name === selectedTeamMember);
    toast({
      title: "Message Sent",
      description: `Message sent to ${member?.name} regarding tender ${id}.`,
    });
    setIndividualMessage("");
    setSelectedTeamMember("");
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

            {/* Advertisement Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Project Advertisement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600">Advertisement Image</p>
                      <p className="text-sm text-gray-500 mt-2">Project promotional content from publisher</p>
                    </div>
                  </div>
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
                    <Button asChild>
                      <a
                        href={`http://localhost:4000/${tender.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Collaboration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Team Collaboration
                </CardTitle>
                <CardDescription className="text-xs">
                  CEO can send messages to individual team members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Select Team Member</label>
                  <select
                    value={selectedTeamMember}
                    onChange={(e) => setSelectedTeamMember(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="">Choose a team member...</option>
                    {teamMembers.map((member, index) => (
                      <option key={index} value={member.name}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Message</label>
                  <Textarea
                    placeholder="Draft a message about this tender..."
                    value={individualMessage}
                    onChange={(e) => setIndividualMessage(e.target.value)}
                    className="text-sm"
                    rows={3}
                  />
                  <Button 
                    onClick={handleSendIndividualMessage}
                    size="sm" 
                    className="w-full"
                    disabled={!individualMessage.trim() || !selectedTeamMember}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Send Message
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Team Members</div>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getTeamStatusColor(member.status)}`}></div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <span className="text-gray-500">{member.role}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Publisher Profile */}
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
