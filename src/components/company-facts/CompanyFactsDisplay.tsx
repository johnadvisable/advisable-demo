
import { Building, Users, Globe, Calendar } from "lucide-react";

interface CompanyFactsDisplayProps {
  foundedYear: number | null;
}

const CompanyFactsDisplay = ({ foundedYear }: CompanyFactsDisplayProps) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {foundedYear && (
        <div className="flex items-start">
          <div className="bg-advisable-blue/10 p-2 rounded-full mr-3">
            <Calendar className="h-5 w-5 text-advisable-blue" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Founded</h4>
            <p className="text-gray-600">{foundedYear}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-start">
        <div className="bg-advisable-blue/10 p-2 rounded-full mr-3">
          <Building className="h-5 w-5 text-advisable-blue" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Dual Focus</h4>
          <p className="text-gray-600">Venture Studio & Agency</p>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="bg-advisable-blue/10 p-2 rounded-full mr-3">
          <Users className="h-5 w-5 text-advisable-blue" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Team</h4>
          <p className="text-gray-600">Product & Service Experts</p>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="bg-advisable-blue/10 p-2 rounded-full mr-3">
          <Globe className="h-5 w-5 text-advisable-blue" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Global Reach</h4>
          <p className="text-gray-600">Worldwide Clients</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyFactsDisplay;
