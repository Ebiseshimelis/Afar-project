import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit, Image as ImageIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useAuth } from "@/lib/auth";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolios,
  updatePortfolio,
  type PortfolioItem,
} from "@/services/portfolioService";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio" }, { name: "robots", content: "noindex" }] }),
  component: AdminPortfolio,
});

type FormState = { title: string; order: string; content: string; image: File | null };
const emptyForm: FormState = { title: "", order: "0", content: "", image: null };

function AdminPortfolio() {
  const { can } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  async function load() {
    try {
      setLoading(true);
      setItems(await getPortfolios());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load portfolio items.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setShowForm(true); }
  function openEdit(item: PortfolioItem) {
    setEditing(item);
    setForm({ title: item.title, order: String(item.order), content: item.content, image: null });
    setShowForm(true);
  }
  function closeForm() { if (!saving) { setEditing(null); setForm(emptyForm); setShowForm(false); } }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing && !can("portfolios.update")) return;
    if (!editing && !can("portfolios.create")) return;
    if (!editing && !form.image) { toast.error("Please choose an image."); return; }
    const order = Number(form.order);
    if (!Number.isInteger(order) || order < 0) { toast.error("Order must be a whole number of zero or more."); return; }
    try {
      setSaving(true);
      const payload = { title: form.title, order, content: form.content, image: form.image };
      if (editing) await updatePortfolio(editing.id, payload); else await createPortfolio(payload);
      toast.success(editing ? "Portfolio item updated." : "Portfolio item created.");
      closeForm();
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save portfolio item.");
    } finally { setSaving(false); }
  }

  async function remove(item: PortfolioItem) {
    if (!window.confirm(`Delete ΓÇ£${item.title}ΓÇ¥?`)) return;
    try {
      setDeletingId(item.id);
      await deletePortfolio(item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      toast.success("Portfolio item deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete portfolio item.");
    } finally { setDeletingId(null); }
  }

  return (
    <AdminLayout>
      <AdminPageHeader title="Portfolio" description="Manage the project and milestone items shown on the public home page." action={
        can("portfolios.create") ? (<button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> Add Portfolio</button>) : undefined
      } />

      {showForm && <div className="mb-8 rounded-xl border bg-card p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-semibold">{editing ? "Edit Portfolio" : "Add Portfolio"}</h2><p className="mt-1 text-sm text-muted-foreground">Set the title, order, image, and content.</p></div><button type="button" onClick={closeForm} disabled={saving} className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><X className="h-4 w-4" /></button></div>
        <form onSubmit={(event) => void submit(event)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-[1fr_180px]"><Field label="Title"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm" /></Field><Field label="Order"><input required min="0" step="1" type="number" value={form.order} onChange={(event) => setForm({ ...form, order: event.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm" /></Field></div>
          <Field label="Content"><textarea required rows={5} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm" /></Field>
          <Field label={editing ? "Replace Image (optional)" : "Image"}><div className="rounded-lg border border-dashed p-4"><label className="flex cursor-pointer items-center gap-2 text-sm font-medium"><Upload className="h-4 w-4" /> {form.image?.name || "Choose image"}<input required={!editing} type="file" accept="image/*" className="hidden" onChange={(event) => setForm({ ...form, image: event.target.files?.[0] ?? null })} /></label></div></Field>
          <div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={closeForm} disabled={saving} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Update" : "Create"}</button></div>
        </form>
      </div>}

      {loading ? <div className="rounded-xl border bg-card p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /><p className="mt-3 text-sm text-muted-foreground">Loading portfolio...</p></div> : items.length === 0 ? <div className="rounded-xl border bg-card p-10 text-center"><ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" /><h3 className="mt-4 text-lg font-semibold">No portfolio items yet</h3><p className="mt-2 text-sm text-muted-foreground">Add the first portfolio item to show it on the home page.</p></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border bg-card shadow-soft"><div className="aspect-[4/3] bg-secondary">{item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><ImageIcon className="h-10 w-10 text-muted-foreground" /></div>}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><span className="text-xs font-medium text-muted-foreground">Order {item.order}</span><h3 className="mt-1 font-semibold">{item.title}</h3></div><div className="flex gap-1">{can("portfolios.update") && (<button type="button" onClick={() => openEdit(item)} className="rounded p-2 hover:bg-secondary" aria-label={`Edit ${item.title}`}><Edit className="h-4 w-4" /></button>)}{can("portfolios.delete") && (<button type="button" onClick={() => void remove(item)} disabled={deletingId === item.id} className="rounded p-2 text-destructive hover:bg-destructive/10" aria-label={`Delete ${item.title}`}>{deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>)}</div></div><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.content}</p></div></article>)}</div>}
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>; }









