
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
  const [seats, setSeats] = useState(data.seats || 1);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const planDetails = {
    basic: { 
      name: "Basic", 
      price: 99, 
      color: "bg-gray-100 text-gray-700",
      features: ["Up to 5 team members", "20 tenders per month", "Basic AI analysis", "Standard templates", "Email support"]
    },
    pro: { 
      name: "Pro", 
      price: 299, 
      color: "bg-blue-100 text-blue-700",
      features: ["Up to 10 team members", "Unlimited tenders", "Advanced AI tools", "Custom templates", "Priority support", "Analytics & reporting"]
    },
    unlimited: { 
      name: "Unlimited", 
      price: 599, 
      color: "bg-purple-100 text-purple-700",
      features: ["Unlimited team members", "Unlimited everything", "White-label options", "Custom integrations", "Dedicated support", "API access"]
    },
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setSeats(1); // Reset seats when changing plan
  };

  const adjustSeats = (increment: boolean) => {
    const maxSeats = selectedPlan === "basic" ? 5 : selectedPlan === "pro" ? 10 : 999;
    if (increment && seats < maxSeats) {
      setSeats(seats + 1);
    } else if (!increment && seats > 1) {
      setSeats(seats - 1);
    }
  };

  const calculateTotal = () => {
    const basePrice = planDetails[selectedPlan as keyof typeof planDetails].price;
    return basePrice * seats;
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
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
      setProcessing(false);
    }, 2000);
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

      {/* Seats Selection */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Number of Seats</h3>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustSeats(false)}
            disabled={seats <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xl font-semibold w-16 text-center">{seats}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustSeats(true)}
            disabled={
              (selectedPlan === "basic" && seats >= 5) ||
              (selectedPlan === "pro" && seats >= 10)
            }
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Total & Payment */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Monthly Cost:</span>
          <span className="text-2xl font-bold text-blue-600">${calculateTotal()}</span>
        </div>
        <Button 
          onClick={handlePayment}
          disabled={processing}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl"
        >
          {processing ? "Processing Payment..." : "Continue to Payment"}
        </Button>
      </div>
    </div>
  );
};

export default StepOne;
