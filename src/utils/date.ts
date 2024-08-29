import { format, formatDistanceToNow, parseISO } from "date-fns";

export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDate = (date: Date): string => {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Extract the day and add the correct suffix
  const day = date.getDate();
  const suffix = getDaySuffix(day);

  // Extract the parts of the formatted date
  const parts = formattedDate.split(" ");
  const weekday = parts[0];
  const month = parts[1];

  return `${weekday} ${month} ${day + suffix}`.toUpperCase();
};

function getDaySuffix(day: number): string {
  if (day > 3 && day < 21) return "TH"; // Handles 11th, 12th, 13th
  switch (day % 10) {
    case 1:
      return "ST";
    case 2:
      return "ND";
    case 3:
      return "RD";
    default:
      return "TH";
  }
}

export const pureFormat = (
  dateString: string,
  formatStr: string = "yyyy-MM-dd",
): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if parsing fails
  }
};
