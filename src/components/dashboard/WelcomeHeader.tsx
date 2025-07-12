
import { User, Building, Clock } from "lucide-react";

interface WelcomeHeaderProps {
  user: {
    name?: string;
    companyName?: string;
    email?: string;
  };
}

const WelcomeHeader = ({ user }: WelcomeHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {getGreeting()}, {user.name || "Publisher"}!
          </h1>
          {user.companyName && (
            <div className="flex items-center text-gray-600 mt-1">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">{user.companyName.toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="text-right text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
