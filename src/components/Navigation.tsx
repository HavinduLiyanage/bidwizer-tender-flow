
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <Link to="/" className="text-2xl font-bold text-gray-900">
              BidWizer
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/plans" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Plans
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Login
            </Link>
            <Link to="/publisher-auth">
              <Button variant="outline" size="sm" className="text-sm">
                Tender Publisher?
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
