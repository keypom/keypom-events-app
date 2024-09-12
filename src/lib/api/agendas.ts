import eventHelperInstance from "../event";

export type AgendaEvent = {
  title: string;
  stage: string;
  description: string;
  presenter: string;
  startDate: string;
  endDate: string;
};

export type Agenda = {
  events: AgendaEvent[];
};

export const fetchAgenda: () => Promise<Agenda> = async () => {
  const [stringifiedAgenda] = await eventHelperInstance.viewCall({
    methodName: "get_agenda",
    args: {},
  });
  const airtableAgenda = JSON.parse(stringifiedAgenda);

  console.log("Agenda before sorting: ", airtableAgenda);

  // Map the agenda to the AgendaEvent interface, skipping entries with no valid Start Time or Duration
  const mappedAgenda: AgendaEvent[] = airtableAgenda
    .filter((agenda) => agenda["Start Time"] && agenda["Duration (minutes)"]) // Filter out invalid entries
    .map((agenda, index) => {
      // Combine Date and Start Time to create the start date
      const startDate = new Date(`${agenda.Date}T${agenda["Start Time"]}`);

      // Calculate the end date by adding the duration (in minutes)
      const endDate = new Date(
        startDate.getTime() + agenda["Duration (minutes)"] * 60000,
      );

      return {
        id: index + 1, // Generating a unique ID based on the index
        title: agenda["Talk Title"] || "No Title", // Fallback if the title is missing
        stage: agenda.Stage || "No stage available",
        description: agenda.Description || "No description available",
        presenter: agenda.Presenter || "No presenter available",
        startDate: startDate.toISOString(), // Convert to ISO string format
        endDate: endDate.toISOString(), // Convert to ISO string format
      };
    });

  return { events: mappedAgenda };
};
