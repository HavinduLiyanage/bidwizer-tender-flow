import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

const Navigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div />
          <div className="hidden md:flex items-center space-x-8">
            {/* Removed Library link */}
            {/* <Link to="/library" className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors">
              <BookOpen className="w-4 h-4 mr-1" />
              Library
            </Link> */}
            {user && (
              <span className="text-gray-700">
                Welcome, {user.name || user.email}
                {user.companyName && (
                  <span className="ml-3 font-semibold text-green-700">{user.companyName.toUpperCase()}</span>
                )}
              </span>
            )}
            {user ? (
              <Button variant="outline" size="sm" className="text-sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
            )}
          </div>
          <div className="md:hidden">
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
