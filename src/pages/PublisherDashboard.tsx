import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Zap, Upload, Plus, FileText, Calendar, DollarSign, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PublisherDashboard = () => {
  const [tenderData, setTenderData] = useState({
    title: "",
    summary: "",
    fullDescription: "",
    deadline: "",
    region: "",
    value: "",
    category: "",
    requirements: [""],
    documents: [] as File[]
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get publisher info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleInputChange = (field: string, value: string) => {
    setTenderData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...tenderData.requirements];
    newRequirements[index] = value;
    setTenderData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setTenderData(prev => ({ ...prev, requirements: [...prev.requirements, ""] }));
  };

  const removeRequirement = (index: number) => {
    if (tenderData.requirements.length > 1) {
      const newRequirements = tenderData.requirements.filter((_, i) => i !== index);
      setTenderData(prev => ({ ...prev, requirements: newRequirements }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setTenderData(prev => ({ ...prev, documents: [...prev.documents, ...newFiles] }));
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = tenderData.documents.filter((_, i) => i !== index);
    setTenderData(prev => ({ ...prev, documents: newDocuments }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user.id) {
        toast({
          title: "Not logged in",
          description: "Please log in as a publisher.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      if (tenderData.documents.length === 0) {
        toast({
          title: "No document uploaded",
          description: "Please upload at least one document.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("publisherId", user.id);
      formData.append("title", tenderData.title);
      formData.append("description", tenderData.summary + "\n\n" + tenderData.fullDescription);
      formData.append("deadline", tenderData.deadline);
      // Only send the first document for now (backend expects a single file)
      formData.append("file", tenderData.documents[0]);

      // Optionally, you can send more fields if your backend supports them

      const response = await fetch("http://localhost:4000/api/tenders", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      toast({
        title: "Tender Published Successfully",
        description: "Your tender has been published and is now available to bidders.",
      });

      // Reset form
      setTenderData({
        title: "",
        summary: "",
        fullDescription: "",
        deadline: "",
        region: "",
        value: "",
        category: "",
        requirements: [""],
        documents: []
      });
    } catch (err: any) {
      toast({
        title: "Error uploading tender",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
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
              <span className="text-sm text-gray-600">Publisher Portal</span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publish New Tender</h1>
          <p className="text-gray-600">Create and publish a new tender for qualified bidders to respond to.</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Tender Information
            </CardTitle>
            <CardDescription>
              Fill in all the details about your tender opportunity
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tender Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Construction of Solar Power Facility"
                    value={tenderData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={tenderData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction & Energy</SelectItem>
                      <SelectItem value="it">IT & Technology</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="consulting">Consulting Services</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Brief Summary *</Label>
                <Textarea
                  id="summary"
                  placeholder="Provide a brief overview of the tender requirements..."
                  value={tenderData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed project scope, specifications, and requirements..."
                  value={tenderData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Submission Deadline *
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={tenderData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value" className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Estimated Value
                  </Label>
                  <Input
                    id="value"
                    placeholder="e.g., $2.5M - $5M"
                    value={tenderData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Region/Location *
                  </Label>
                  <Input
                    id="region"
                    placeholder="e.g., California, USA"
                    value={tenderData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  Key Requirements
                </Label>
                {tenderData.requirements.map((requirement, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder="Enter a requirement"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {tenderData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Requirement
                </Button>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center">
                  <Upload className="w-4 h-4 mr-1" />
                  Tender Documents
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload documents or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, DOCX, XLS, XLSX files accepted
                    </p>
                  </label>
                </div>

                {tenderData.documents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Documents:</p>
                    {tenderData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Tender"}
                </Button>
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublisherDashboard;
