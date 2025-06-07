import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Building, Search, Zap, Users, FileText, Filter } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [valueRangeFilter, setValueRangeFilter] = useState("all");
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Use real tenders from backend for filtering
  const filteredTenders = useMemo(() => {
    return tenders.filter(tender => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        (tender.title && tender.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tender.summary && tender.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tender.category && tender.category.toLowerCase().includes(searchTerm.toLowerCase()));

      // Industry filter
      const matchesIndustry = industryFilter === "all" || tender.category === industryFilter;

      // Value range filter
      let matchesValueRange = true;
      if (valueRangeFilter !== "all") {
        const selectedRange = valueRanges.find(range => range.label === valueRangeFilter);
        if (selectedRange) {
          // Try to parse valueMin/valueMax from tender.value if not present
          let valueMin = tender.valueMin;
          let valueMax = tender.valueMax;
          if (valueMin === undefined || valueMax === undefined) {
            // Try to parse from tender.value string (e.g., "$2.5M - $5M")
            if (tender.value) {
              const match = tender.value.match(/\$?([\d.]+)[MK]? - \$?([\d.]+)[MK]?/);
              if (match) {
                valueMin = parseFloat(match[1]) * (tender.value.includes("M") ? 1000000 : 1);
                valueMax = parseFloat(match[2]) * (tender.value.includes("M") ? 1000000 : 1);
              }
            }
          }
          matchesValueRange = valueMin >= selectedRange.min && valueMax <= selectedRange.max;
        }
      }

      return matchesSearch && matchesIndustry && matchesValueRange;
    });
  }, [tenders, searchTerm, industryFilter, valueRangeFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("all");
    setValueRangeFilter("all");
  };

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tenders");
        const data = await res.json();
        setTenders(data);
      } catch (err) {
        alert("Failed to fetch tenders.");
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

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
                  <p className="text-2xl font-bold text-gray-900">{filteredTenders.length}</p>
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

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <Input
            type="text"
            placeholder="Search tenders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(ind => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={valueRangeFilter} onValueChange={setValueRangeFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Value Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Values</SelectItem>
              {valueRanges.map(range => (
                <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {loading ? (
          <p>Loading tenders...</p>
        ) : filteredTenders.length === 0 ? (
          <p>No tenders found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map(tender => (
              <Card key={tender.id} className="shadow">
                <CardHeader>
                  <CardTitle>{tender.title}</CardTitle>
                  <CardDescription>{tender.summary || tender.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : "N/A"}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {tender.region || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {tender.category || "N/A"}
                    </div>
                    <div className="font-medium text-green-600">
                      {tender.value || "N/A"}
                    </div>
                  </div>
                  <Button
                    className="mt-2"
                    onClick={() => navigate(`/tender/${tender.id}`)}
                  >
                    View Details & AI Tools
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
