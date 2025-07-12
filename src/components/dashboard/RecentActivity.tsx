
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const RecentActivity = () => {
  // Mock data - in real app, this would come from API
  const recentTenders = [
    {
      id: 1,
      title: "Solar Panel Installation Project",
      publishedDate: "2 days ago",
      bidsReceived: 8,
      status: "Active"
    },
    {
      id: 2,
      title: "Office Building Construction",
      publishedDate: "1 week ago",
      bidsReceived: 15,
      status: "Active"
    },
    {
      id: 3,
      title: "IT Infrastructure Upgrade",
      publishedDate: "2 weeks ago",
      bidsReceived: 22,
      status: "Closed"
    }
  ];

  return (
    <Card className="shadow-sm border-0 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Your recently published tenders and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTenders.map((tender) => (
            <div key={tender.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{tender.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Published {tender.publishedDate}</span>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{tender.bidsReceived} bids</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tender.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tender.status}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/tender-stats">
            <Button variant="outline">
              View All Tenders
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
