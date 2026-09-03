import { getToken } from "@/services/authService";

export type JobApplicationStatus =
  | "submitted"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export type JobApplicationVacancy = {
  id: number;
  title: {
    en?: string;
    am?: string;
  };
  deadline: string | null;
  status: "draft" | "published";
};

export type JobApplicationItem = {
  id: number;
  vacancy_id: number;

  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  education: string | null;
  experience: string | null;

  resume_path: string | null;
  cover_letter: string | null;

  status: JobApplicationStatus;
  submitted_at: string | null;

  created_at?: string;
  updated_at?: string;

  vacancy?: JobApplicationVacancy;
};

type PaginatedApplications = {
  current_page: number;
  data: JobApplicationItem[];
  last_page: number;
  per_page: number;
  total: number;
};

const API_BASE_URL = "http://127.0.0.1:8001/api/v1";

function getAuthHeaders(): HeadersInit {
  const token = getToken();

  return {
    Accept: "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

async function parseResponse(response: Response) {
  const text = await response.text();

  console.log(
    "========== JOB APPLICATION API RESPONSE ==========",
  );
  console.log("Status:", response.status);
  console.log("Response:", text);
  console.log(
    "===================================================",
  );

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    let message =
      data?.message ||
      data?.error ||
      text ||
      `API request failed: ${response.status}`;

    if (data?.errors) {
      const errors = Object.values(data.errors)
        .flat()
        .join(" ");

      if (errors) {
        message = errors;
      }
    }

    throw new Error(
      `${message} (HTTP ${response.status})`,
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Public Job Application Submission
|--------------------------------------------------------------------------
|
| Sends the applicant information and CV/resume to:
|
| POST /api/v1/vacancies/{vacancy}/applications
|
| FormData is used because the request contains a file upload.
|
*/

export async function submitJobApplication(
  vacancyId: string | number,
  data: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    education?: string;
    experience?: string;
    resume: File;
    cover_letter?: string;
  },
): Promise<{
  id: number;
  vacancy_id: number;
  status: JobApplicationStatus;
  submitted_at: string | null;
}> {
  const formData = new FormData();

  formData.append("full_name", data.full_name);
  formData.append("email", data.email);

  if (data.phone?.trim()) {
    formData.append("phone", data.phone.trim());
  }

  if (data.address?.trim()) {
    formData.append("address", data.address.trim());
  }

  if (data.education?.trim()) {
    formData.append("education", data.education.trim());
  }

  if (data.experience?.trim()) {
    formData.append("experience", data.experience.trim());
  }

  if (data.cover_letter?.trim()) {
    formData.append(
      "cover_letter",
      data.cover_letter.trim(),
    );
  }

  formData.append("resume", data.resume);

  const response = await fetch(
    `${API_BASE_URL}/vacancies/${vacancyId}/applications`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
      },

      body: formData,
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid application submission response.",
    );
  }

  return result.data;
}

/*
|--------------------------------------------------------------------------
| Admin Job Applications
|--------------------------------------------------------------------------
*/

export async function getJobApplications(params?: {
  vacancyId?: number;
  status?: JobApplicationStatus;
  email?: string;
  page?: number;
  perPage?: number;
}): Promise<PaginatedApplications> {
  const searchParams = new URLSearchParams();

  if (params?.vacancyId) {
    searchParams.set(
      "vacancy_id",
      String(params.vacancyId),
    );
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.email?.trim()) {
    searchParams.set(
      "email",
      params.email.trim(),
    );
  }

  if (params?.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params?.perPage) {
    searchParams.set(
      "per_page",
      String(params.perPage),
    );
  }

  const query = searchParams.toString();

  const response = await fetch(
    `${API_BASE_URL}/job-applications${
      query ? `?${query}` : ""
    }`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const result = await parseResponse(response);

  return {
    current_page: result?.current_page ?? 1,
    data: Array.isArray(result?.data)
      ? result.data
      : [],
    last_page: result?.last_page ?? 1,
    per_page: result?.per_page ?? 20,
    total: result?.total ?? 0,
  };
}

export async function getJobApplication(
  id: string | number,
): Promise<JobApplicationItem> {
  const response = await fetch(
    `${API_BASE_URL}/job-applications/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid job application response.",
    );
  }

  return result.data;
}

export async function updateJobApplicationStatus(
  id: string | number,
  status: JobApplicationStatus,
): Promise<JobApplicationItem> {
  const response = await fetch(
    `${API_BASE_URL}/job-applications/${id}`,
    {
      method: "PUT",

      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid update application response.",
    );
  }

  return result.data;
}

export async function deleteJobApplication(
  id: string | number,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/job-applications/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  await parseResponse(response);

  return true;
}

export function getResumeUrl(
  resumePath: string | null,
): string | null {
  if (!resumePath) {
    return null;
  }

  if (resumePath.startsWith("http://")) {
    return resumePath;
  }

  if (resumePath.startsWith("https://")) {
    return resumePath;
  }

  return `http://127.0.0.1:8001/storage/${resumePath}`;
}
