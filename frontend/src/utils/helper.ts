export function formatDate(dateNum: Date | null): string | null {
  const dateString = dateNum !== null ? dateNum.toString() : null;
  if (dateString === null) return null;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
