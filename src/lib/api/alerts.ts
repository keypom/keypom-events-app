import eventHelperInstance from "../event";
import { AgendaItem, fetchAgenda } from "./agendas";

export interface Alert {
  id: number;
  title: string;
  description: string;
  expiresAt?: Date;
  creationDate?: Date;
  href?: string;
  linkTitle?: string;
}

export interface AirtableAlert {
  Title: string;
  Description: string;
  "Custom Link Title": string;
  "Redirects To": string;
  "Duration (minutes)": number;
  Time: string;
}

export interface Reminder {
  id: number;
  startTime: Date; // Reminder becomes active
  endTime: Date; // Reminder expires
  eventStartTime: Date; // Event start time
  reminderName: string;
  presenter: string;
  isMultiplePresenters: boolean;
  pronoun: string;
  talkType: string;
  stage: string;
  talkTitle: string;
}

// Abstracts out the alert creation logic
const createAlertFromAirtable = (
  alertData: AirtableAlert,
  index: number,
): Alert => ({
  id: index + 1,
  title: alertData.Title || "No Title",
  description: alertData.Description || "No description available",
  creationDate: new Date(alertData.Time || Date.now()),
  href: alertData["Redirects To"] || "",
  linkTitle: alertData["Custom Link Title"] || "",
  expiresAt: new Date(
    new Date(alertData.Time || Date.now()).getTime() +
      (alertData["Duration (minutes)"] || 0) * 60 * 1000,
  ),
});

// Abstracts out the reminder to alert mapping logic
const createAlertFromReminder = (reminder: Reminder, now: Date): Alert => {
  const timeUntilEventStart = reminder.eventStartTime.getTime() - now.getTime();
  let timeMessage = "";

  // Time message for events starting soon
  if (timeUntilEventStart > 60 * 1000) {
    const minutesLeft = Math.floor(timeUntilEventStart / (60 * 1000));
    // Handle singular/plural for "minute"
    timeMessage = `starting in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}!`;
  } else if (timeUntilEventStart > 0) {
    timeMessage = "starting in less than a minute!";
  } else {
    timeMessage = "has started!";
  }

  // Format the list of presenters properly (use "and" before the last presenter)
  const presenterList = reminder.presenter.split(", ");
  let presenterText = presenterList[0];
  if (presenterList.length > 1) {
    presenterText =
      presenterList.slice(0, -1).join(", ") + " and " + presenterList.slice(-1);
  }

  const title = `${reminder.reminderName}'s ${reminder.talkType.toLowerCase()} ${timeMessage}`;
  const description = `${presenterText} ${reminder.pronoun} doing a ${reminder.talkType.toLowerCase()} on the ${reminder.stage} at ${reminder.eventStartTime.toLocaleTimeString()}. Come listen to them talk about ${reminder.talkTitle}.`;

  return {
    id: reminder.id,
    title: title,
    description: description,
    creationDate: reminder.startTime,
    href: "",
    linkTitle: "",
    expiresAt: reminder.endTime,
  };
};

// Abstract the process of sorting alerts
const sortAlertsByCreationDate = (alerts: Alert[]): Alert[] => {
  return alerts.sort(
    (a, b) => b.creationDate!.getTime() - a.creationDate!.getTime(),
  );
};

