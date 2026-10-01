import { useState, useRef, useEffect, useCallback } from "react";
import SpaceIntroAnimation from "@/components/careers/SpaceIntroAnimation";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { MapPin, Briefcase, Clock, ArrowLeft, Send, Loader2, CheckCircle, Paperclip, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { stripHtml } from "@/lib/utils";
import { toast } from "sonner";

const languageIdMap: Record<string, number> = {
  en: 1, es: 2, fr: 3, de: 4, el: 5, it: 10,
};

const cityLabels: Record<string, string> = { athens: "Athens", patras: "Patras" };
const departmentLabels: Record<string, string> = {
  marketing: "Marketing", development: "Development", graphics: "Graphics",
  design: "Design", management: "Management",
};
const employmentLabels: Record<string, string> = {
  "full-time": "Full-Time", "part-time": "Part-Time", contract: "Contract",
};

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const CareerDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation("shared");
  const langId = languageIdMap[currentLanguage] || 1;
  const formRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job-detail", slug, langId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_listings")
        .select(`*, job_listing_translations(*)`)
        .eq("slug", slug!)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      const translation = data.job_listing_translations?.find(
        (tr: any) => tr.language_id === langId
      ) || data.job_listing_translations?.[0];
      return { ...data, translation };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", linkedin_url: "", portfolio_url: "", cover_letter: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // AI Tools questions (Development department only)
  const [aiToolsUsage, setAiToolsUsage] = useState("");
  const [aiToolPreference, setAiToolPreference] = useState("");
  const [aiAgentsExperience, setAiAgentsExperience] = useState("");
  const isDevelopment = job?.department?.toLowerCase() === "development";
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const hasTurnstileKey = !!TURNSTILE_SITE_KEY;

  // Load Turnstile script (managed mode) + global callbacks
  useEffect(() => {
    if (!hasTurnstileKey) return;

    // Define global callbacks for managed mode
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
      setTurnstileError(false);
    };
    (window as any).onTurnstileError = () => {
      setTurnstileToken(null);
      setTurnstileError(true);
    };
    (window as any).onTurnstileExpired = () => {
      setTurnstileToken(null);
    };

    // Load script if not already present (no render=explicit → managed mode)
    if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onerror = () => setTurnstileError(true);
      document.head.appendChild(script);
    }

    // Timeout fallback: if widget doesn't produce a token within 10s, silently allow submission
    const timeout = setTimeout(() => {
      if (!document.querySelector('.cf-turnstile iframe')) {
        setTurnstileError(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      delete (window as any).onTurnstileSuccess;
      delete (window as any).onTurnstileError;
      delete (window as any).onTurnstileExpired;
    };
  }, [hasTurnstileKey]);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null);
    // In managed mode, find and reset the widget
    if (window.turnstile) {
      const container = document.querySelector('.cf-turnstile');
      if (container) {
        try { (window.turnstile as any).reset(container); } catch {}
      }
    }
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const ALLOWED_CV_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      setCvError("Only PDF, Word (.doc/.docx) and PowerPoint (.ppt/.pptx) files are allowed.");
      return;
    }
    if (file.size > MAX_CV_SIZE) {
      setCvError("File size must be under 5MB.");
      return;
    }
    setCvFile(file);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // strip data:...;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Please enter your full name.";
    if (!formData.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (isDevelopment && !aiToolsUsage) errors.aiToolsUsage = "Please answer this question.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorKey = Object.keys(errors)[0];
      document.getElementById(firstErrorKey === "aiToolsUsage" ? "ai-tools-usage" : firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setFieldErrors({});
    if (hasTurnstileKey && !turnstileToken && !turnstileError) {
      toast.error("Please complete the security verification.");
      return;
    }

    setIsSubmitting(true);
    try {
      let cv_file = null;
      if (cvFile) {
        const base64 = await fileToBase64(cvFile);
        cv_file = { name: cvFile.name, type: cvFile.type, base64 };
      }
      const { error } = await supabase.functions.invoke("send-career-application", {
        body: {
          ...formData,
          cv_file,
          job_listing_id: job?.id,
          job_title: job?.translation?.title || slug,
          turnstileToken,
          language: currentLanguage,
          ...(isDevelopment && {
            ai_tools_usage: aiToolsUsage,
            ai_tool_preference: aiToolPreference || null,
            ai_agents_experience: aiAgentsExperience || null,
          }),
        },
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      console.error("Error submitting application:", err);
      resetTurnstile();
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header variant="light" />
        <div className="pt-32 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header variant="light" />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Position not found</h1>
          <Link to="/careers">
            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const tr = job.translation;

  return (
    <SEOWrapper
      title={`${tr?.title || "Career"} - Advisable`}
      description={stripHtml(tr?.short_description) || "Career opportunity at Advisable"}
      image="/images/og-careers.png"
      type="website"
    >
      {showIntro && <SpaceIntroAnimation onComplete={() => setShowIntro(false)} />}
      <div className={`min-h-screen transition-opacity duration-700 ${showIntro ? "opacity-0 bg-[#000]" : "opacity-100 bg-background"}`}>
        <Header variant="light" />

        {/* Hero */}
        <div className="relative pt-20 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(220,60%,15%)]">
          <div className="container mx-auto px-4 py-16 sm:py-20 relative z-10">
            <Link to="/careers" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all positions
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-white/20 text-white border-0">
                <MapPin className="h-3 w-3 mr-1" /> {cityLabels[job.city] || job.city}
              </Badge>
              <Badge className="bg-white/20 text-white border-0">
                <Briefcase className="h-3 w-3 mr-1" /> {departmentLabels[job.department] || job.department}
              </Badge>
              <Badge className="bg-white/20 text-white border-0">
                <Clock className="h-3 w-3 mr-1" /> {employmentLabels[job.employment_type] || job.employment_type}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{tr?.title}</h1>
            <p className="text-lg text-gray-200 mb-6 max-w-2xl">{stripHtml(tr?.short_description)}</p>
            <Button onClick={scrollToForm} size="lg" className="bg-white text-foreground hover:bg-gray-100">
              Apply Now <ArrowLeft className="ml-2 h-4 w-4 rotate-[135deg]" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              {tr?.full_description && (
                <div
                  className="prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: tr.full_description }}
                />
              )}
              {tr?.requirements && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Requirements</h2>
                  <div
                    className="prose max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: tr.requirements }}
                  />
                </div>
              )}
              {tr?.benefits && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Benefits</h2>
                  <div
                    className="prose max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: tr.benefits }}
                  />
                </div>
              )}
            </div>

            {/* Application Form */}
            <div ref={formRef} className="lg:col-span-1">
              <div className="sticky top-28 bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">Apply for this position</h2>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">Thank you!</h3>
                    <p className="text-muted-foreground text-sm">
                      Your application has been submitted. We'll review it and get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} maxLength={100} className={fieldErrors.name ? "border-destructive" : ""} />
                      {fieldErrors.name && <p className="text-sm text-destructive mt-1">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} maxLength={254} className={fieldErrors.email ? "border-destructive" : ""} />
                      {fieldErrors.email && <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} maxLength={20} />
                    </div>
                    <div>
                      <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                      <Input id="linkedin_url" name="linkedin_url" type="url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..." maxLength={300} />
                    </div>
                    <div>
                      <Label htmlFor="portfolio_url">Portfolio / Website</Label>
                      <Input id="portfolio_url" name="portfolio_url" type="url" value={formData.portfolio_url} onChange={handleChange} placeholder="https://..." maxLength={300} />
                    </div>
                    <div>
                      <Label htmlFor="cover_letter">Cover Letter</Label>
                      <Textarea id="cover_letter" name="cover_letter" value={formData.cover_letter} onChange={handleChange} rows={5} maxLength={2000} placeholder="Tell us why you're interested in this role..." />
                    </div>

                    {/* AI Tools Questions - Development department only */}
                    {isDevelopment && (
                      <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
                        <div id="ai-tools-usage">
                          <Label className="text-sm font-medium">
                            {t("career.aiToolsQuestion")}
                          </Label>
                          <Select value={aiToolsUsage} onValueChange={(v) => { setAiToolsUsage(v); setFieldErrors((prev) => ({ ...prev, aiToolsUsage: "" })); if (v === "none") { setAiToolPreference(""); setAiAgentsExperience(""); } if (v !== "a_lot") { setAiAgentsExperience(""); } }}>
                            <SelectTrigger className={`mt-2 ${fieldErrors.aiToolsUsage ? "border-destructive" : ""}`}>
                              <SelectValue placeholder={t("career.selectOption")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a_lot">{t("career.aiToolsALot")}</SelectItem>
                              <SelectItem value="moderate">{t("career.aiToolsModerate")}</SelectItem>
                              <SelectItem value="little">{t("career.aiToolsLittle")}</SelectItem>
                              <SelectItem value="none">{t("career.aiToolsNone")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldErrors.aiToolsUsage && <p className="text-sm text-destructive mt-1">{fieldErrors.aiToolsUsage}</p>}
                        </div>

                        {aiToolsUsage && aiToolsUsage !== "none" && (
                          <div>
                            <Label className="text-sm font-medium">
                              {t("career.aiToolPreferenceQuestion")}
                            </Label>
                            <RadioGroup value={aiToolPreference} onValueChange={setAiToolPreference} className="mt-2 space-y-2">
                              {["Claude Code", "AWS Kiro", "Google Antigravity", "WindSurf", "Cursor", "Other"].map((tool) => (
                                <div key={tool} className="flex items-center space-x-2">
                                  <RadioGroupItem value={tool} id={`ai-tool-${tool}`} />
                                  <Label htmlFor={`ai-tool-${tool}`} className="font-normal cursor-pointer">{tool}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}

                        {aiToolsUsage === "a_lot" && (
                          <div>
                            <Label className="text-sm font-medium">
                              {t("career.aiAgentsQuestion")}
                            </Label>
                            <RadioGroup value={aiAgentsExperience} onValueChange={setAiAgentsExperience} className="mt-2 space-y-2">
                              {[
                                { value: "yes", label: t("career.aiAgentsYes") },
                                { value: "no", label: t("career.aiAgentsNo") },
                              ].map((opt) => (
                                <div key={opt.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={opt.value} id={`ai-agents-${opt.value}`} />
                                  <Label htmlFor={`ai-agents-${opt.value}`} className="font-normal cursor-pointer">{opt.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="cv_file">CV / Resume</Label>
                      <div className="mt-1">
                        {cvFile ? (
                          <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/50">
                            <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground truncate flex-1">{cvFile.name}</span>
                            <button type="button" onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-muted-foreground hover:text-foreground">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="cv_file" className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary/50 transition-colors">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Upload PDF, Word or PowerPoint (max 5MB)</span>
                          </label>
                        )}
                        <input ref={fileInputRef} id="cv_file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileChange} className="hidden" />
                        {cvError && <p className="text-sm text-destructive mt-1">{cvError}</p>}
                      </div>
                    </div>

                    {hasTurnstileKey && (
                      <div className="flex flex-col items-center py-2">
                        <div
                          className="cf-turnstile"
                          data-sitekey={TURNSTILE_SITE_KEY}
                          data-callback="onTurnstileSuccess"
                          data-error-callback="onTurnstileError"
                          data-expired-callback="onTurnstileExpired"
                          data-theme="light"
                        />
                      </div>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" /> Submit Application</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default CareerDetail;
