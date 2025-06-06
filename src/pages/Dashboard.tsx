import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Building, Search, Zap, Users, FileText, Filter } from "lucide-react";
import { useState, useMemo } from "react";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [valueRangeFilter, setValueRangeFilter] = useState("all");

  const dummyTenders = [
    {
      id: "1",
      title: "Construction of Solar Power Facility",
      summary: "Government project requiring the design and construction of a 10MW solar power station in the industrial district.",
      deadline: "2025-07-30",
      region: "California, USA",
      value: "$2.5M - $5M",
      valueMin: 2500000,
      valueMax: 5000000,
      category: "Construction & Energy",
      status: "Open"
    },
    {
      id: "2", 
      title: "IT Infrastructure Modernization",
      summary: "Complete overhaul of legacy IT systems for municipal government including cloud migration and cybersecurity.",
      deadline: "2025-06-15",
      region: "Texas, USA", 
      value: "$1M - $3M",
      valueMin: 1000000,
      valueMax: 3000000,
      category: "Information Technology",
      status: "Open"
    },
    {
      id: "3",
      title: "Highway Maintenance Contract",
      summary: "5-year contract for maintenance and repair of state highway system including snow removal and resurfacing.",
      deadline: "2025-08-20",
      region: "Colorado, USA",
      value: "$10M - $20M",
      valueMin: 10000000,
      valueMax: 20000000,
      category: "Transportation",
      status: "Open"
    },
    {
      id: "4",
      title: "Medical Equipment Procurement",
      summary: "Procurement of advanced medical imaging equipment for regional hospital network upgrade.",
      deadline: "2025-07-15",
      region: "New York, USA",
      value: "$500K - $1M",
      valueMin: 500000,
      valueMax: 1000000,
      category: "Healthcare",
      status: "Open"
    },
    {
      id: "5",
      title: "Educational Software Platform",
      summary: "Development of custom learning management system for state university consortium.",
      deadline: "2025-09-01",
      region: "Florida, USA",
      value: "$2M - $4M",
      valueMin: 2000000,
      valueMax: 4000000,
      category: "Information Technology",
      status: "Open"
    }
  ];

  const industries = [
    "Construction & Energy",
    "Information Technology", 
    "Transportation",
    "Healthcare"
  ];

  const valueRanges = [
    { label: "Under $1M", min: 0, max: 1000000 },
    { label: "$1M - $5M", min: 1000000, max: 5000000 },
    { label: "$5M - $10M", min: 5000000, max: 10000000 },
    { label: "Over $10M", min: 10000000, max: Infinity }
  ];

  const filteredTenders = useMemo(() => {
    return dummyTenders.filter(tender => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Industry filter
      const matchesIndustry = industryFilter === "all" || tender.category === industryFilter;

      // Value range filter
      let matchesValueRange = true;
      if (valueRangeFilter !== "all") {
        const selectedRange = valueRanges.find(range => range.label === valueRangeFilter);
        if (selectedRange) {
          matchesValueRange = tender.valueMax >= selectedRange.min && tender.valueMin <= selectedRange.max;
        }
      }

      return matchesSearch && matchesIndustry && matchesValueRange;
    });
  }, [searchTerm, industryFilter, valueRangeFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("all");
    setValueRangeFilter("all");
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
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Team
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                My Proposals
              </Button>
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">Jane Silva</span> (CEO, SunWorks Ltd)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Find and analyze tenders with AI-powered insights</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">New Tenders</p>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Available Tenders
            </CardTitle>
            <CardDescription>
              Explore new tender opportunities and use AI tools to analyze requirements
            </CardDescription>
            
            <div className="space-y-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tenders by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={valueRangeFilter} onValueChange={setValueRangeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Value Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Value Ranges</SelectItem>
                    {valueRanges.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchTerm || industryFilter !== "all" || valueRangeFilter !== "all") && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {filteredTenders.length} of {dummyTenders.length} tenders
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTenders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No tenders found</p>
                <p className="text-sm">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              filteredTenders.map((tender) => (
                <div key={tender.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{tender.title}</h3>
                      <p className="text-gray-600 mb-3">{tender.summary}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {tender.status}
                      </span>
                      <Link to={`/tender/${tender.id}`}>
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
