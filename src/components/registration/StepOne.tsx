import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StepOneProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const StepOne = ({ data, onUpdate, onNext }: StepOneProps) => {
  const [selectedPlan, setSelectedPlan] = useState(data.plan || "pro");
  const { toast } = useToast();

  const planDetails = {
    basic: { 
      name: "Basic", 
      price: 99, 
      color: "bg-gray-100 text-gray-700",
      features: ["Up to 5 team members", "20 tenders per month", "Basic AI analysis", "Standard templates", "Email support"],
      seats: 5
    },
    pro: { 
      name: "Pro", 
      price: 299, 
      color: "bg-blue-100 text-blue-700",
      features: ["Up to 10 team members", "Unlimited tenders", "Advanced AI tools", "Custom templates", "Priority support", "Analytics & reporting"],
      seats: 10
    },
    unlimited: { 
      name: "Unlimited", 
      price: 599, 
      color: "bg-purple-100 text-purple-700",
      features: ["Unlimited team members", "Unlimited everything", "White-label options", "Custom integrations", "Dedicated support", "API access"],
      seats: 999 // Use a high number to represent unlimited
    },
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const calculateTotal = () => {
    const basePrice = planDetails[selectedPlan as keyof typeof planDetails].price;
    return basePrice;
  };

  const handlePayment = async () => {
    // Set seats based on plan
    const seats = planDetails[selectedPlan as keyof typeof planDetails].seats;
    // Simulate payment processing
    onUpdate({ 
      plan: selectedPlan, 
      seats: seats, 
      paymentSuccess: true,
      totalAmount: calculateTotal()
    });
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed. Let's set up your account.",
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600">Select the plan that best fits your organization's needs</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {Object.entries(planDetails).map(([key, plan]) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-all duration-300 ${
              selectedPlan === key 
                ? "border-2 border-blue-500 shadow-lg" 
                : "border-2 border-transparent hover:border-blue-300"
            }`}
            onClick={() => handlePlanSelect(key)}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>Perfect for your team</CardDescription>
                </div>
                {key === "pro" && (
                  <Badge className="bg-blue-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${plan.price}<span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total & Payment */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Monthly Cost:</span>
          <span className="text-2xl font-bold text-blue-600">${calculateTotal()}</span>
        </div>
        <Button 
          onClick={handlePayment}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default StepOne;
