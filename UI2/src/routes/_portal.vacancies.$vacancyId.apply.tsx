import { createFileRoute, Link } from "@tanstack/react-router";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  getVacancy,
  type VacancyItem,
} from "@/services/vacancyService";
import { submitJobApplication } from "@/services/jobApplicationService";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute(
  "/_portal/vacancies/$vacancyId/apply",
)({
  head: () => ({
    meta: [
      {
        title: "Apply for Vacancy - Afar UDCB",
      },
      {
        name: "description",
        content:
          "Submit your application for an Afar UDCB employment opportunity.",
      },
    ],
  }),
  component: VacancyApplicationPage,
});

function formatDate(value: string | null) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function VacancyApplicationPage() {
  const { vacancyId } = Route.useParams();

  const [vacancy, setVacancy] =
    useState<VacancyItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVacancy() {
      try {
        setLoading(true);
        setError(null);

        const data = await getVacancy(vacancyId);

        if (!cancelled) {
          setVacancy(data);
        }
      } catch (err) {
        console.error(
          "Failed to load vacancy:",
          err,
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load vacancy.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVacancy();

    return () => {
      cancelled = true;
    };
  }, [vacancyId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (!file) {
      setError("Please upload your CV / Resume.");
      return;
    }

    setSubmitting(true);

    try {
      await submitJobApplication(vacancyId, {
        full_name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        education: education.trim(),
        experience: experience.trim(),
        resume: file,
        cover_letter: coverLetter.trim(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(
        "Failed to submit job application:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Careers"
          title="Apply for Vacancy"
          description="Preparing your application..."
        />

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex min-h-56 items-center justify-center rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading vacancy information...
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!vacancy) {
    return (
      <>
        <PageHeader
          eyebrow="Careers"
          title="Vacancy Not Found"
          description="The requested vacancy could not be found."
        />

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />

            <h2 className="mt-5 font-display text-xl font-bold">
              Vacancy unavailable
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error ||
                "This vacancy is no longer available."}
            </p>

            <Link
              to="/vacancies"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vacancies
            </Link>
          </div>
        </section>
      </>
    );
  }

  const title =
    vacancy.title?.en || "Vacancy";

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Careers"
          title="Application Submitted"
          description="Thank you for your interest in working with Afar UDCB."
        />

        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-9 w-9 text-primary" />
              </div>

              <h2 className="mt-6 font-display text-2xl font-bold sm:text-3xl">
                Thank you for applying
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                Your application information has been
                received for the position of{" "}
                <span className="font-semibold text-foreground">
                  {title}
                </span>
                .
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                The recruitment team will review your
                application and contact you if further
                information is required.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/vacancies/$vacancyId"
                  params={{
                    vacancyId: String(vacancy.id),
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  View Vacancy
                </Link>

                <Link
                  to="/vacancies"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Browse Vacancies
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Apply for Vacancy"
        description="Complete the application form below to apply for this employment opportunity."
      />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link
          to="/vacancies/$vacancyId"
          params={{
            vacancyId: String(vacancy.id),
          }}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vacancy Details
        </Link>

        {/* Position summary */}
        <div className="mb-6 rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Position Applying For
              </p>

              <h2 className="mt-1 font-display text-2xl font-bold">
                {title}
              </h2>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Deadline:{" "}
                  {formatDate(vacancy.deadline)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Application form */}
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="border-b p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">
              Applicant Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Please provide accurate information. The
              information you submit will be used for
              recruitment purposes.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </label>

                <input
                  required
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Mail className="h-4 w-4 text-primary" />
                  Email Address
                </label>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </label>

                <input
                  required
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+251 ..."
                  className="mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-primary" />
                  Address
                </label>

                <input
                  required
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Enter your current address"
                  className="mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Education */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Education
                </label>

                <textarea
                  required
                  value={education}
                  onChange={(event) =>
                    setEducation(event.target.value)
                  }
                  placeholder="Enter your educational qualifications"
                  rows={3}
                  className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Experience */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Experience
                </label>

                <textarea
                  required
                  value={experience}
                  onChange={(event) =>
                    setExperience(event.target.value)
                  }
                  placeholder="Describe your relevant work experience"
                  rows={4}
                  className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {/* CV */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-primary" />
                  CV / Resume
                </label>

                <input
                  required
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) =>
                    setFile(
                      event.target.files?.[0] || null,
                    )
                  }
                  className="mt-2 block h-12 w-full rounded-xl border bg-background px-3 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX.
                </p>

                {file && (
                  <p className="mt-2 flex items-center gap-2 text-xs font-medium text-primary">
                    <FileText className="h-4 w-4" />
                    {file.name}
                  </p>
                )}
              </div>
            </div>

            {/* Cover letter */}
            <div className="mt-7">
              <label className="text-sm font-semibold">
                Cover Letter
              </label>

              <textarea
                required
                value={coverLetter}
                onChange={(event) =>
                  setCoverLetter(event.target.value)
                }
                placeholder="Tell us why you are interested in this position and why you would be a good candidate..."
                rows={8}
                className="mt-2 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-7 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/vacancies/$vacancyId"
                params={{
                  vacancyId: String(vacancy.id),
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

