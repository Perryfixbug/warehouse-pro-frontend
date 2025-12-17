export function dateToLocaleString(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
}
