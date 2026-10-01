// @ts-nocheck
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { trackAcademyEvent } from '@/lib/academyTracking';
import { CheckCircle, Mail } from 'lucide-react';

interface Props {
  seminar?: string;
  title?: string;
  subtitle?: string;
}

export default function SeminarWaitlist({
  seminar = 'ai-for-business',
  title = 'Δεν σε βολεύουν οι ημερομηνίες;',
  subtitle = 'Άφησε το email σου και θα σε ενημερώσουμε πρώτο για το επόμενο τμήμα.',
}: Props) {
  const { currentLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Συμπλήρωσε ένα έγκυρο email');
      return;
    }
    if (!consent) {
      toast.error('Χρειαζόμαστε τη συγκατάθεσή σου');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: name || 'Waitlist',
          email,
          interest: `academy-waitlist-${seminar}`,
          message: `Λίστα αναμονής για το σεμινάριο ${seminar}.`,
          currentPage: typeof window !== 'undefined' ? window.location.pathname : '',
          language: currentLanguage,
          turnstileToken: '',
          consent: true,
        },
      });
      if (error) throw new Error(error.message);
      if (data && data.success === false) throw new Error(data.error || 'failed');

      trackAcademyEvent('waitlist_signup', { seminar });
      setDone(true);
    } catch (err) {
      toast.error('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="border-b border-border/50">
      <div className="container mx-auto px-4 py-14 lg:py-20">
        <Card className="mx-auto max-w-3xl border-border/60 bg-card/40 p-6 lg:p-8">
          {done ? (
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm">
                Σε προσθέσαμε στη λίστα. Θα σε ενημερώσουμε πρώτο για το επόμενο τμήμα.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-primary">
                <Mail className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-[0.2em]">ΛΙΣΤΑ ΑΝΑΜΟΝΗΣ</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="wl-name" className="text-xs">Ονοματεπώνυμο</Label>
                    <Input id="wl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Προαιρετικό" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="wl-email" className="text-xs">Email</Label>
                    <Input id="wl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1" />
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="wl-consent" checked={consent} onCheckedChange={(v) => setConsent(Boolean(v))} className="mt-0.5" />
                  <Label htmlFor="wl-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
                    Συμφωνώ να επικοινωνήσετε μαζί μου για το επόμενο τμήμα, σύμφωνα με την πολιτική απορρήτου.
                  </Label>
                </div>
                <Button type="submit" disabled={sending}>
                  {sending ? 'Αποστολή...' : 'Κράτησέ μου θέση στη λίστα'}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
