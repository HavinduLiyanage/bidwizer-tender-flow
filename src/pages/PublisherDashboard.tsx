import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Upload, Plus, FileText, Calendar, DollarSign, MapPin, Building, Image, Clock, BarChart3, User, Phone, Mail, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/lib/auth";

const PublisherDashboard = () => {
  const [tenderData, setTenderData] = useState({
    title: "",
    description: "",
    deadline: "",
    preBidMeetingDate: "",
    preBidMeetingTime: "",
    region: "",
    value: "",
    category: "",
    contactPersonName: "",
    contactNumber: "",
    contactEmail: "",
    companyWebsite: "",
    requirements: [""],
    documents: [] as File[],
    advertisementImage: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "PUBLISHER") {
      navigate("/publisher-auth");
    }
  }, [navigate]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTenderData(prev => ({ ...prev, advertisementImage: e.target.files![0] }));
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = tenderData.documents.filter((_, i) => i !== index);
    setTenderData(prev => ({ ...prev, documents: newDocuments }));
  };

  const removeAdvertisementImage = () => {
    setTenderData(prev => ({ ...prev, advertisementImage: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('publisherId', user.id);
      formData.append('title', tenderData.title);
      formData.append('description', tenderData.description || '');
      formData.append('deadline', tenderData.deadline);
      formData.append('value', tenderData.value || '');
      formData.append('category', tenderData.category || '');
      formData.append('preBidMeetingDate', tenderData.preBidMeetingDate || '');
      formData.append('preBidMeetingTime', tenderData.preBidMeetingTime || '');
      formData.append('region', tenderData.region || '');
      formData.append('contactPersonName', tenderData.contactPersonName || '');
      formData.append('contactNumber', tenderData.contactNumber || '');
      formData.append('contactEmail', tenderData.contactEmail || '');
      formData.append('companyWebsite', tenderData.companyWebsite || '');
      formData.append('requirements', JSON.stringify(tenderData.requirements));

      if (tenderData.documents[0]) {
        formData.append('file', tenderData.documents[0]);
      }
      if (tenderData.advertisementImage) {
        formData.append('advertisementImage', tenderData.advertisementImage);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/tenders', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to upload tender');
      toast({ title: 'Tender Published Successfully' });
      // Reset form, etc.
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to upload tender', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div />
            
            <div className="flex items-center space-x-4">
              <Link to="/tender-stats">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Stats
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
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="consulting">Consulting Services</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                      <SelectItem value="automobile">Automobile</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tender Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the tender requirements, scope of work, and any specific instructions..."
                  value={tenderData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label className="flex items-center">
                  <Image className="w-4 h-4 mr-1" />
                  Tender Advertisement Image *
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    accept="image/*"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload tender advertisement image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, GIF files accepted
                    </p>
                  </label>
                </div>

                {tenderData.advertisementImage && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Advertisement Image:</p>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{tenderData.advertisementImage.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeAdvertisementImage}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preBidMeetingDate" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Pre-Bid Meeting Date
                  </Label>
                  <Input
                    id="preBidMeetingDate"
                    type="date"
                    value={tenderData.preBidMeetingDate}
                    onChange={(e) => handleInputChange("preBidMeetingDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preBidMeetingTime" className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Pre-Bid Meeting Time
                  </Label>
                  <Input
                    id="preBidMeetingTime"
                    type="time"
                    value={tenderData.preBidMeetingTime}
                    onChange={(e) => handleInputChange("preBidMeetingTime", e.target.value)}
                  />
                </div>
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contact Person Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactPersonName" className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Contact Person Name *
                    </Label>
                    <Input
                      id="contactPersonName"
                      placeholder="e.g., John Smith"
                      value={tenderData.contactPersonName}
                      onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Contact Number *
                    </Label>
                    <Input
                      id="contactNumber"
                      placeholder="e.g., +1 (555) 123-4567"
                      value={tenderData.contactNumber}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Contact Email *
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="e.g., john@company.com"
                      value={tenderData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite" className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      Company Website
                    </Label>
                    <Input
                      id="companyWebsite"
                      placeholder="e.g., https://company.com"
                      value={tenderData.companyWebsite}
                      onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                    />
                  </div>
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
