
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const MultiStepRegister = () => {
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get("plan") || "pro";
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState({
    plan: initialPlan,
    seats: 1,
    paymentSuccess: false,
    adminData: {},
    teamMembers: [],
    companyProfile: {},
  });

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
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">BidWizer</span>
          </Link>
          
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
