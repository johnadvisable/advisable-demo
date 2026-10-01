// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, Loader2, CheckCircle, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const VERTICALS = ['AI/ML', 'RetailTech', 'GreenTech', 'AgriTech', 'HealthTech', 'Other'];
const BUSINESS_MODELS = ['SaaS', 'PaaS', 'IaaS', 'Marketplace', 'eCommerce', 'Other'];
const STAGES = ['Idea', 'Prototype', 'MVP', 'Beta', 'Growth', 'Mature product'];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

interface FormState {
  startupName: string;
  founderName: string;
  email: string;
  startupWebsite: string;
  problemSolving: string;
  marketTamSamSom: string;
  competitiveAdvantage: string;
  evaluationSignals: string;
  targetUsers: string;
  vertical: string;
  businessModel: string;
  businessModelOther: string;
  stage: string;
  uniqueness: string;
  pitchDeckLink: string;
  isLive: string;
  liveProductUrl: string;
  liveProductCredentials: string;
}

const initial: FormState = {
  startupName: '', founderName: '', email: '', startupWebsite: '',
  problemSolving: '', marketTamSamSom: '', competitiveAdvantage: '',
  evaluationSignals: '', targetUsers: '', vertical: '', businessModel: '',
  businessModelOther: '', stage: '', uniqueness: '', pitchDeckLink: '',
  isLive: '', liveProductUrl: '', liveProductCredentials: '',
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Field = ({ children, error, htmlFor, label, required, hint }: any) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="text-sm font-medium">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {hint && <p className="text-xs text-gray-500 leading-relaxed">{hint}</p>}
    {children}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const StartupApplicationForm = () => {
  const [data, setData] = useState<FormState>(initial);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  // Load Turnstile script
  useEffect(() => {
    if (document.querySelector('script[src*="turnstile"]')) {
      setTurnstileLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!turnstileLoaded || !turnstileRef.current || !window.turnstile) return;
    if (turnstileWidgetId.current) return;
    if (!TURNSTILE_SITE_KEY) return;
    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(null),
      'error-callback': () => setTurnstileToken(null),
      theme: 'light',
      size: 'normal',
    });
    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [turnstileLoaded]);

  const resetTurnstile = useCallback(() => {
    if (turnstileWidgetId.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId.current);
      setTurnstileToken(null);
    }
  }, []);

  const update = (k: keyof FormState, v: string) => {
    setData(prev => ({ ...prev, [k]: v }));
    if (errors[k]) {
      setErrors(prev => {
        const u = { ...prev }; delete u[k]; return u;
      });
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const required: Array<[keyof FormState, string]> = [
      ['startupName', 'Startup name is required'],
      ['founderName', "Founder's name is required"],
      ['email', 'Email is required'],
      ['problemSolving', 'Please describe the problem'],
      ['marketTamSamSom', 'Market sizing is required'],
      ['competitiveAdvantage', 'Competitive advantage is required'],
      ['evaluationSignals', 'Evaluation signals are required'],
      ['targetUsers', 'Target users are required'],
      ['vertical', 'Please select a vertical'],
      ['businessModel', 'Please select a business model'],
      ['stage', 'Please select a stage'],
      ['uniqueness', 'Please describe what is unique'],
    ];
    for (const [k, msg] of required) if (!data[k]?.toString().trim()) e[k] = msg;
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      e.email = 'Invalid email address';
    }
    if (data.businessModel === 'Other' && !data.businessModelOther.trim()) {
      e.businessModelOther = 'Please specify your business model';
    }
    if (!file && !data.pitchDeckLink.trim()) {
      e.pitchDeck = 'Please attach a pitch deck file or provide a link';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      toast.error('File too large (max 15MB)');
      return;
    }
    setFile(f);
    setErrors(prev => { const u = { ...prev }; delete u.pitchDeck; return u; });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors above');
      return;
    }
    if (TURNSTILE_SITE_KEY && turnstileLoaded && !turnstileToken) {
      toast.error('Please complete the security verification');
      return;
    }
    setSubmitting(true);
    try {
      let pitchDeckFile: { name: string; type: string; base64: string } | undefined;
      if (file) {
        const base64 = await fileToBase64(file);
        pitchDeckFile = { name: file.name, type: file.type, base64 };
      }

      const payload = {
        startupName: data.startupName,
        founderName: data.founderName,
        email: data.email,
        startupWebsite: data.startupWebsite,
        problemSolving: data.problemSolving,
        marketTamSamSom: data.marketTamSamSom,
        competitiveAdvantage: data.competitiveAdvantage,
        evaluationSignals: data.evaluationSignals,
        targetUsers: data.targetUsers,
        vertical: data.vertical,
        businessModel: data.businessModel,
        businessModelOther: data.businessModelOther,
        stage: data.stage,
        uniqueness: data.uniqueness,
        pitchDeckLink: data.pitchDeckLink,
        isLive: data.isLive,
        liveProductUrl: data.liveProductUrl,
        liveProductCredentials: data.liveProductCredentials,
        pitchDeckFile,
        language: typeof navigator !== 'undefined' ? navigator.language : 'en',
        turnstileToken: turnstileToken || '',
      };

      const { data: res, error } = await supabase.functions.invoke(
        'send-startup-application',
        { body: payload },
      );
      if (error) throw new Error(error.message || 'Failed to send');
      if (res && res.error) throw new Error(res.error);

      setSubmitted(true);
      setData(initial);
      setFile(null);
      resetTurnstile();
      toast.success('Application sent successfully!');
    } catch (err: any) {
      console.error(err);
      resetTurnstile();
      toast.error(err.message || 'Failed to send application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-advisable-darkPurple mb-3">Thank you!</h3>
        <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
          We have received your application. A copy has been sent to your email and our Venture Studio team will get back to you shortly.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-full px-6">
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
      <div className="grid md:grid-cols-2 gap-6">
        <Field htmlFor="startupName" label="Startup name" required error={errors.startupName}>
          <Input id="startupName" value={data.startupName} onChange={e => update('startupName', e.target.value)} maxLength={200} />
        </Field>
        <Field htmlFor="founderName" label="Founder's name" required error={errors.founderName}>
          <Input id="founderName" value={data.founderName} onChange={e => update('founderName', e.target.value)} maxLength={200} />
        </Field>
        <Field htmlFor="email" label="Email" required error={errors.email}>
          <Input id="email" type="email" value={data.email} onChange={e => update('email', e.target.value)} maxLength={254} />
        </Field>
        <Field htmlFor="startupWebsite" label="Startup website" error={errors.startupWebsite}>
          <Input id="startupWebsite" type="url" placeholder="https://" value={data.startupWebsite} onChange={e => update('startupWebsite', e.target.value)} maxLength={500} />
        </Field>
      </div>

      <Field htmlFor="problemSolving" label="What problem are you solving?" required error={errors.problemSolving}
        hint="Describe the core pain point or gap in the market your startup addresses. Be specific: who has the problem, how often, and what are the consequences of it going unsolved.">
        <Textarea id="problemSolving" rows={4} value={data.problemSolving} onChange={e => update('problemSolving', e.target.value)} maxLength={4000} />
      </Field>

      <Field htmlFor="marketTamSamSom" label="Market: TAM / SAM / SOM" required error={errors.marketTamSamSom}
        hint="Quantify your market opportunity. TAM (Total Addressable Market) is the full global demand for your solution. SAM (Serviceable Addressable Market) is the portion you can realistically reach. SOM (Serviceable Obtainable Market) is what you can capture in the near term.">
        <Textarea id="marketTamSamSom" rows={4} value={data.marketTamSamSom} onChange={e => update('marketTamSamSom', e.target.value)} maxLength={4000} />
      </Field>

      <Field htmlFor="competitiveAdvantage" label="Competitive advantage" required error={errors.competitiveAdvantage}
        hint="Explain what makes your solution difficult to replicate: proprietary technology, unique data, network effects, exclusive partnerships, or a team with rare domain expertise.">
        <Textarea id="competitiveAdvantage" rows={4} value={data.competitiveAdvantage} onChange={e => update('competitiveAdvantage', e.target.value)} maxLength={4000} />
      </Field>

      <Field htmlFor="evaluationSignals" label="Evaluation signals" required error={errors.evaluationSignals}
        hint="Share early evidence that people are interested in your solution: user interviews, a waiting list, letters of intent, pilot agreements, or early adopter sign-ups. If someone is already paying, that counts as validation, an even stronger signal.">
        <Textarea id="evaluationSignals" rows={4} value={data.evaluationSignals} onChange={e => update('evaluationSignals', e.target.value)} maxLength={4000} />
      </Field>

      <Field htmlFor="targetUsers" label="Target users" required error={errors.targetUsers}>
        <Textarea id="targetUsers" rows={3} value={data.targetUsers} onChange={e => update('targetUsers', e.target.value)} maxLength={2000} />
      </Field>

      <div className="grid md:grid-cols-3 gap-6">
        <Field htmlFor="vertical" label="Vertical" required error={errors.vertical}>
          <Select value={data.vertical} onValueChange={v => update('vertical', v)}>
            <SelectTrigger id="vertical"><SelectValue placeholder="Select vertical" /></SelectTrigger>
            <SelectContent className="bg-white">
              {VERTICALS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field htmlFor="businessModel" label="Business model" required error={errors.businessModel}>
          <Select value={data.businessModel} onValueChange={v => update('businessModel', v)}>
            <SelectTrigger id="businessModel"><SelectValue placeholder="Select model" /></SelectTrigger>
            <SelectContent className="bg-white">
              {BUSINESS_MODELS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field htmlFor="stage" label="Stage" required error={errors.stage}>
          <Select value={data.stage} onValueChange={v => update('stage', v)}>
            <SelectTrigger id="stage"><SelectValue placeholder="Select stage" /></SelectTrigger>
            <SelectContent className="bg-white">
              {STAGES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {data.businessModel === 'Other' && (
        <Field htmlFor="businessModelOther" label='If you selected "Other" above, please specify your business model' required error={errors.businessModelOther}>
          <Input id="businessModelOther" value={data.businessModelOther} onChange={e => update('businessModelOther', e.target.value)} maxLength={200} />
        </Field>
      )}

      <Field htmlFor="uniqueness" label="Uniqueness of idea" required error={errors.uniqueness}
        hint="Beyond your competitive advantage, describe what is genuinely novel about your approach. What insight or angle does your startup have that others have missed?">
        <Textarea id="uniqueness" rows={4} value={data.uniqueness} onChange={e => update('uniqueness', e.target.value)} maxLength={4000} />
      </Field>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Pitch deck<span className="text-red-500 ml-1">*</span></Label>
        <p className="text-xs text-gray-500">Please attach a file (PDF/PPT/PPTX/DOCX, max 15MB) or paste a link.</p>

        <div className="flex items-center gap-3">
          <label htmlFor="pitchDeckFile" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700">
            <Upload className="w-4 h-4" />
            {file ? 'Replace file' : 'Choose file'}
          </label>
          <input
            id="pitchDeckFile"
            type="file"
            className="hidden"
            accept=".pdf,.ppt,.pptx,.doc,.docx,.key"
            onChange={onFileChange}
          />
          {file && (
            <span className="inline-flex items-center gap-2 text-sm text-gray-700">
              {file.name}
              <button type="button" onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>

        <Input
          type="url"
          placeholder="Or paste a link to your pitch deck (Google Drive, Notion, etc.)"
          value={data.pitchDeckLink}
          onChange={e => update('pitchDeckLink', e.target.value)}
          maxLength={500}
        />
        {errors.pitchDeck && <p className="text-sm text-red-600">{errors.pitchDeck}</p>}
      </div>

      <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
        <Field htmlFor="isLive" label="Is your product live?" hint="Optional. If yes, share a URL and any credentials we need to evaluate it.">
          <Select value={data.isLive} onValueChange={v => update('isLive', v)}>
            <SelectTrigger id="isLive"><SelectValue placeholder="Select an option" /></SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {data.isLive === 'yes' && (
          <div className="space-y-4 pt-2">
            <Field htmlFor="liveProductUrl" label="Product URL">
              <Input id="liveProductUrl" type="url" placeholder="https://" value={data.liveProductUrl} onChange={e => update('liveProductUrl', e.target.value)} maxLength={500} />
            </Field>
            <Field htmlFor="liveProductCredentials" label="Access credentials or notes" hint="Optional. Test account, login details, or any access notes so our team can evaluate the product. Stored securely.">
              <Textarea id="liveProductCredentials" rows={3} value={data.liveProductCredentials} onChange={e => update('liveProductCredentials', e.target.value)} maxLength={2000} />
            </Field>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <div ref={turnstileRef} />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-advisable-darkPurple hover:bg-advisable-purple text-white py-6 text-lg font-medium rounded-full"
      >
        {submitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending...</>
        ) : (
          <><Send className="w-5 h-5 mr-2" />Send Application</>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to our privacy policy. A copy of your application will be emailed to you.
      </p>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree that Advisable Studio will treat your materials with reasonable confidentiality and will not share them outside our internal review team. We will not replicate your concept without a separate written agreement. Submission does not create any partnership or investment commitment.
      </p>
    </form>
  );
};

export default StartupApplicationForm;
