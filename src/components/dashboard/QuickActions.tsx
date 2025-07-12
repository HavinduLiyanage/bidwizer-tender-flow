
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileText, BarChart3, Settings, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const quickActions = [
    {
      title: "Publish New Tender",
      description: "Create a new tender opportunity",
      icon: Plus,
      action: () => {
        // Scroll to form or focus on title field
        const titleInput = document.getElementById('title');
        if (titleInput) {
          titleInput.scrollIntoView({ behavior: 'smooth' });
          titleInput.focus();
        }
      },
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Duplicate Last Tender",
      description: "Reuse your previous tender template",
      icon: Copy,
      action: () => {
        // Mock action - in real app would populate form with last tender data
        console.log("Duplicate last tender");
      },
      color: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  const navigationActions = [
    {
      title: "View Tender Stats",
      href: "/tender-stats",
      icon: BarChart3
    },
    {
      title: "My Published Tenders",
      href: "/tender-stats",
      icon: FileText
    },
    {
      title: "Account Settings",
      href: "#",
      icon: Settings
    }
  ];

  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            className={`w-full justify-start ${action.color} text-white`}
          >
            <action.icon className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </Button>
        ))}
        
        <div className="pt-2 border-t">
          <div className="space-y-2">
            {navigationActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Button variant="outline" className="w-full justify-start">
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