export const fetchFeaturedAlert: () => Promise<Alert | null> = async () => {
  const [stringifiedAlerts] = await eventHelperInstance.viewCall({
    methodName: "get_alerts",
    args: {},
  });
  eventHelperInstance.debugLog(
    `Stringified alerts: ${stringifiedAlerts}`,
    "log",
  );
  const alertsData = JSON.parse(stringifiedAlerts);
  eventHelperInstance.debugLog(`Alerts data: ${alertsData}`, "log");
  // Filter out any alerts in the alert data that don't adhere to the Airtable format
  const filteredAlertsData: AirtableAlert[] = alertsData.filter(
    (alert) =>
      alert.Title &&
      alert.Description &&
      alert["Duration (minutes)"] &&
      alert.Time,
  );
  eventHelperInstance.debugLog(
    `Filtered alerts data: ${filteredAlertsData}`,
    "log",
  );
  const agenda = await fetchAgenda();
  const reminders = generateReminders(agenda.events);
  eventHelperInstance.debugLog(`Reminders: ${reminders}`, "log");
  const now = new Date();

  // Create alerts from Airtable data
  const alerts = filteredAlertsData.map((alert, index) =>
    createAlertFromAirtable(alert, index),
  );
  eventHelperInstance.debugLog(`Alerts: ${alerts}`, "log");

  // Filter active alerts
  const activeAlerts = alerts.filter(
    (alert) =>
      alert.creationDate &&
      alert.creationDate <= now &&
      alert.expiresAt &&
      alert.expiresAt >= now,
  );
  eventHelperInstance.debugLog(`Active alerts: ${activeAlerts}`, "log");

  // Create alerts from active reminders
  const activeReminderAlerts = reminders
    .filter(
      (reminder) =>
        now.getTime() >= reminder.startTime.getTime() &&
        now.getTime() <= reminder.endTime.getTime(),
    )
    .map((reminder) => createAlertFromReminder(reminder, now));
  eventHelperInstance.debugLog(
    `Active reminder alerts: ${activeReminderAlerts}`,
    "log",
  );

  // Sort and decide which alert to show
  const sortedActiveAlerts = sortAlertsByCreationDate(activeAlerts);
  const sortedActiveReminderAlerts =
    sortAlertsByCreationDate(activeReminderAlerts);
  eventHelperInstance.debugLog(
    `Sorted active alerts: ${sortedActiveAlerts}`,
    "log",
  );

  if (sortedActiveAlerts.length > 0) {
    return sortedActiveAlerts[0];
  } else if (sortedActiveReminderAlerts.length > 0) {
    return sortedActiveReminderAlerts[0];
  } else {
    return null;
  }
};

export const fetchAlerts: () => Promise<Alert[]> = async () => {
  const now = new Date();
  const [stringifiedAlerts] = await eventHelperInstance.viewCall({
    methodName: "get_alerts",
    args: {},
  });
  const alertsData = JSON.parse(stringifiedAlerts);
  // Filter out any alerts in the alert data that don't adhere to the Airtable format
  const filteredAlertsData: AirtableAlert[] = alertsData.filter(
    (alert) =>
      alert.Title &&
      alert.Description &&
      alert["Duration (minutes)"] &&
      alert.Time,
  );
  const agenda = await fetchAgenda();
  const reminders = generateReminders(agenda.events);

  // Create alerts from Airtable data
  const alerts = filteredAlertsData.map((alert, index) =>
    createAlertFromAirtable(alert, index),
  );

  // Create alerts from inactive reminders (those that have started but not expired)
  const reminderAlerts = reminders
    .filter((reminder) => now.getTime() >= reminder.startTime.getTime())
    .map((reminder) => createAlertFromReminder(reminder, now));

  const allAlerts = sortAlertsByCreationDate([...alerts, ...reminderAlerts]);

  return allAlerts;
};

export const generateReminders = (agenda: AgendaItem[]): Reminder[] => {
  return agenda
    .filter((item) => item.reminder)
    .map((item) => {
      const presenterNames = item.presenter.split(", ");
      const reminderName = presenterNames[0];
      const isMultiplePresenters = presenterNames.length > 1;
      const pronoun = isMultiplePresenters ? "are" : "is";
      const eventStartTime = new Date(item.startDate); // UTC
      const reminderStartTime = new Date(
        eventStartTime.getTime() - 10 * 60 * 1000,
      ); // 10 minutes before
      const reminderEndTime = new Date(
        eventStartTime.getTime() + 5 * 60 * 1000,
      ); // 5 minutes after event start

      return {
        id: item.id,
        startTime: reminderStartTime,
        endTime: reminderEndTime,
        eventStartTime: eventStartTime,
        reminderName: reminderName,
        presenter: item.presenter,
        isMultiplePresenters: isMultiplePresenters,
        pronoun: pronoun,
        talkType: item.talkType,
        stage: item.stage,
        talkTitle: item.title,
      };
    });
};
