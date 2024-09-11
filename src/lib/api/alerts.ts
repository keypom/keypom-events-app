import eventHelperInstance from "../event";

export interface Alert {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  href: string;
  linkTitle: string;
}

export const fetchAlerts: () => Promise<Alert[]> = async () => {
  const [stringifiedAlerts] = await eventHelperInstance.viewCall({
    methodName: "get_alerts",
    args: {},
  });
  const alerts = JSON.parse(stringifiedAlerts);

  console.log("Alerts before sorting: ", alerts);

  // Sort alerts by Time (ISO string) in descending order (most recent first)
  alerts.sort((a, b) => {
    const dateA = new Date(a.Time).getTime();
    const dateB = new Date(b.Time).getTime();

    // Handle cases where Time might be missing or invalid
    if (isNaN(dateA)) return 1; // Treat missing or invalid dates as the oldest
    if (isNaN(dateB)) return -1;

    return dateB - dateA; // Sort in descending order
  });

  // Map the alerts to the new Alert interface
  const mappedAlerts: Alert[] = alerts.map((alert, index) => ({
    id: index + 1, // Generating a unique ID based on the index
    title: alert.Title || "No Title", // Fallback if the title is missing
    description: alert.Description || "No description available",
    creationDate: alert.Time || new Date().toISOString(), // Fallback to current date if missing
    href: alert["Redirects To"] || "", // Mapping 'Redirects To' to href, with a fallback
    linkTitle: alert["Custom Link Title"] || "", // Mapping 'Custom Link Title' to linkTitle
  }));

  return mappedAlerts;
};
