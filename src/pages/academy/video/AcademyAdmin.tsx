// @ts-nocheck
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { DELIVERY_LANGUAGES, type VideoCourse } from '@/lib/videoCourses';
import { Helmet } from 'react-helmet-async';

const EMPTY = { slug: '', title: '', description: '', language_code: 'el', price_eur: 0, status: 'hidden', cover_image: '', display_order: 0 };
const selectCls = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

export default function AcademyAdmin() {
  const { user, loading, isAdmin } = useAuth();
  const [courses, setCourses] = useState<VideoCourse[]>([]);
  const [edit, setEdit] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);

  async function load() {
    const [c, u, p] = await Promise.all([
      supabase.from('video_courses').select('*').order('display_order'),
      supabase.from('learner_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('video_course_purchases').select('*,video_courses(title)').order('created_at', { ascending: false }),
    ]);
    setCourses(c.data || []); setUsers(u.data || []); setPurchases(p.data || []);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);
  useEffect(() => { if (!loading) { const id = setTimeout(() => setChecked(true), 800); return () => clearTimeout(id); } }, [loading]);

  if (loading || (!isAdmin && !checked)) return null;
  if (!user || !isAdmin) return <Navigate to="/academy/account" replace />;

  async function save(e) {
    e.preventDefault();
    const row = { ...edit, price_eur: Number(edit.price_eur) || 0, display_order: Number(edit.display_order) || 0, cover_image: edit.cover_image || null };
    const { error } = row.id ? await supabase.from('video_courses').update(row).eq('id', row.id) : await supabase.from('video_courses').insert(row);
    if (error) { toast({ title: error.message, variant: 'destructive' }); return; }
    setEdit(null); load();
  }

  async function setPurchaseStatus(id, status) {
    const { error } = await supabase.from('video_course_purchases').update({ status }).eq('id', id);
    if (error) toast({ title: error.message, variant: 'destructive' }); else load();
  }

  const emailOf = (uid) => users.find((u) => u.user_id === uid)?.email || uid;

  return (
    <>
      <Helmet><title>Academy Admin</title><meta name="robots" content="noindex" /></Helmet>
      <Header />
      <main className="min-h-screen bg-background px-4 pb-20 pt-36">
        <div className="container mx-auto max-w-6xl space-y-10">
          <section>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Video Lessons: μαθήματα</h1>
              <Button onClick={() => setEdit({ ...EMPTY })}>Νέο μάθημα</Button>
            </div>
            {edit && (
              <Card className="mt-6 p-6">
                <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Τίτλος</Label><Input required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></div>
                  <div><Label>Slug</Label><Input required pattern="[a-z0-9-]+" value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Περιγραφή</Label><Textarea value={edit.description || ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
                  <div><Label>Γλώσσα παράδοσης</Label>
                    <select className={selectCls} value={edit.language_code} onChange={(e) => setEdit({ ...edit, language_code: e.target.value })}>
                      {Object.entries(DELIVERY_LANGUAGES).map(([k, v]) => <option key={k} value={k}>{v.flag} {v.el}</option>)}
                    </select>
                  </div>
                  <div><Label>Κατάσταση</Label>
                    <select className={selectCls} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                      <option value="live">Διαθέσιμο</option><option value="coming_soon">Σύντομα</option><option value="hidden">Κρυφό</option>
                    </select>
                  </div>
                  <div><Label>Τιμή (€)</Label><Input type="number" min="0" step="0.01" value={edit.price_eur} onChange={(e) => setEdit({ ...edit, price_eur: e.target.value })} /></div>
                  <div><Label>Σειρά</Label><Input type="number" value={edit.display_order} onChange={(e) => setEdit({ ...edit, display_order: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Εικόνα (URL)</Label><Input value={edit.cover_image || ''} onChange={(e) => setEdit({ ...edit, cover_image: e.target.value })} /></div>
                  <div className="flex gap-2 sm:col-span-2"><Button type="submit">Αποθήκευση</Button><Button type="button" variant="ghost" onClick={() => setEdit(null)}>Ακύρωση</Button></div>
                </form>
              </Card>
            )}
            <Card className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-muted-foreground"><tr><th className="p-3">Τίτλος</th><th className="p-3">Γλώσσα</th><th className="p-3">Τιμή</th><th className="p-3">Κατάσταση</th><th className="p-3" /></tr></thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-b border-border/50">
                      <td className="p-3">{c.title}</td>
                      <td className="p-3">{DELIVERY_LANGUAGES[c.language_code]?.flag} {DELIVERY_LANGUAGES[c.language_code]?.el}</td>
                      <td className="p-3">{Number(c.price_eur).toFixed(2)} €</td>
                      <td className="p-3">{{ live: 'Διαθέσιμο', coming_soon: 'Σύντομα', hidden: 'Κρυφό' }[c.status]}</td>
                      <td className="p-3 text-right"><Button size="sm" variant="outline" onClick={() => setEdit({ ...c })}>Επεξεργασία</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Αιτήματα αγοράς</h2>
            <Card className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-muted-foreground"><tr><th className="p-3">Χρήστης</th><th className="p-3">Μάθημα</th><th className="p-3">Ποσό</th><th className="p-3">Κατάσταση</th><th className="p-3">Ημερομηνία</th></tr></thead>
                <tbody>
                  {purchases.map((x) => (
                    <tr key={x.id} className="border-b border-border/50">
                      <td className="p-3">{emailOf(x.user_id)}</td>
                      <td className="p-3">{x.video_courses?.title}</td>
                      <td className="p-3">{Number(x.amount_eur).toFixed(2)} €</td>
                      <td className="p-3">
                        <select className={selectCls} value={x.status} onChange={(e) => setPurchaseStatus(x.id, e.target.value)}>
                          <option value="pending">Σε αναμονή</option><option value="paid">Πληρωμένο</option><option value="cancelled">Ακυρωμένο</option>
                        </select>
                      </td>
                      <td className="p-3">{new Date(x.created_at).toLocaleDateString('el-GR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Εγγεγραμμένοι χρήστες ({users.length})</h2>
            <Card className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-muted-foreground"><tr><th className="p-3">Email</th><th className="p-3">Ονομα</th><th className="p-3">Τηλέφωνο</th><th className="p-3">Εταιρεία</th><th className="p-3">ΑΦΜ</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.user_id} className="border-b border-border/50">
                      <td className="p-3">{u.email}</td><td className="p-3">{u.full_name}</td><td className="p-3">{u.phone}</td><td className="p-3">{u.company}</td><td className="p-3">{u.vat_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
