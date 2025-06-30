
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Building, Upload, FileText, Award, DollarSign } from "lucide-react";

interface StepFourProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const StepFour = ({ data, onUpdate, onNext }: StepFourProps) => {
  const [companyProfile, setCompanyProfile] = useState({
    companyName: data.adminData?.companyName || "",
    industry: "",
    about: "",
    website: "",
    logo: null,
  });
  const [documents, setDocuments] = useState({
    environmentalLicense: null,
    isoCertificate: null,
    companyProfile: null,
    tradeLicense: null,
    brochure: null,
    financialReports: null,
    staffDetails: null,
    proofOfFunds: null,
    awards: null,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProfileChange = (field: string, value: string) => {
    setCompanyProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate profile creation
    setTimeout(() => {
      onUpdate({ 
        companyProfile,
        documents,
        registrationComplete: true 
      });
      toast({
        title: "Registration Complete!",
        description: "Welcome to BidWizer! Your account has been set up successfully.",
      });
      navigate("/dashboard");
      setLoading(false);
    }, 2000);
  };

  const documentFields = [
    { key: "environmentalLicense", label: "Environmental License", icon: FileText },
    { key: "isoCertificate", label: "ISO Certificate", icon: Award },
    { key: "companyProfile", label: "Company Profile (PDF)", icon: FileText },
    { key: "tradeLicense", label: "Trade License", icon: FileText },
    { key: "brochure", label: "Company Brochure", icon: FileText },
    { key: "financialReports", label: "Financial Reports", icon: DollarSign },
    { key: "staffDetails", label: "Staff Details", icon: FileText },
    { key: "proofOfFunds", label: "Proof of Funds", icon: DollarSign },
    { key: "awards", label: "Awards & Certifications", icon: Award },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Complete Your Company Profile</h2>
        <p className="text-gray-600">Add your company details and supporting documents</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Company Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyProfile.companyName}
                onChange={(e) => handleProfileChange("companyName", e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={(value) => handleProfileChange("industry", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Company Website</Label>
              <Input
                id="website"
                placeholder="https://yourcompany.com"
                value={companyProfile.website}
                onChange={(e) => handleProfileChange("website", e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Company</Label>
              <Textarea
                id="about"
                placeholder="Brief description of your company..."
                value={companyProfile.about}
                onChange={(e) => handleProfileChange("about", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload your company logo</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload("logo", e.target.files?.[0] || null)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supporting Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Supporting Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {documentFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{field.label}</span>
                  </Label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(field.key, e.target.files?.[0] || null)}
                      className="border-0 p-0"
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Why These Documents Matter</h3>
        <p className="text-sm text-green-700">
          These documents help our AI generate more accurate and professional proposals, 
          ensuring you present the best possible bid for every tender opportunity.
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-lg"
      >
        {loading ? "Setting Up Your Dashboard..." : "Complete Registration & Enter Dashboard"}
      </Button>
    </div>
  );
};

export default StepFour;
