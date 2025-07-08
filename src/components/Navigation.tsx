import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, BookOpen } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div />
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/library" className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors">
              <BookOpen className="w-4 h-4 mr-1" />
              Library
            </Link>
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
