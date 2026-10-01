// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';

export default function ResetPassword() {
  const { currentLanguage } = useLanguage();
  const el = currentLanguage === 'el';
  const nav = useNavigate();
  const [pass, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const isRecovery = typeof window !== 'undefined' && window.location.hash.includes('type=recovery');

  async function submit(e) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pass });
    if (error) { setErr(error.message); return; }
    nav(buildNavigationUrl('/academy/account', currentLanguage));
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-4 pb-20 pt-36">
        <Card className="mx-auto max-w-md p-8">
          <h1 className="text-2xl font-bold">{el ? 'Νέος κωδικός' : 'New password'}</h1>
          {!isRecovery && <p className="mt-2 text-sm text-muted-foreground">{el ? 'Ανοιξε αυτή τη σελίδα από το email επαναφοράς.' : 'Open this page from the reset email.'}</p>}
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label htmlFor="p">{el ? 'Κωδικός' : 'Password'}</Label><Input id="p" type="password" minLength={8} required value={pass} onChange={(e) => setPass(e.target.value)} /></div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full">{el ? 'Αποθήκευση' : 'Save'}</Button>
          </form>
        </Card>
      </main>
      <Footer />
    </>
  );
}
