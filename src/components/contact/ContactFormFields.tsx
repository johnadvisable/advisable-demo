
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServiceSelector from "./ServiceSelector";
import ServiceTag from "./ServiceTag";
import { Service } from "@/services/serviceService";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  message: string;
  selectedServices: string[];
}

interface ContactFormFieldsProps {
  formData: ContactFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string) => void;
  handleServiceSelect: (serviceTitle: string) => void;
  removeService: (serviceTitle: string) => void;
  digitalAgencyServices: Service[];
  isLoadingDigitalAgency: boolean;
}

const ContactFormFields = ({
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  removeService,
  digitalAgencyServices,
  isLoadingDigitalAgency,
}: ContactFormFieldsProps) => {
  // Ensure we always have a valid array
  const services = Array.isArray(digitalAgencyServices) ? digitalAgencyServices : [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-advisable-darkPurple font-medium">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="border-gray-300 focus:border-advisable-blue focus:ring-1 focus:ring-advisable-blue"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-advisable-darkPurple font-medium">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="border-gray-300 focus:border-advisable-blue focus:ring-1 focus:ring-advisable-blue"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company" className="text-advisable-darkPurple font-medium">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your Company"
            className="border-gray-300 focus:border-advisable-blue focus:ring-1 focus:ring-advisable-blue"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-advisable-darkPurple font-medium">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+30 123 456 7890"
            className="border-gray-300 focus:border-advisable-blue focus:ring-1 focus:ring-advisable-blue"
          />
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <Label htmlFor="interest" className="text-advisable-darkPurple font-medium">I'm interested in *</Label>
        <Select 
          value={formData.interest} 
          onValueChange={handleSelectChange}
          required
        >
          <SelectTrigger id="interest" className="bg-white border-gray-300 text-gray-900 focus:border-advisable-blue focus:ring-1 focus:ring-advisable-blue">
            <SelectValue placeholder="Select a product or service" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="ecommercen" className="bg-white hover:bg-gray-100">ECOMMERCEN</SelectItem>
            <SelectItem value="sizethemarket" className="bg-white hover:bg-gray-100">SizeTheMarket</SelectItem>
            <SelectItem value="ai-recommendations" className="bg-white hover:bg-gray-100">Recommendable</SelectItem>
            <SelectItem value="e-prescription" className="bg-white hover:bg-gray-100">Esyntagi</SelectItem>
            <SelectItem value="digital-agency" className="bg-white hover:bg-gray-100">Digital Agency Services</SelectItem>
            <SelectItem value="venture-studio" className="bg-white hover:bg-gray-100">Venture Studio Services</SelectItem>
            <SelectItem value="other" className="bg-white hover:bg-gray-100">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.interest === "digital-agency" && (
        <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Label htmlFor="services" className="text-advisable-darkPurple font-medium">Select Digital Agency Services *</Label>
          
          {formData.selectedServices.length > 0 && (
            <div className="flex flex-wrap gap-2 my-3">
              {formData.selectedServices.map((service) => (
                <ServiceTag 
                  key={service} 
                  service={service} 
                  onRemove={removeService} 
                />
              ))}
            </div>
          )}
          
          <ServiceSelector
            services={services}
            selectedServices={formData.selectedServices}
            isLoading={isLoadingDigitalAgency}
            onSelectService={handleServiceSelect}
            onRemoveService={removeService}
          />
          
          {formData.interest === "digital-agency" && formData.selectedServices.length === 0 && (
            <p className="text-sm text-red-500 mt-1">Please select at least one service</p>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="message" className="text-advisable-darkPurple font-medium">Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your project or question..."
          rows={5}
          required
          className="border-gray-300 focus:border-advisable-blue focus:ring-1 focus:ring-advisable-blue resize-none"
        />
      </div>
    </>
  );
};

export default ContactFormFields;
