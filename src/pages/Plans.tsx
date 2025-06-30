
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Plans = () => {
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

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Basic Plan */}
            <Card className="relative border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Basic</CardTitle>
                    <CardDescription className="text-base">Perfect for small teams getting started</CardDescription>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $99<span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
                <p className="text-gray-600">Billed annually ($1,188/year)</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Up to 5 team members</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>20 tenders per month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Basic AI document analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Standard templates</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Email support</span>
                  </div>
                </div>
                <Link to="/multi-step-register?plan=basic" className="block">
                  <Button className="w-full py-6 text-lg font-semibold rounded-xl">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-blue-500 hover:border-blue-600 transition-all duration-300 hover:shadow-xl transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-2 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                    <CardDescription className="text-base">Ideal for growing organizations</CardDescription>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $299<span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
                <p className="text-gray-600">Billed annually ($3,588/year)</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Up to 10 team members</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Unlimited tenders</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Advanced AI tools & automation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Custom templates & branding</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Analytics & reporting</span>
                  </div>
                </div>
                <Link to="/multi-step-register?plan=pro" className="block">
                  <Button className="w-full py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Unlimited Plan */}
            <Card className="relative border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Unlimited</CardTitle>
                    <CardDescription className="text-base">For large enterprises and agencies</CardDescription>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $599<span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
                <p className="text-gray-600">Billed annually ($7,188/year)</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Unlimited team members</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Unlimited everything</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>White-label options</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Custom integrations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Dedicated support manager</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>API access & webhooks</span>
                  </div>
                </div>
                <Link to="/multi-step-register?plan=unlimited" className="block">
                  <Button className="w-full py-6 text-lg font-semibold rounded-xl">
                    Contact Sales
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
