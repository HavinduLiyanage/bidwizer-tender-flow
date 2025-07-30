import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, Shield } from "lucide-react";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userType, setUserType] = useState<'bidder' | 'publisher' | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const type = searchParams.get("type"); // publisher only
    
    if (token && email) {
      fetch(`http://localhost:4000/api/confirm-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            setStatus('success');
            setUserType('publisher'); // Only publishers use email confirmation
          } else {
            setStatus('error');
            setError(data.error || "Confirmation failed.");
          }
        })
        .catch(() => {
          setStatus('error');
          setError("Confirmation failed. Please try again later.");
        });
    } else {
      setStatus('error');
      setError("Invalid confirmation link.");
    }
  }, [navigate, searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirming your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-red-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirmation Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success' && userType === 'publisher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified. Your account is now pending approval from the BidWizer team.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">What happens next?</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Our team will review your application</li>
                <li>• You'll receive an approval email within 24-48 hours</li>
                <li>• Once approved, you can log in and publish tenders</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800">Stay Updated</span>
              </div>
              <p className="text-sm text-gray-600">
                We'll send you email notifications about your application status.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={() => navigate("/publisher-auth")} className="w-full">
                Back to Publisher Portal
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="w-full">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  return null;
};

export default ConfirmEmail; 