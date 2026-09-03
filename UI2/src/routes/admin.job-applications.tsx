import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  Search,
  Eye,
  Trash2,
  X,
  Loader2,
  FileText,
  Download,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  getJobApplications,
  getJobApplication,
  updateJobApplicationStatus,
  deleteJobApplication,
  getResumeUrl,
  type JobApplicationItem,
  type JobApplicationStatus,
} from "@/services/jobApplicationService";

export const Route = createFileRoute(
  "/admin/job-applications"
)({
  head: () => ({
    meta: [
      { title: "Job Applications" },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),
  component: JobApplicationsAdmin,
});

const STATUS_OPTIONS: JobApplicationStatus[] = [
  "submitted",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];

function statusLabel(
  status: JobApplicationStatus
) {
  switch (status) {
    case "submitted":
      return "Submitted";

    case "reviewing":
      return "Reviewing";

    case "shortlisted":
      return "Shortlisted";

    case "rejected":
      return "Rejected";

    case "hired":
      return "Hired";

    default:
      return status;
  }
}

function statusClass(
  status: JobApplicationStatus
) {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-700";

    case "reviewing":
      return "bg-yellow-100 text-yellow-700";

    case "shortlisted":
      return "bg-purple-100 text-purple-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "hired":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getVacancyTitle(
  application: JobApplicationItem
) {
  return (
    application.vacancy?.title?.en ||
    application.vacancy?.title?.am ||
    `Vacancy #${application.vacancy_id}`
  );
}

function JobApplicationsAdmin() {
  const { can } = useAuth();
  const [applications, setApplications] =
    useState<JobApplicationItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<JobApplicationStatus | "">("");

  const [selectedApplication, setSelectedApplication] =
    useState<JobApplicationItem | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getJobApplications({
          status: statusFilter || undefined,
          email: search || undefined,
          perPage: 100,
        });

      setApplications(result.data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load job applications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  async function handleSearch(
    event: React.FormEvent
  ) {
    event.preventDefault();
    await loadApplications();
  }

  async function openDetails(
    application: JobApplicationItem
  ) {
    try {
      setDetailsLoading(true);
      setError("");

      const fullApplication =
        await getJobApplication(
          application.id
        );

      setSelectedApplication(
        fullApplication
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load application details."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleStatusChange(
    id: number,
    status: JobApplicationStatus
  ) {
    try {
      setUpdatingId(id);
      setError("");

      const updated =
        await updateJobApplicationStatus(
          id,
          status
        );

      setApplications((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updated,
              }
            : item
        )
      );

      if (
        selectedApplication?.id === id
      ) {
        setSelectedApplication(
          updated
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(
    application: JobApplicationItem
  ) {
    const confirmed =
      window.confirm(
        `Delete the application from ${application.full_name}? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(application.id);
      setError("");

      await deleteJobApplication(
        application.id
      );

      setApplications((current) =>
        current.filter(
          (item) =>
            item.id !== application.id
        )
      );

      if (
        selectedApplication?.id ===
        application.id
      ) {
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete application."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Job Applications"
          description="Review and manage applications submitted for vacancies."
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by applicant email..."
                className="w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | JobApplicationStatus
                    | ""
                )
              }
              className="rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                All statuses
              </option>

              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {statusLabel(status)}
                  </option>
                )
              )}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Search size={17} />
              Search
            </button>
          </form>
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-gray-500">
              <Loader2
                size={24}
                className="mr-2 animate-spin"
              />
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText
                size={42}
                className="mx-auto mb-3 opacity-40"
              />

              <p className="font-medium">
                No job applications found.
              </p>

              <p className="mt-1 text-sm">
                Applications submitted through
                the public vacancy portal will
                appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="px-5 py-3">
                      Applicant
                    </th>

                    <th className="px-5 py-3">
                      Vacancy
                    </th>

                    <th className="px-5 py-3">
                      Email
                    </th>

                    <th className="px-5 py-3">
                      Phone
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3">
                      Submitted
                    </th>

                    <th className="px-5 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map(
                    (application) => (
                      <tr
                        key={
                          application.id
                        }
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">
                            {
                              application.full_name
                            }
                          </div>
                        </td>

                        <td className="max-w-[220px] px-5 py-4">
                          <div className="truncate text-sm text-gray-700">
                            {getVacancyTitle(
                              application
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {application.email}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {application.phone ||
                            "—"}
                        </td>

                        <td className="px-5 py-4">
                          {can("job_applications.update") && (
                            <select
                              value={
                                application.status
                              }
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                application.id,
                                event.target
                                  .value as JobApplicationStatus
                              )
                            }
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${statusClass(
                              application.status
                            )}`}
                          >
                            {STATUS_OPTIONS.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={
                                    status
                                  }
                                >
                                  {statusLabel(
                                    status
                                  )}
                                </option>
                              )
                            )}
                            </select>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            application.submitted_at
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {can("job_applications.view") && (
                              <button
                                type="button"
                                onClick={() =>
                                  openDetails(
                                    application
                                  )
                                }
                              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                            >
                              <Eye
                                size={16}
                              />
                              View
                              </button>
                            )}

                            {can("job_applications.delete") && (
                              <button
                                type="button"
                                disabled={
                                  deletingId ===
                                  application.id
                                }
                              onClick={() =>
                                handleDelete(
                                  application
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId ===
                              application.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                />
                              )}
                              Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detailsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-xl bg-white p-6 shadow-xl">
            <Loader2
              size={28}
              className="mx-auto animate-spin"
            />

            <p className="mt-3 text-sm text-gray-600">
              Loading application...
            </p>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Application Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Application #
                  {selectedApplication.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Applicant
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem
                    label="Full Name"
                    value={
                      selectedApplication.full_name
                    }
                  />

                  <InfoItem
                    label="Email"
                    value={
                      selectedApplication.email
                    }
                  />

                  <InfoItem
                    label="Phone"
                    value={
                      selectedApplication.phone
                    }
                  />

                  <InfoItem
                    label="Address"
                    value={
                      selectedApplication.address
                    }
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Vacancy
                </h3>

                <InfoItem
                  label="Position"
                  value={getVacancyTitle(
                    selectedApplication
                  )}
                />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Education & Experience
                </h3>

                <div className="space-y-4">
                  <InfoItem
                    label="Education"
                    value={
                      selectedApplication.education
                    }
                  />

                  <InfoItem
                    label="Experience"
                    value={
                      selectedApplication.experience
                    }
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Cover Letter
                </h3>

                <div className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
                  {selectedApplication.cover_letter ||
                    "No cover letter provided."}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Application Status
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  {can("job_applications.update") && (
                  <select
                    value={
                      selectedApplication.status
                    }
                    disabled={
                      updatingId ===
                      selectedApplication.id
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        selectedApplication.id,
                        event.target
                          .value as JobApplicationStatus
                      )
                    }
                    className={`rounded-full border-0 px-4 py-2 text-sm font-medium ${statusClass(
                      selectedApplication.status
                    )}`}
                  >
                    {STATUS_OPTIONS.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {statusLabel(status)}
                        </option>
                      )
                    )}
                  </select>
                  )}

                  <span className="text-sm text-gray-500">
                    Submitted:{" "}
                    {formatDate(
                      selectedApplication.submitted_at
                    )}
                  </span>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Resume
                </h3>

                {(() => {
                  const resumeUrl =
                    getResumeUrl(
                      selectedApplication.resume_path
                    );

                  if (!resumeUrl) {
                    return (
                      <p className="text-sm text-gray-500">
                        No resume attached.
                      </p>
                    );
                  }

                  return (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    >
                      <Download
                        size={17}
                      />
                      View / Download Resume
                    </a>
                  );
                })()}
              </section>
            </div>

            <div className="flex justify-end border-t p-5">
              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
                className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>

      <div className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
        {value || "—"}
      </div>
    </div>
  );
}







