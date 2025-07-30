import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

const planData = [
  {
    name: "Basic",
    price: 99,
    seats: 3,
    features: [
      "Up to 3 users (including admin)",
      "20 tenders per month",
      "Basic AI document analysis",
      "Standard templates",
      "Email support",
    ],
    cta: "Get Started",
    link: "/multi-step-register?plan=basic",
    highlight: false,
    badge: null,
    description: "Perfect for very small teams getting started",
    annual: "$1,188/year",
    color: "border-2 hover:border-blue-300",
  },
  {
    name: "Pro",
    price: 299,
    seats: 5,
    features: [
      "Up to 5 users (including admin)",
      "Unlimited tenders",
      "Advanced AI tools & automation",
      "Custom templates & branding",
      "Priority support",
      "Analytics & reporting",
    ],
    cta: "Get Started",
    link: "/multi-step-register?plan=pro",
    highlight: true,
    badge: { text: "Most Popular", color: "bg-blue-500 text-white" },
    description: "Ideal for growing organizations",
    annual: "$3,588/year",
    color: "border-2 border-blue-500 hover:border-blue-600 scale-105",
  },
  {
    name: "Unlimited",
    price: 599,
    seats: "Unlimited",
    features: [
      "Unlimited users",
      "Unlimited everything",
      "White-label options",
      "Custom integrations",
      "Dedicated support manager",
      "API access & webhooks",
    ],
    cta: "Contact Sales",
    link: "/contact-sales",
    highlight: false,
    badge: null,
    description: "For large enterprises and agencies",
    annual: "$7,188/year",
    color: "border-2 hover:border-purple-300",
  },
];

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 border-blue-200">
              Choose Your Plan
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Scale Your Tender Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From small teams to enterprise organizations, we have a plan that fits your needs and grows with your business.
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {planData.map((plan, idx) => (
              <Card
                key={plan.name}
                className={`relative transition-all duration-300 hover:shadow-lg ${plan.color} ${selectedPlan === plan.name ? "ring-4 ring-blue-400" : ""}`}
                tabIndex={0}
                aria-label={`Select ${plan.name} plan`}
                onClick={() => setSelectedPlan(plan.name)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setSelectedPlan(plan.name); }}
                role="button"
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${plan.badge.color} px-4 py-2 flex items-center gap-1`}>
                      <Star className="w-4 h-4" />
                      {plan.badge.text}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mt-4">
                    ${plan.price}<span className="text-lg text-gray-500 font-normal">/month</span>
                  </div>
                  <p className="text-gray-600">Billed annually ({plan.annual})</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div className="flex items-center" key={i}>
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  {plan.name === "Unlimited" ? (
                    <a href={plan.link} className="block">
                      <Button className="w-full py-6 text-lg font-semibold rounded-xl" variant="outline">
                        {plan.cta}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </a>
                  ) : (
                    <Link to={plan.link} className="block">
                      <Button className="w-full py-6 text-lg font-semibold rounded-xl">
                        {plan.cta}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Plan Comparison Table */}
          <div className="overflow-x-auto mb-16">
            <table className="min-w-full bg-white rounded-xl shadow-md">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-900">Feature</th>
                  {planData.map(plan => (
                    <th key={plan.name} className="py-4 px-6 text-center text-lg font-semibold text-gray-900">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-6 font-medium text-gray-700">Team Members</td>
                  {planData.map(plan => (
                    <td key={plan.name} className="py-3 px-6 text-center">{plan.seats}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-6 font-medium text-gray-700">Tenders per Month</td>
                  <td className="py-3 px-6 text-center">20</td>
                  <td className="py-3 px-6 text-center">Unlimited</td>
                  <td className="py-3 px-6 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 font-medium text-gray-700">AI Tools</td>
                  <td className="py-3 px-6 text-center">Basic</td>
                  <td className="py-3 px-6 text-center">Advanced</td>
                  <td className="py-3 px-6 text-center">All</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 font-medium text-gray-700">Support</td>
                  <td className="py-3 px-6 text-center">Email</td>
                  <td className="py-3 px-6 text-center">Priority</td>
                  <td className="py-3 px-6 text-center">Dedicated Manager</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 font-medium text-gray-700">Custom Branding</td>
                  <td className="py-3 px-6 text-center">-</td>
                  <td className="py-3 px-6 text-center">Yes</td>
                  <td className="py-3 px-6 text-center">White-label</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 font-medium text-gray-700">API Access</td>
                  <td className="py-3 px-6 text-center">-</td>
                  <td className="py-3 px-6 text-center">-</td>
                  <td className="py-3 px-6 text-center">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">Yes, all plans come with a 14-day free trial. No credit card required to start.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and wire transfers for enterprise plans.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer custom plans?</h3>
                <p className="text-gray-600">Yes, we work with enterprise customers to create custom plans that fit their specific needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Plans;
