import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const MultiStepRegister = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialPlan = searchParams.get("plan") || "pro";
  // Read step and emailConfirmed from location.state if present
  const initialStep = location.state?.step || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [registrationData, setRegistrationData] = useState({
    plan: initialPlan,
    seats: initialPlan === "pro" ? 5 : 4,
    paymentSuccess: false,
    adminData: {},
    teamMembers: [],
    companyProfile: {},
  });

  // Update seats if plan changes
  useEffect(() => {
    setRegistrationData(prev => ({
      ...prev,
      seats: prev.plan === "pro" ? 5 : 4,
    }));
  }, [registrationData.plan]);



  const updateRegistrationData = (data: any) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Select Plan & Payment";
      case 2: return "Register Company Admin";
      case 3: return "Invite Team Members";
      case 4: return "Company Profile & Documents";
      default: return "Registration";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {/* Logo removed */}
          
          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
          <p className="text-gray-600">Step {currentStep} of 4</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <StepOne
                data={registrationData}
                onUpdate={updateRegistrationData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                data={registrationData}
                onUpdate={updateRegistrationData}
                onNext={nextStep}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                data={registrationData}
                onUpdate={updateRegistrationData}
                onNext={nextStep}
              />
            )}
            {currentStep === 4 && (
              <StepFour
                data={registrationData}
                onUpdate={updateRegistrationData}
                onNext={nextStep}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiStepRegister;
