export interface Alert {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  href: string;
  linkTitle: string;
}

export const fetchAlerts: () => Promise<Alert[]> = async () => {
  const response = await fetch("https://example.com/alerts");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const alerts: Alert[] = await response.json();

  // Sort alerts by creationDate in descending order
  alerts.sort(
    (a, b) =>
      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
  );

  return alerts;
  return response.json();
};

export const fetchMostRecentAlert: () => Promise<Alert | null> = async () => {
  try {
    const alerts = await fetchAlerts();
    return alerts[0] || null; // Return the most recent alert or null if no alerts
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return null; // Return null if there's an error
  }
};
