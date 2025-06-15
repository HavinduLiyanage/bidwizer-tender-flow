
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Calendar,
  Download,
  Eye
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

const Library = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const filteredResources = resources.filter((r) => {
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase())
      || r.description.toLowerCase().includes(search.toLowerCase())
      || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="pt-20 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">Resource Library</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            All your company and project resources at a glance—discover documents, guidelines, templates, and more.
          </p>
        </div>
      </section>

      {/* Sticky Filter/Search and Main Content */}
      <section className="flex-1 w-full pb-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Filter / Search Sidebar */}
          <div className="md:sticky md:top-24 flex flex-col gap-8">
            <div className="bg-white rounded-xl shadow border px-5 py-3 flex flex-col gap-4 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search resources..."
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category) => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <hr className="my-3 border-blue-100" />
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-slate-600 mb-2">Quick Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <StatBox color="blue" value="25+" label="Documents" />
                <StatBox color="green" value="15+" label="Templates" />
                <StatBox color="purple" value="8+" label="Years Exp" />
                <StatBox color="orange" value="150+" label="MW Installed" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base md:text-lg font-medium text-gray-800 tracking-wide">Available Resources</h2>
              <span className="text-xs text-muted-foreground">{filteredResources.length} items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-out border border-blue-100 bg-white/90 relative animate-fade-in"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold leading-snug">{resource.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Updated: {new Date(resource.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-1 pb-2">
                        {resource.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xxs px-2 py-0 rounded-full border-gray-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button size="sm" className="flex-1 rounded-md shadow-sm group relative hover:bg-blue-700/95 transition-colors animate-in">
                          <Eye className="w-4 h-4 opacity-80 mr-1" />
                          <span>View</span>
                          <span className="absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-20 group-hover:bg-blue-500 rounded-md pointer-events-none transition duration-200" />
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 rounded-md shadow-sm hover:bg-gray-100">
                          <Download className="w-4 h-4 opacity-70 mr-1" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Empty state */}
            {filteredResources.length === 0 && (
              <div className="text-center py-16 text-slate-400 animate-fade-in">
                <div className="flex justify-center mb-3">
                  <BookOpen className="w-10 h-10 text-blue-200" />
                </div>
                <div className="text-lg font-medium mb-1">No resources found</div>
                <div className="text-sm">Try another category or search term.</div>
              </div>
            )}
            {/* Quick Stats for mobile */}
            <div className="md:hidden mt-8">
              <hr className="my-4 border-blue-100" />
              <div className="grid grid-cols-2 gap-4">
                <StatBox color="blue" value="25+" label="Documents" />
                <StatBox color="green" value="15+" label="Templates" />
                <StatBox color="purple" value="8+" label="Years Exp" />
                <StatBox color="orange" value="150+" label="MW Installed" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function StatBox({ color, value, label }: { color: "blue" | "green" | "purple" | "orange", value: string, label: string }) {
  const colorClass = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  }[color];
  return (
    <div className={`rounded-xl px-3 py-2 shadow-sm flex flex-col items-center justify-center ${colorClass}`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default Library;
