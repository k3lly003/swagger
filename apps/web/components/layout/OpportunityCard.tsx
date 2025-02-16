import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { CheckCircle2, Clock, MapPin, Briefcase, ArrowUpRight, Calendar } from "lucide-react";
import { ReactNode } from "react";

interface OpportunityCardProps {
  title: string;
  status: "Open" | "Closed";
  description: string;
  icon: ReactNode;
  color: string;
  requirements: string[];
  type?: "fellowship" | "role";
  duration?: string;
  location: string;
  employmentType?: string;
  startDate: string;
  endDate: string;
}

export function OpportunityCard({
  title,
  status,
  description,
  icon,
  color,
  requirements,
  type = "fellowship",
  duration,
  location,
  employmentType,
  startDate,
  endDate,
}: OpportunityCardProps) {
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#045f3c] transform hover:scale-[1.02] transition-transform duration-300 group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
              {icon}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          <Badge
            variant={status === "Open" ? "default" : "secondary"}
            className={`${
              status === "Open"
                ? "bg-[#F8B712] hover:bg-[#045f3c] text-black hover:text-white"
                : "bg-orange-500 hover:bg-[#045f3c] text-white"
            }`}
          >
            {status}
          </Badge>
        </div>

        <p className="text-gray-600 mb-6">{description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {type === "fellowship" ? (
            <>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#045f3c]" />
                <span className="text-sm">{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#045f3c]" />
                <span className="text-sm">{location}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#045f3c]" />
                <span className="text-sm">{employmentType}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#045f3c]" />
                <span className="text-sm">{location}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Calendar className="w-5 h-5 text-[#045f3c]" />
          <span>Application Period: {formatDate(startDate)} - {formatDate(endDate)}</span>
        </div>

        <div className="space-y-2 mb-6">
          <h4 className="font-semibold text-[#045f3c]">Requirements:</h4>
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F8B712]" />
              <span className="text-sm">{req}</span>
            </div>
          ))}
        </div>

        <Button
          className={`w-full group ${
            status === "Open"
              ? "bg-[#045f3c] hover:bg-[#F8B712] hover:text-black"
              : "bg-[#045f3c]/10 text-[#045f3c] cursor-not-allowed"
          }`}
          disabled={status === "Closed"}
        >
          <span className="flex items-center justify-center gap-2">
            {status === "Open"
              ? <>
                  {type === "fellowship" ? "Apply Now" : "Apply Now"}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
              : type === "fellowship"
                ? "Applications Closed"
                : "Position Filled"}
          </span>
        </Button>
      </div>
    </div>
  );
} 