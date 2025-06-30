
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, X, Upload } from "lucide-react";

interface StepThreeProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const StepThree = ({ data, onUpdate, onNext }: StepThreeProps) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const maxSeats = data.seats || 1;
  const remainingSeats = maxSeats - 1; // Subtract 1 for admin

  const addTeamMember = () => {
    if (!newEmail.trim()) return;
    
    if (teamMembers.length >= remainingSeats) {
      toast({
        title: "Seat Limit Reached",
        description: `You can only invite ${remainingSeats} team members with your current plan.`,
        variant: "destructive",
      });
      return;
    }

    if (teamMembers.includes(newEmail)) {
      toast({
        title: "Duplicate Email",
        description: "This email has already been added.",
        variant: "destructive",
      });
      return;
    }

    setTeamMembers([...teamMembers, newEmail]);
    setNewEmail("");
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter(member => member !== email));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate sending invitations
    setTimeout(() => {
      onUpdate({ teamMembers });
      toast({
        title: "Invitations Sent!",
        description: `${teamMembers.length} team members have been invited.`,
      });
      onNext();
      setLoading(false);
    }, 1500);
  };

  const handleSkip = () => {
    onUpdate({ teamMembers: [] });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Invite Your Team</h2>
        <p className="text-gray-600">Add team members to your organization (optional)</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Team Capacity</span>
          </div>
          <Badge variant="outline">
            {teamMembers.length + 1} / {maxSeats} seats used
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          You have {remainingSeats} available seats for team members (admin seat already reserved)
        </p>
      </div>

      {/* Add Team Member */}
      <div className="space-y-4">
        <Label htmlFor="teamEmail">Add Team Member Email</Label>
        <div className="flex space-x-2">
          <Input
            id="teamEmail"
            type="email"
            placeholder="colleague@company.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
            className="h-12"
          />
          <Button 
            onClick={addTeamMember}
            disabled={!newEmail.trim() || teamMembers.length >= remainingSeats}
            className="h-12 px-6"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Team Members List */}
      {teamMembers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Team Members to Invite</h3>
          <div className="space-y-2">
            {teamMembers.map((email, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CSV Upload Option */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">Have a large team?</p>
        <Button variant="outline">Upload CSV File</Button>
        <p className="text-xs text-gray-500 mt-2">Format: email1@company.com, email2@company.com</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1 h-12"
        >
          Skip for Now
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || teamMembers.length === 0}
          className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {loading ? "Sending Invitations..." : `Invite ${teamMembers.length} Members`}
        </Button>
      </div>
    </div>
  );
};

export default StepThree;
