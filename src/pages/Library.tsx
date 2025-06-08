
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Building, 
  Users, 
  Award, 
  Calendar,
  Download,
  Eye,
  Filter,
  Zap
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Library = () => {
  const resources = [
    {
      id: 1,
      title: "Company Profile & Capabilities",
      description: "Comprehensive overview of SunWorks Ltd capabilities, certifications, and past performance",
      category: "Company Info",
      type: "Document",
      lastUpdated: "2024-12-01",
      tags: ["Profile", "Capabilities", "Certifications"]
    },
    {
      id: 2,
      title: "Solar Project Portfolio",
      description: "Detailed case studies of completed solar installations including 10MW+ projects",
      category: "Portfolio",
      type: "Case Studies",
      lastUpdated: "2024-11-28",
      tags: ["Solar", "Portfolio", "Case Studies"]
    },
    {
      id: 3,
      title: "Technical Specifications Template",
      description: "Standard technical specifications for solar installations and electrical work",
      category: "Templates",
      type: "Template",
      lastUpdated: "2024-11-25",
      tags: ["Technical", "Specifications", "Solar"]
    },
    {
      id: 4,
      title: "Government Tender Guidelines",
      description: "Best practices and requirements for responding to government tender opportunities",
      category: "Guidelines",
      type: "Guide",
      lastUpdated: "2024-11-20",
      tags: ["Government", "Guidelines", "Best Practices"]
    },
    {
      id: 5,
      title: "Financial Documentation Package",
      description: "Standard financial documents, insurance certificates, and bonding information",
      category: "Financial",
      type: "Documents",
      lastUpdated: "2024-11-15",
      tags: ["Financial", "Insurance", "Bonding"]
    },
    {
      id: 6,
      title: "Safety & Compliance Procedures",
      description: "OSHA compliance, safety protocols, and environmental management procedures",
      category: "Compliance",
      type: "Procedures",
      lastUpdated: "2024-11-10",
      tags: ["Safety", "OSHA", "Environmental"]
    }
  ];

  const categories = ["All", "Company Info", "Portfolio", "Templates", "Guidelines", "Financial", "Compliance"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg mr-3">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Resource Library</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access company documents, tender templates, and resources to streamline your bidding process
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button 
                    key={category}
                    variant={category === "All" ? "default" : "outline"}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Updated: {new Date(resource.lastUpdated).toLocaleDateString()}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">25+</div>
              <div className="text-gray-600">Documents</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">15+</div>
              <div className="text-gray-600">Templates</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">8+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">150+</div>
              <div className="text-gray-600">MW Installed</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Library;
