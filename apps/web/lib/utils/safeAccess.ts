/**
 * Safely access nested properties in an object without throwing errors
 * @param obj The object to access
 * @param path The path to the property, using dot notation (e.g., 'contact.title')
 * @param fallback Default value to return if the property doesn't exist
 * @returns The property value or fallback
 */
export function safeAccess(obj: any, path: string, fallback: any = "") {
  return (
    path
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
        obj,
      ) || fallback
  );
}
