
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Service } from "@/services/serviceService";

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: string[];
  isLoading: boolean;
  onSelectService: (serviceTitle: string) => void;
  onRemoveService: (serviceTitle: string) => void;
}

const ServiceSelector = ({
  services,
  selectedServices,
  isLoading,
  onSelectService,
  // onRemoveService - unused
}: ServiceSelectorProps) => {
  const { currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");


  // Memoized valid services for better performance
  const validServices = useMemo(() => {
    if (!Array.isArray(services)) {
      return [];
    }

    return services.filter(service =>
      service &&
      service.title &&
      typeof service.title === 'string' &&
      service.title.trim() !== '' &&
      service.title !== 'undefined' &&
      service.short_description &&
      service.id
    );
  }, [services]);
  
  // Memoized filtered services
  const filteredServices = useMemo(() => {
    if (!searchValue.trim()) return validServices;

    return validServices.filter((service) =>
      service &&
      service.title &&
      (service.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      (service.short_description && service.short_description.toLowerCase().includes(searchValue.toLowerCase())))
    );
  }, [validServices, searchValue]);
  
  // Enhanced handler for selecting a service
  const handleSelect = (serviceTitle: string) => {
    // Prevent selecting undefined or empty values
    if (!serviceTitle || serviceTitle === 'undefined' || serviceTitle.trim() === '') {
      console.warn('Attempted to select invalid service:', serviceTitle);
      return;
    }

    // Check if already selected
    if (selectedServices.includes(serviceTitle)) {
      return;
    }

    onSelectService(serviceTitle);
    setSearchValue(""); // Clear search after selection
    setOpen(false); // Close popover after selection
  };

  const getDisplayText = () => {
    if (selectedServices.length === 0) {
      return currentLanguage === 'el' ? "Επιλέξτε υπηρεσίες..." : "Select services...";
    }
    
    if (currentLanguage === 'el') {
      return `${selectedServices.length} υπηρεσία${selectedServices.length > 1 ? 'ες' : ''} επιλεγμένη`;
    } else {
      return `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`;
    }
  };


  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(!open)}
            disabled={isLoading}
          >
            {getDisplayText()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-white border border-gray-200 shadow-lg"
          align="start"
        >
          <Command className="bg-white">
            <CommandInput
              placeholder={currentLanguage === 'el' ? "Αναζήτηση υπηρεσιών..." : "Search services..."}
              value={searchValue}
              onValueChange={setSearchValue}
              className="bg-white text-gray-900 border-0 ring-0 focus:ring-0 focus:border-0 placeholder:text-gray-400"
            />
            <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm text-gray-500">
                <div className="flex justify-center py-2">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-advisable-blue rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-advisable-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="h-2 w-2 bg-advisable-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
                <div>{currentLanguage === 'el' ? "Φόρτωση υπηρεσιών..." : "Loading services..."}</div>
              </div>
            ) : validServices.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div>{currentLanguage === 'el' ? "Δεν βρέθηκαν υπηρεσίες" : "No services found"}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {currentLanguage === 'el' ? "Δοκιμάστε να ανανεώσετε τη σελίδα" : "Try refreshing the page"}
                </div>
              </div>
            ) : filteredServices.length === 0 && searchValue ? (
              <CommandEmpty className="p-4 text-center">
                <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="text-sm text-gray-500">
                  {currentLanguage === 'el' 
                    ? `Δεν βρέθηκαν αποτελέσματα για "${searchValue}"`
                    : `No results found for "${searchValue}"`
                  }
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {currentLanguage === 'el' 
                    ? "Δοκιμάστε διαφορετικούς όρους αναζήτησης"
                    : "Try different search terms"
                  }
                </div>
              </CommandEmpty>
            ) : (
              <CommandGroup className="max-h-64 overflow-y-auto">
                {(filteredServices || []).map((service) => {
                  const serviceTitle = service?.title || 'Unknown Service';
                  const serviceId = service?.id || `service-${Math.random()}`;

                  return (
                    <CommandItem
                      key={serviceId}
                      value={serviceId}
                      onSelect={() => handleSelect(serviceTitle)}
                      className={cn(
                        "bg-white hover:bg-gray-100 cursor-pointer px-4 py-3 transition-colors",
                        serviceTitle && selectedServices.includes(serviceTitle) && "bg-blue-50"
                      )}
                    >
                    <div className="flex items-center w-full">
                      <Check
                        className={cn(
                          "mr-3 h-4 w-4 text-advisable-blue flex-shrink-0",
                          serviceTitle && selectedServices.includes(serviceTitle)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 truncate block">
                          {serviceTitle}
                        </span>
                        {service?.short_description && (
                          <span className="text-xs text-gray-500 truncate block mt-1">
                            {service.short_description}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ServiceSelector;
