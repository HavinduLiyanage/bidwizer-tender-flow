
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Building, 
  DollarSign, 
  Clock,
  Eye,
  Zap,
  TrendingUp,
  FileText,
  Users
} from "lucide-react";

const Dashboard = () => {
  const [tenders, setTenders] = useState<any[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Dummy tender with complete data
  const dummyTender = {
    id: 999,
    title: "Construction of 10MW Solar Power Facility",
    description: "Design, construction, and commissioning of a 10MW solar photovoltaic power facility including grid interconnection, monitoring systems, and 25-year operational maintenance. The project requires compliance with California environmental regulations and local workforce preferences. Successful bidder will be responsible for all permits, equipment procurement, installation, testing, and performance guarantees.",
    category: "Renewable Energy",
    region: "California",
    deadline: "2024-02-15T23:59:00.000Z",
    value: "$2,500,000 - $3,200,000",
    status: "Active",
    publishDate: "2024-01-05",
    filePath: "uploads/solar-facility-tender.pdf",
    views: 1247,
    interestedBidders: 23,
    publisher: {
      name: "California Department of Energy",
      type: "Government Agency",
      contact: "procurement@energy.ca.gov",
      phone: "(916) 654-4058",
      address: "1516 9th Street, Sacramento, CA 95814",
      website: "www.energy.ca.gov"
    },
    advertisementImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop",
    requirements: [
      "Licensed electrical contractor in California",
      "Minimum 5 years solar installation experience",
      "Financial capacity of $1M+ working capital",
      "NABCEP certified installation team",
      "Experience with utility-scale projects >5MW"
    ],
    submissionDeadline: "2024-02-15",
    preBidMeeting: "2024-01-25",
    estimatedStartDate: "2024-03-01",
    projectDuration: "6 months construction + 25 years O&M"
  };

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tenders");
        const data = await res.json();
        
        // Add the dummy tender to the fetched data
        const allTenders = [dummyTender, ...data];
        setTenders(allTenders);
        setFilteredTenders(allTenders);
      } catch (err) {
        console.error("Error fetching tenders:", err);
        // If API fails, just show the dummy tender
        setTenders([dummyTender]);
        setFilteredTenders([dummyTender]);
        toast({
          title: "Info",
          description: "Showing sample data. Connect to backend for live tenders.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [toast]);

  // Filter tenders based on search and filters
  useEffect(() => {
    let filtered = tenders;

    if (searchTerm) {
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(tender =>
        tender.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter(tender =>
        tender.region.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    setFilteredTenders(filtered);
  }, [searchTerm, selectedCategory, selectedRegion, tenders]);

  const getStatusColor = (deadline: string) => {
    const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 7) return "destructive";
    if (daysLeft < 14) return "secondary";
    return "default";
  };

  const getDaysLeft = (deadline: string) => {
    const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">BidWizer</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/library" className="text-gray-700 hover:text-blue-600">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Library
                </Button>
              </Link>
              <span className="text-sm text-gray-600">Welcome, <span className="font-medium">Jane Silva</span></span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tender Dashboard</h1>
          <p className="text-gray-600">Discover and analyze tender opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredTenders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-sm text-gray-600">Active Proposals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Due This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-600">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="renewable energy">Renewable Energy</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="california">California</SelectItem>
                  <SelectItem value="texas">Texas</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="florida">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tenders Grid */}
        <div className="grid gap-6">
          {filteredTenders.map((tender) => {
            const daysLeft = getDaysLeft(tender.deadline);
            
            return (
              <Card key={tender.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{tender.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{tender.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {tender.category}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {tender.region}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {tender.value}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {formatDate(tender.deadline)}
                        </div>
                        {tender.views && (
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {tender.views} views
                          </div>
                        )}
                        {tender.interestedBidders && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {tender.interestedBidders} interested
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={getStatusColor(tender.deadline)}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link to={`/tender/${tender.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/ai-tools/${tender.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          <Zap className="w-4 h-4 mr-2" />
                          AI Analysis
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Published: {formatDate(tender.publishDate || tender.deadline)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTenders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
