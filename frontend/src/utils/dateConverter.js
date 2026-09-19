import { format } from "date-fns";

export function dateConverter(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return format(date, "MMMM d, yyyy");
}
