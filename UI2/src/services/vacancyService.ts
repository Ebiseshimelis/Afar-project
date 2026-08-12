export type VacancyItem = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  deadline: string;
  description: string;
  salary: string;
  filePath: string | null;
};

export async function getVacancies(): Promise<VacancyItem[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/v1/vacancies"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vacancies: ${response.status}`);
  }

  const result = await response.json();

  return result.data.map((item: any) => ({
    id: String(item.id),

    title: item.title?.en || "",

    department: item.position?.en || "",

    location: "Afar Regional State",

    type: "Full Time",

    deadline: item.deadline,

    description: item.content?.en || "",

    salary: item.salary || "",

    filePath: item.file_path || null,
  }));
}
