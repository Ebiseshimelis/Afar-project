import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  Target,
  Eye,
  Award,
  Building2,
  Users,
  ShieldCheck,
} from "lucide-react";
import { getAbout } from "@/services/aboutService";

export const Route = createFileRoute("/_portal/about")({
  head: () => ({
    meta: [
      { title: "About — Afar UDCB" },
      {
        name: "description",
        content:
          "About the Afar Regional State Urban Development and Construction Bureau.",
      },
    ],
  }),
  loader: async () => {
    return await getAbout();
  },
  component: AboutPage,
});

function AboutPage() {
  const about = Route.useLoaderData();

  const cards = [
    {
      icon: Target,
      title: "Our Mission",
      body: about.mission,
    },
    {
      icon: Eye,
      title: "Our Vision",
      body: about.vision,
    },
    {
      icon: Award,
      title: "Our Values",
      body: about.values,
    },
  ];

  const serviceIcons = [Building2, Users, ShieldCheck];

  return (
    <>
      <PageHeader
        eyebrow="About the Bureau"
        title="Serving Afar's urban future"
        description={about.description}
      />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border bg-card p-6 shadow-soft"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <card.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">
              What we do
            </h2>

            <p className="mt-3 leading-relaxed text-muted-foreground">
              {about.description}
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              {about.services.map((service, index) => {
                const Icon = serviceIcons[index] ?? Building2;

                return (
                  <li
                    key={service}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {service}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border shadow-soft">
            {about.image ? (
              <img
                src={about.image}
                alt="Afar UDCB"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[300px] items-center justify-center bg-secondary text-muted-foreground">
                Afar UDCB
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}