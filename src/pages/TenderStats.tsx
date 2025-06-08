
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Zap, Eye, Calendar, Clock, TrendingUp, FileText, Plus, BarChart3 } from "lucide-react";

const TenderStats = () => {
  // Mock data for demonstration - in real app this would come from API
  const [tenders] = useState([
    {
      id: 1,
      title: "Construction of Highway Bridge",
      category: "Construction",
      publishDate: "2024-01-15",
      deadline: "2024-02-15",
      preBidMeeting: "2024-01-25",
      viewCount: 245,
      bidCount: 12,
      status: "Active",
      value: "$2,500,000"
    },
    {
      id: 2,
      title: "IT Infrastructure Upgrade",
      category: "Information Technology",
      publishDate: "2024-01-10",
      deadline: "2024-01-30",
      preBidMeeting: "2024-01-20",
      viewCount: 189,
      bidCount: 8,
      status: "Active",
      value: "$450,000"
    },
    {
      id: 3,
      title: "Office Renovation Project",
      category: "Construction",
      publishDate: "2023-12-20",
      deadline: "2024-01-05",
      preBidMeeting: "2023-12-28",
      viewCount: 156,
      bidCount: 15,
      status: "Closed",
      value: "$180,000"
    }
  ]);

  const totalTenders = tenders.length;
  const activeTenders = tenders.filter(t => t.status === "Active").length;
  const totalViews = tenders.reduce((sum, t) => sum + t.viewCount, 0);
  const totalBids = tenders.reduce((sum, t) => sum + t.bidCount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Expired";
  };

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
                {tenders.map((tender) => (
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
                        {tender.viewCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1 text-gray-400" />
                        {tender.bidCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-600">Published: {tender.publishDate}</div>
                        <div className="text-gray-900 font-medium">
                          Deadline: {tender.deadline}
                        </div>
                        <div className="text-orange-600 text-xs">
                          {getDaysRemaining(tender.deadline)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {tender.preBidMeeting}
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
