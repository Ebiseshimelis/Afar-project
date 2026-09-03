export type Category = {
  id: number;
  type: string;
  name: {
    en: string;
    am: string;
  };
  slug: string;
};

const CATEGORY_API_URL =
  "http://127.0.0.1:8001/api/v1/categories";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(CATEGORY_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories: ${response.status} ${text}`
    );
  }

  let result: any;

  try {
    result = JSON.parse(text);
  } catch {
    console.error("Categories returned invalid JSON:", text);
    throw new Error("Categories API returned invalid JSON");
  }

  console.log("Categories API response:", result);

  /*
   * Your backend currently returns:
   *
   * {
   *   value: [...],
   *   Count: 15
   * }
   *
   * Support that response.
   */
  if (Array.isArray(result?.value)) {
    return result.value;
  }

  /*
   * Also support Laravel's normal:
   *
   * {
   *   data: [...]
   * }
   */
  if (Array.isArray(result?.data)) {
    return result.data;
  }

  /*
   * And support a direct array just in case.
   */
  if (Array.isArray(result)) {
    return result;
  }

  console.error(
    "Unexpected categories API response:",
    result
  );

  throw new Error("Invalid categories API response");
}
