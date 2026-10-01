// @ts-nocheck
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
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
import { toast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const FIELDS = [
  ['full_name', 'Ονοματεπώνυμο', 'Full name'],
  ['phone', 'Τηλέφωνο', 'Phone'],
  ['company', 'Εταιρεία', 'Company'],
  ['job_title', 'Θέση', 'Job title'],
];
const BILLING = [
  ['billing_company', 'Επωνυμία τιμολόγησης', 'Invoice company name'],
  ['vat_number', 'ΑΦΜ', 'VAT number'],
  ['tax_office', 'ΔΟΥ', 'Tax office'],
  ['billing_address', 'Διεύθυνση', 'Address'],
  ['billing_city', 'Πόλη', 'City'],
  ['billing_postcode', 'ΤΚ', 'Postcode'],
];

export default function Account() {
  const { currentLanguage } = useLanguage();
  const el = currentLanguage === 'el';
  const { user, loading, isAdmin, signOut } = useAuth();
  const [p, setP] = useState<Record<string, string>>({});
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('learner_profiles').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => setP(data || {}));
    supabase.from('video_course_purchases').select('id,status,amount_eur,created_at,video_courses(title)').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setPurchases(data || []));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to={buildNavigationUrl('/academy/account/login', currentLanguage)} replace />;

  async function save(e) {
    e.preventDefault();
    const row: any = { user_id: user.id, email: user.email };
    [...FIELDS, ...BILLING].forEach(([k]) => { row[k] = (p[k] || '').toString().trim().slice(0, 200) || null; });
    const { error } = await supabase.from('learner_profiles').upsert(row);
    toast({ title: error ? error.message : el ? 'Τα στοιχεία αποθηκεύτηκαν' : 'Details saved', variant: error ? 'destructive' : 'default' });
  }

  const statusLabel = (s) => ({ pending: el ? 'Σε αναμονή πληρωμής' : 'Awaiting payment', paid: el ? 'Ενεργό' : 'Active', cancelled: el ? 'Ακυρώθηκε' : 'Cancelled' }[s] || s);
  const field = ([k, gr, en]) => (
    <div key={k}><Label htmlFor={k}>{el ? gr : en}</Label><Input id={k} maxLength={200} value={p[k] || ''} onChange={(e) => setP({ ...p, [k]: e.target.value })} /></div>
  );

  return (
    <>
      <Helmet><title>{el ? 'Ο λογαριασμός μου' : 'My account'} | Advisable Academy</title><meta name="robots" content="noindex" /></Helmet>
      <Header />
      <main className="min-h-screen bg-background px-4 pb-20 pt-36">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{el ? 'Ο λογαριασμός μου' : 'My account'}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && <Button asChild variant="outline"><Link to={buildNavigationUrl('/academy/admin', currentLanguage)}>Admin</Link></Button>}
              <Button asChild variant="outline"><Link to={buildNavigationUrl('/academy/video-lessons', currentLanguage)}>Video Lessons</Link></Button>
              <Button variant="ghost" onClick={signOut}>{el ? 'Αποσύνδεση' : 'Sign out'}</Button>
            </div>
          </div>

          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold">{el ? 'Τα μαθήματά μου' : 'My lessons'}</h2>
            {purchases.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">{el ? 'Δεν έχεις αγοράσει ακόμη μαθήματα.' : 'You have not bought any lessons yet.'}</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {purchases.map((x) => (
                  <li key={x.id} className="flex justify-between py-3 text-sm">
                    <span>{x.video_courses?.title}</span>
                    <span className="text-muted-foreground">{statusLabel(x.status)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <form onSubmit={save}>
            <Card className="mt-6 p-6">
              <h2 className="text-xl font-semibold">{el ? 'Στοιχεία' : 'Details'}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">{FIELDS.map(field)}</div>
              <h2 className="mt-8 text-xl font-semibold">{el ? 'Στοιχεία τιμολόγησης' : 'Invoicing details'}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">{BILLING.map(field)}</div>
              <Button type="submit" className="mt-6">{el ? 'Αποθήκευση' : 'Save'}</Button>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
