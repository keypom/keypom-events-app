import eventHelperInstance from "@/lib/event";
import {
  format,
  formatDistanceToNow,
  parseISO,
  formatDistanceToNowStrict,
} from "date-fns";

export const timeAgo = (dateString: string, shortForm = false): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: !shortForm });
};

// Short form of time ago including seconds
export const timeAgoShort = (date: Date): string => {
  const now = Date.now();
  const diffMs = now - date.getTime(); // Difference in milliseconds
  const diffSeconds = Math.floor(diffMs / 1000); // Difference in seconds

  // Handle cases where the time difference is less than 60 seconds
  if (diffSeconds < 5) {
    return "just now"; // For 0 to 4 seconds
  }
  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`; // Display seconds for 5 to 59 seconds
  }

  // Use date-fns to calculate longer distances (e.g., minutes, hours, etc.)
  const distance = formatDistanceToNowStrict(date, { addSuffix: true });

  // Remove any extra spaces between the number and the unit
  return distance
    .replace(/\sminutes?/, "m")
    .replace(/\shours?/, "h")
    .replace(/\sdays?/, "d")
    .replace(/\sweeks?/, "w")
    .replace(/\smonths?/, "mo")
    .replace(/\syears?/, "y")
    .replace("about ", "~")
    .replace("almost ", "~")
    .replace("over ", ">")
    .replace(/\sago/, " ago"); // Ensure no extra space before "ago"
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
    eventHelperInstance.debugLog(`Error formatting date: ${error}`, "error");
    return dateString; // Return original string if parsing fails
  }
};
