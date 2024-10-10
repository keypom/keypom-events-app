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

  const filteredAgendaData = agendaData.filter(
    (item) =>
      item.Date &&
      item["Duration (minutes)"] &&
      item["Talk Title"] &&
      item.Presenter &&
      item.Stage &&
      item.Description &&
      item["Talk Type"] &&
      item.Tags,
  );

  const events: AgendaItem[] = filteredAgendaData.map((item, index) => {
    const durationMinutes = Number(item["Duration (minutes)"]) || 0;

    // Parse date string as UTC
    const startDate = new Date(item.Date); // ISO string in UTC
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Parse tags
    let tags: string[] = [];
    if (Array.isArray(item.Tags)) {
      tags = item.Tags.map((tag) => tag.trim());
    } else if (typeof item.Tags === "string") {
      tags = item.Tags.split(",").map((tag) => tag.trim());
    }

    return {
      id: index + 1,
      title: item["Talk Title"] || "",
      presenter: item.Presenter || "",
      stage: item.Stage || "",
      description: item.Description || "",
      reminder: item.Reminder === true,
      talkType: item["Talk Type"] || "",
      tags: tags,
      startDate: startDate, // Already in UTC
      endDate: endDate, // Calculated in UTC
    };
  });

  return { events };
};
