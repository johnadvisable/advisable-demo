

import GlobeVisualization from "./GlobeVisualization";
import CompanyFactsDisplay from "./CompanyFactsDisplay";

interface CompanyFactsGlobeProps {
  foundedYear: number | null;
}

const CompanyFactsGlobe = ({
  foundedYear
}: CompanyFactsGlobeProps) => {
  return (
    <div className="h-full flex flex-col">
      <GlobeVisualization />
      <CompanyFactsDisplay foundedYear={foundedYear} />
    </div>
  );
};

export default CompanyFactsGlobe;
