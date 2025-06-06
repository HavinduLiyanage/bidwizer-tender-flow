
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Building, Search, Zap, Users, FileText } from "lucide-react";

const Dashboard = () => {
  const dummyTenders = [
    {
      id: "1",
      title: "Construction of Solar Power Facility",
      summary: "Government project requiring the design and construction of a 10MW solar power station in the industrial district.",
      deadline: "2025-07-30",
      region: "California, USA",
      value: "$2.5M - $5M",
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
      category: "Transportation",
      status: "Open"
    }
  ];

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
          </CardHeader>
          <CardContent className="space-y-4">
            {dummyTenders.map((tender) => (
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
