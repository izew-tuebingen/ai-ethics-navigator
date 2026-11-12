const STORAGE_PREFIX = "vcio_recommendations_";

function getStorageKey(valueId: string, frameworkId?: string | null): string {
  const frameworkSuffix = frameworkId ? `_${frameworkId}` : "";
  return `${STORAGE_PREFIX}${valueId}${frameworkSuffix}`;
}

export function saveRecommendations(
  valueId: string,
  recommendations: Record<string, string>,
  frameworkId?: string | null,
): void {
  try {
    const key = getStorageKey(valueId, frameworkId);
    if (Object.keys(recommendations).length === 0) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(recommendations));
  } catch (error) {
    console.error("Failed to save recommendations to localStorage:", error);
  }
}

export function loadRecommendations(
  valueId: string,
  frameworkId?: string | null,
): Record<string, string> {
  try {
    const key = getStorageKey(valueId, frameworkId);
    const data = localStorage.getItem(key);
    if (!data) return {};
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load recommendations from localStorage:", error);
    return {};
  }
}
