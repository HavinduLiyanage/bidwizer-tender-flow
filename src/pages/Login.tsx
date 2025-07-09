import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const user = await response.json();
      // Store user info (for now, use localStorage)
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      // Redirect based on role
      if (user.user && user.user.role === "BIDDER") {
        navigate("/dashboard"); // or your bidder dashboard route
      } else if (user.user && user.user.role === "PUBLISHER") {
        navigate("/publisher-dashboard");
      }
    } catch (err) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo removed */}
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl"
              >
                Sign In
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <div className="text-center space-y-4">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm">
                Forgot your password?
              </Link>
              
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/plans" className="text-blue-600 hover:text-blue-700 font-medium">
                  View Plans & Sign Up
                </Link>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Publishing tenders?</p>
                <Link to="/publisher-auth">
                  <Button variant="outline" className="w-full">
                    Publisher Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
