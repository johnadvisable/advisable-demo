// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { Helmet } from 'react-helmet-async';

const C = {
  el: { signin: 'Σύνδεση', signup: 'Εγγραφή', forgot: 'Ξέχασες τον κωδικό;', name: 'Ονοματεπώνυμο', email: 'Email', pass: 'Κωδικός', google: 'Συνέχεια με Google', or: 'ή', toSignup: 'Δεν έχεις λογαριασμό; Εγγραφή', toSignin: 'Εχεις ήδη λογαριασμό; Σύνδεση', check: 'Σου στείλαμε email επιβεβαίωσης. Ανοιξέ το για να ενεργοποιήσεις τον λογαριασμό σου.', resetSent: 'Σου στείλαμε email για να ορίσεις νέο κωδικό.', send: 'Αποστολή', back: 'Πίσω στη σύνδεση' },
  en: { signin: 'Sign in', signup: 'Sign up', forgot: 'Forgot your password?', name: 'Full name', email: 'Email', pass: 'Password', google: 'Continue with Google', or: 'or', toSignup: "No account? Sign up", toSignin: 'Already have an account? Sign in', check: 'We sent you a confirmation email. Open it to activate your account.', resetSent: 'We sent you an email to set a new password.', send: 'Send', back: 'Back to sign in' },
};

export default function AccountLogin() {
  const { currentLanguage } = useLanguage();
  const t = currentLanguage === 'el' ? C.el : C.en;
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const accountUrl = buildNavigationUrl('/academy/account', currentLanguage);

  useEffect(() => { if (user) nav(accountUrl, { replace: true }); }, [user]);

  async function submit(e) {
    e.preventDefault(); setErr(null); setMsg(null); setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password: pass, options: { emailRedirectTo: window.location.origin + accountUrl, data: { full_name: name } } });
        if (error) throw error;
        setMsg(t.check);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMsg(t.resetSent);
      }
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  async function google() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + accountUrl } });
  }

  return (
    <>
      <Helmet><title>{mode === 'signup' ? t.signup : t.signin} | Advisable Academy</title><meta name="robots" content="noindex" /></Helmet>
      <Header />
      <main className="min-h-screen bg-background px-4 pb-20 pt-36">
        <Card className="mx-auto max-w-md p-8">
          <h1 className="text-2xl font-bold">{mode === 'signup' ? t.signup : mode === 'forgot' ? t.forgot : t.signin}</h1>
          {mode !== 'forgot' && (
            <>
              <Button type="button" variant="outline" className="mt-6 w-full" onClick={google}>{t.google}</Button>
              <p className="my-4 text-center text-xs text-muted-foreground">{t.or}</p>
            </>
          )}
          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div><Label htmlFor="n">{t.name}</Label><Input id="n" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} /></div>
            )}
            <div><Label htmlFor="e">{t.email}</Label><Input id="e" type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            {mode !== 'forgot' && (
              <div><Label htmlFor="p">{t.pass}</Label><Input id="p" type="password" required minLength={8} value={pass} onChange={(e) => setPass(e.target.value)} /></div>
            )}
            {err && <p className="text-sm text-destructive">{err}</p>}
            {msg && <p className="text-sm text-primary">{msg}</p>}
            <Button type="submit" className="w-full" disabled={busy}>{mode === 'signup' ? t.signup : mode === 'forgot' ? t.send : t.signin}</Button>
          </form>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            {mode === 'signin' && <button className="text-left underline underline-offset-2" onClick={() => setMode('forgot')}>{t.forgot}</button>}
            {mode === 'signin' && <button className="text-left underline underline-offset-2" onClick={() => setMode('signup')}>{t.toSignup}</button>}
            {mode !== 'signin' && <button className="text-left underline underline-offset-2" onClick={() => setMode('signin')}>{mode === 'forgot' ? t.back : t.toSignin}</button>}
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
