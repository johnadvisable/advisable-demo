import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
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
import { useTranslation } from 'react-i18next';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  selectedProduct: string;
  message: string;
  selectedServices: string[];
}

interface ContactFormFieldsProps {
  formData: ContactFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string) => void;
  handleProductChange: (value: string) => void;
  handleServiceSelect: (serviceTitle: string) => void;
  handleServiceDeselect: (serviceTitle: string) => void;
  services: Service[];
  loadingServices: boolean;
  errors?: Record<string, string>;
  showErrors?: boolean;
}

const SecureContactFormFields = ({
  formData,
  handleChange,
  handleSelectChange,
  handleProductChange,
  handleServiceSelect,
  handleServiceDeselect,
  services,
  loadingServices,
  errors = {},
  showErrors = false,
}: ContactFormFieldsProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('contact');

  // Phone placeholder based on country/language
  const getPhonePlaceholder = () => {
    switch (currentLanguage) {
      case 'el':
        return '+30 21X XXX XXXX';
      case 'it':
        return '+39 0XX XXX XXXX';
      case 'fr':
        return '+33 X XX XX XX XX';
      case 'de':
        return '+49 XXX XXXXXXX';
      case 'es':
        return '+34 XXX XX XX XX';
      default:
        return '+1 (XXX) XXX-XXXX';
    }
  };

  // Enhanced input validation and sanitization
  const validateAndSanitizeInput = (value: string, field: string): string => {
    // Remove potential XSS attempts - keep spaces intact
    let sanitized = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/eval\s*\(/gi, '');
    
    // Field-specific validation
    switch (field) {
      case 'email':
        // Only trim email, no spaces allowed
        sanitized = sanitized.trim();
        if (sanitized && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
          console.warn('Invalid email format detected');
        }
        break;
      case 'phone':
        // Basic phone validation - allow various international formats
        if (sanitized && !/^[\+]?[\d\s\-\(\)]{0,20}$/.test(sanitized)) {
          console.warn('Potentially invalid phone format');
        }
        if (sanitized.length > 20) {
          return sanitized.substring(0, 20);
        }
        break;
      case 'name':
        if (sanitized.length > 100) {
          return sanitized.substring(0, 100);
        }
        // Remove numbers and dangerous special characters from name, but keep spaces
        return sanitized.replace(/[0-9!@#$%^&*()_+=\[\]{};:"\\|,.<>\?\/`~]/g, '');
      case 'company':
        if (sanitized.length > 150) {
          return sanitized.substring(0, 150);
        }
        break;
      case 'message':
        if (sanitized.length > 500) {
          return sanitized.substring(0, 500);
        }
        break;
    }
    
    return sanitized;
  };

  const handleSecureInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    try {
      const sanitizedValue = validateAndSanitizeInput(value, name);

      const sanitizedEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: sanitizedValue
        }
      } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      
      handleChange(sanitizedEvent);
    } catch (error) {
      console.error('❌ Input processing error:', error);
      handleChange(e);
    }
  };

  // Ensure we always have a valid array
  const validServices = Array.isArray(services) && services ? services : [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="text-foreground font-medium">
              {t('form.fullName')}
            </Label>
            {showErrors && errors.name && (
              <span className="text-sm text-destructive">{errors.name}</span>
            )}
          </div>
          <div className={`relative rounded-xl p-[1px] transition-all duration-300 ${formData.name ? 'gradient-input-active' : ''}`}>
            <div className="gradient-input-border" />
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleSecureInputChange}
              placeholder={t('form.namePlaceholder')}
              required
              maxLength={100}
              className={`relative bg-background border border-[#e1e1e1] focus:border-transparent focus:ring-0 rounded-[10px] ${
                showErrors && errors.name ? 'border-destructive' : ''
              }`}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email *
            </Label>
            {showErrors && errors.email && (
              <span className="text-sm text-destructive">{errors.email}</span>
            )}
          </div>
          <div className={`relative rounded-xl p-[1px] transition-all duration-300 ${formData.email ? 'gradient-input-active' : ''}`}>
            <div className="gradient-input-border" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleSecureInputChange}
              placeholder="john@example.com"
              required
              maxLength={254}
              className={`relative bg-background border border-[#e1e1e1] focus:border-transparent focus:ring-0 rounded-[10px] ${
                showErrors && errors.email ? 'border-destructive' : ''
              }`}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="company" className="text-foreground font-medium">
            {t('form.company')}
          </Label>
          <div className={`relative rounded-xl p-[1px] transition-all duration-300 ${formData.company ? 'gradient-input-active' : ''}`}>
            <div className="gradient-input-border" />
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleSecureInputChange}
              placeholder={t('form.companyPlaceholder')}
              maxLength={150}
              className="relative bg-background border border-[#e1e1e1] focus:border-transparent focus:ring-0 rounded-[10px]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className="text-foreground font-medium">
            {t('form.phone')}
          </Label>
          <div className={`relative rounded-xl p-[1px] transition-all duration-300 ${formData.phone ? 'gradient-input-active' : ''}`}>
            <div className="gradient-input-border" />
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleSecureInputChange}
              placeholder={getPhonePlaceholder()}
              maxLength={20}
              className="relative bg-background border border-[#e1e1e1] focus:border-transparent focus:ring-0 rounded-[10px]"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mb-6">
        <div className="flex justify-between items-center">
          <Label htmlFor="interest" className="text-foreground font-medium">
            {t('form.interest')}
          </Label>
          {showErrors && errors.interest && (
            <span className="text-sm text-destructive">{errors.interest}</span>
          )}
        </div>
        <div className={`relative rounded-xl p-[1px] transition-all duration-300 ${formData.interest ? 'gradient-input-active' : ''}`}>
          <div className="gradient-input-border" />
          <Select
            value={formData.interest}
            onValueChange={handleSelectChange}
            required
          >
            <SelectTrigger
              id="interest"
              className={`relative bg-background border border-[#e1e1e1] text-foreground focus:border-transparent focus:ring-0 rounded-[10px] ${
                showErrors && errors.interest ? 'border-destructive' : ''
              }`}
            >
              <SelectValue
                placeholder={t('form.selectPlaceholder')}
              />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border shadow-lg rounded-xl">
              <SelectItem value="ai-services" className="hover:bg-secondary">
                <span className="flex items-center gap-2">
                  {t('form.aiServices', 'AI Services')}
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">
                    Hot
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="digital-agency" className="hover:bg-secondary">
                {t('form.digitalAgency')}
              </SelectItem>
              <SelectItem value="technology" className="hover:bg-secondary">
                {t('form.technology', 'Technology')}
              </SelectItem>
              <SelectItem value="training" className="hover:bg-secondary">
                {t('form.training', 'Training')}
              </SelectItem>



              <SelectItem value="venture-studio" className="hover:bg-secondary">
                {t('form.ventureStudio')}
              </SelectItem>
              <SelectItem value="products" className="hover:bg-secondary">
                {t('form.products', 'Products')}
              </SelectItem>
              <SelectItem value="other" className="hover:bg-secondary">
                {t('form.other')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products sub-dropdown */}
      {formData.interest === "products" && (
        <div className="space-y-1 mb-6">
          <div className="flex justify-between items-center">
            <Label htmlFor="selectedProduct" className="text-foreground font-medium">
              {t('form.selectProduct', 'Select Product *')}
            </Label>
            {showErrors && errors.selectedProduct && (
              <span className="text-sm text-destructive">{errors.selectedProduct}</span>
            )}
          </div>
          <div className={`relative rounded-xl p-[1px] transition-all duration-300 ${formData.selectedProduct ? 'gradient-input-active' : ''}`}>
            <div className="gradient-input-border" />
            <Select
              value={formData.selectedProduct}
              onValueChange={handleProductChange}
              required
            >
              <SelectTrigger
                id="selectedProduct"
                className={`relative bg-background border border-[#e1e1e1] text-foreground focus:border-transparent focus:ring-0 rounded-[10px] ${
                  showErrors && errors.selectedProduct ? 'border-destructive' : ''
                }`}
              >
                <SelectValue placeholder={t('form.selectProductPlaceholder', 'Select a product')} />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border shadow-lg rounded-xl">
                <SelectItem value="ecommercen" className="hover:bg-secondary">Ecommercen</SelectItem>
                <SelectItem value="sizethemarket" className="hover:bg-secondary">SizeTheMarket</SelectItem>
                <SelectItem value="ai-recommendations" className="hover:bg-secondary">Recommendable</SelectItem>
                <SelectItem value="e-prescription" className="hover:bg-secondary">E Prescription Cloud ERP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {formData.interest === "digital-agency" && (
        <div className={`space-y-2 mb-6 p-4 rounded-xl border ${
          showErrors && errors.services ? 'border-destructive bg-destructive/5' : 'border-border bg-secondary/50'
        }`}>
          <div className="flex justify-between items-center">
            <Label htmlFor="services" className="text-foreground font-medium">
              {t('form.selectServices')}
            </Label>
            {showErrors && errors.services && (
              <span className="text-sm text-destructive">{errors.services}</span>
            )}
          </div>
          
          {formData.selectedServices.length > 0 && (
            <div className="flex flex-wrap gap-2 my-3">
              {formData.selectedServices.map((service) => (
                <ServiceTag 
                  key={service} 
                  service={service} 
                  onRemove={handleServiceDeselect} 
                />
              ))}
            </div>
          )}
          
          <ServiceSelector
            services={validServices}
            selectedServices={formData.selectedServices}
            isLoading={loadingServices}
            onSelectService={handleServiceSelect}
            onRemoveService={handleServiceDeselect}
          />
        </div>
      )}
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label htmlFor="message" className="text-foreground font-medium">
            {t('form.message')}
          </Label>
          {showErrors && errors.message && (
            <span className="text-sm text-destructive">{errors.message}</span>
          )}
        </div>
        <div className={`relative rounded-xl p-[1px] transition-all duration-300 ${formData.message ? 'gradient-input-active' : ''}`}>
          <div className="gradient-input-border" />
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleSecureInputChange}
            placeholder={t('form.messagePlaceholder')}
            rows={5}
            required
            maxLength={500}
            className={`relative bg-background border border-[#e1e1e1] focus:border-transparent focus:ring-0 rounded-[10px] resize-none ${
              showErrors && errors.message ? 'border-destructive' : ''
            }`}
          />
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {formData.message.length}/500 {t('form.characters')}
        </div>
      </div>
    </>
  );
};

export default SecureContactFormFields;