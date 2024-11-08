// api/agendas.ts
import eventHelperInstance from "../event";

export interface AgendaItem {
  id: number;
  title: string;
  presenter: string;
  stage: string;
  description: string;
  reminder: boolean;
  talkType: string;
  tags: string[];
  startDate: Date;
  endDate: Date;
}

export interface Agenda {
  events: AgendaItem[];
}

export const fetchAgenda: () => Promise<Agenda> = async () => {
  const [stringifiedAgenda] = await eventHelperInstance.viewCall({
    methodName: "get_agenda",
    args: {},
  });
  const agendaData = JSON.parse(stringifiedAgenda);
  eventHelperInstance.debugLog(agendaData, "log");

  // Update the filtering condition with new field names
  const filteredAgendaData = agendaData.filter(
    (item) =>
      item["⚙️ Start Time"] &&
      item["⚙️ End Time"] &&
      item["Session Name"] && // Ensure this field is included in your Airtable query
      item["Confirmed Speakers"] &&
      item.Location &&
      item.Description &&
      item.Format &&
      item.Topic,
  );
  eventHelperInstance.debugLog(filteredAgendaData, "log");

  const events: AgendaItem[] = filteredAgendaData.map((item, index) => {
    // Parse start and end times
    const startDate = new Date(item["⚙️ Start Time"]); // ISO string in UTC
    const endDate = new Date(item["⚙️ End Time"]); // ISO string in UTC

    // Parse tags (Topic)
    let tags: string[] = [];
    if (Array.isArray(item.Topic)) {
      tags = item.Topic.map((tag) => tag.trim());
    } else if (typeof item.Topic === "string") {
      tags = item.Topic.split(",").map((tag) => tag.trim());
    }

    // Parse Confirmed Speakers
    let speakerNames: string[] = [];
    if (Array.isArray(item["Confirmed Speakers"])) {
      speakerNames = item["Confirmed Speakers"];
    } else if (typeof item["Confirmed Speakers"] === "string") {
      speakerNames = item["Confirmed Speakers"].split(",").map((s) => s.trim());
    }

    const speakerNamesFormatted = speakerNames.map((name) =>
      name.split("-")[0].trim(),
    );

    // Parse Confirmed Moderators
    let moderatorNames: string[] = [];
    if (Array.isArray(item["Confirmed Moderators"])) {
      moderatorNames = item["Confirmed Moderators"];
    } else if (typeof item["Confirmed Moderators"] === "string") {
      moderatorNames = item["Confirmed Moderators"]
        .split(",")
        .map((s) => s.trim());
    }

    // Append '(moderator)' to moderator names
    const moderatorNamesFormatted = moderatorNames.map(
      (name) => `${name.split("-")[0].trim()} (moderator)`,
    );

    // Combine speakers and moderators
    const presentersList = [
      ...speakerNamesFormatted,
      ...moderatorNamesFormatted,
    ];

    // Join the names with comma and space
    const presenter = presentersList.join(", ");

    return {
      id: index + 1,
      title: item["Session Name"] || "",
      presenter: presenter,
      stage: item.Location || "",
      description: item.Description || "",
      reminder: item.Reminder === true,
      talkType: item.Format || "",
      tags: tags,
      startDate: startDate, // Already in UTC
      endDate: endDate, // Already in UTC
    };
  });

  return { events };
};
