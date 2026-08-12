import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_portal/contact")({
  head: () => ({ meta: [
    { title: "Contact — Afar UDCB" },
    { name: "description", content: "Get in touch with the Afar Regional State Urban Development and Construction Bureau." },
  ]}),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent — we'll get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 900);
  }

  return (
    <>
      <PageHeader eyebrow="Get in touch" title="Contact Us" description="Reach directorates and city administrations, or send us a message." />
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={onSubmit} className="rounded-xl border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-bold">Send a message</h2>
          <p className="text-sm text-muted-foreground">We aim to respond within 3 working days.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <div className="md:col-span-2"><Field label="Subject" name="subject" required /></div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Message</label>
              <textarea name="message" rows={6} required className="mt-1 w-full rounded-lg border bg-background p-3 text-sm outline-none ring-ring focus:ring-2" />
            </div>
          </div>
          <button disabled={sending} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {sending ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
          </button>
        </form>

        <aside className="space-y-4">
          <InfoCard icon={<Phone className="h-5 w-5" />} title="Phone" lines={["033-666-0577", "033-666-0576"]} />
          <InfoCard icon={<Mail className="h-5 w-5" />} title="Email" lines={["info@afarudcb.gov.et"]} />
          <InfoCard icon={<MapPin className="h-5 w-5" />} title="Address" lines={["Bureau HQ", "Semera, Afar Regional State", "Ethiopia"]} />
        </aside>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input name={name} type={type} required={required} className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2" />
    </div>
  );
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground">{icon}</div>
        <div className="font-display font-semibold">{title}</div>
      </div>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {lines.map((l) => <div key={l}>{l}</div>)}
      </div>
    </div>
  );
}
