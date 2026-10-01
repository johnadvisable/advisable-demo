import { X } from "lucide-react";

interface ServiceTagProps {
  service: string;
  onRemove: (service: string) => void;
}

const ServiceTag = ({ service, onRemove }: ServiceTagProps) => {
  return (
    <div className="relative rounded-full p-[2px] group transition-all duration-300 hover:scale-105">
      {/* Animated gradient border */}
      <div 
        className="absolute inset-0 rounded-full opacity-100"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #5ddcff 60%, #667eea 80%, #764ba2 100%)',
          backgroundSize: '400% 400%',
          animation: 'electric-border 3s ease infinite',
        }}
      />
      {/* Glow layer */}
      <div 
        className="absolute inset-0 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #5ddcff 60%, #667eea 80%, #764ba2 100%)',
          backgroundSize: '400% 400%',
          animation: 'electric-border 3s ease infinite',
        }}
      />
      {/* Inner content */}
      <div className="relative bg-card rounded-full py-1.5 pl-3 pr-1 flex items-center gap-1">
        <span className="text-foreground text-sm font-medium">{service}</span>
        <button
          type="button"
          onClick={() => onRemove(service)}
          className="ml-1 rounded-full hover:bg-muted p-1 transition-colors"
          aria-label={`Remove ${service}`}
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ServiceTag;
