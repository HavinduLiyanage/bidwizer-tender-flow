import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Zap, Eye, Calendar, Clock, TrendingUp, FileText, Plus, BarChart3 } from "lucide-react";

const TenderStats = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) {
          setError("No publisher ID found. Please log in again.");
          setLoading(false);
          return;
        }
        const res = await fetch(`http://localhost:4000/api/tenders?publisherId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch tenders");
        const data = await res.json();
        setTenders(data);
      } catch (err) {
        setError("Failed to load tenders");
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

  const totalTenders = tenders.length;
  const activeTenders = tenders.filter((t: any) => t.status && t.status.toLowerCase() === "active").length;
  const totalViews = tenders.reduce((sum: number, t: any) => sum + (t.viewCount || 0), 0);
  const totalBids = tenders.reduce((sum: number, t: any) => sum + (t.bidCount || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return "-";
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Expired";
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">BidWizer</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/publisher-dashboard">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Tender
                </Button>
              </Link>
              <span className="text-sm text-gray-600">Publisher Portal</span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tender Statistics Dashboard</h1>
          <p className="text-gray-600">Monitor your published tenders performance and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTenders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTenders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBids}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenders Table */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Published Tenders
            </CardTitle>
            <CardDescription>
              Detailed view of all your published tenders and their performance
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tender Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Pre-bid Meeting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenders.map((tender: any) => (
                  <TableRow key={tender.id}>
                    <TableCell className="font-medium">{tender.title}</TableCell>
                    <TableCell>{tender.category}</TableCell>
                    <TableCell className="font-semibold text-green-600">{tender.value}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tender.status)}`}>
                        {tender.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {tender.viewCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1 text-gray-400" />
                        {tender.bidCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-600">Published: {tender.createdAt ? new Date(tender.createdAt).toLocaleDateString() : "-"}</div>
                        <div className="text-gray-900 font-medium">
                          Deadline: {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : "-"}
                        </div>
                        <div className="text-orange-600 text-xs">
                          {getDaysRemaining(tender.deadline)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {tender.preBidMeetingDate ? new Date(tender.preBidMeetingDate).toLocaleDateString() : "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenderStats;
