import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Upload, Users, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setAuth } from "@/lib/auth";

const PublisherAuth = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationType: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        let description = "Invalid email or password.";
        if (result.error && result.error.includes("confirm your email")) {
          description = "Please confirm your email before logging in. Check your inbox.";
        }
        throw new Error(description);
      }
      // Only allow publisher role
      if (!result.user || result.user.role !== "PUBLISHER") {
        toast({
          title: "Access Denied",
          description: "Only publisher accounts can log in here.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      setAuth(result.token, result.user);
      toast({
        title: "Login Successful",
        description: "Welcome to your publisher dashboard!",
      });
      navigate("/publisher-dashboard");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess(false);
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    if (!validatePassword(registerData.password)) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/publisher/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");
      setRegisterSuccess(true);
    } catch (err: any) {
      setRegisterError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">BidWizer</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Publisher Portal</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Publish tenders and connect with qualified bidders
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Streamline Your Procurement Process
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Upload className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Easy Publishing</h3>
                      <p className="text-gray-600">Upload and publish tenders with our intuitive interface</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Quality Bidders</h3>
                      <p className="text-gray-600">Connect with pre-qualified, professional bidding companies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Wide Reach</h3>
                      <p className="text-gray-600">Ensure maximum visibility for your procurement opportunities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Forms */}
            <div>
              <Card className="shadow-xl border-0">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold">Publisher Sign In</CardTitle>
                      <CardDescription>
                        Access your publisher dashboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            required
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            required
                            className="h-12"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl"
                        >
                          Sign In
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </form>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="register">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold">Publisher Registration</CardTitle>
                      <CardDescription>
                        Create your publisher account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {registerSuccess ? (
                        <div className="text-center space-y-4">
                          <div className="text-green-700 font-semibold">
                            Registration successful! Please check your email to confirm your account.
                          </div>
                          <div className="text-sm text-gray-600">
                            After confirming your email, your account will be reviewed by our team for approval.
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="org-name">Organization Name</Label>
                            <Input
                              id="org-name"
                              placeholder="Your Organization"
                              value={registerData.organizationName}
                              onChange={(e) => setRegisterData({...registerData, organizationName: e.target.value})}
                              required
                              className="h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact-name">Contact Name</Label>
                            <Input
                              id="contact-name"
                              placeholder="Your Full Name"
                              value={registerData.contactName}
                              onChange={(e) => setRegisterData({...registerData, contactName: e.target.value})}
                              required
                              className="h-12"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input
                              id="reg-email"
                              type="email"
                              placeholder="Enter your email"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                              required
                              className="h-12"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input
                              id="reg-password"
                              type="password"
                              placeholder="Create a password"
                              value={registerData.password}
                              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                              required
                              className="h-12"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="Confirm your password"
                              value={registerData.confirmPassword}
                              onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                              required
                              className="h-12"
                            />
                          </div>

                          {registerError && <div className="text-red-600">{registerError}</div>}
                          <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl"
                          >
                            Create Publisher Account
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Looking for bidding opportunities?{" "}
                  <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                    Go to Bidder Portal
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherAuth;
