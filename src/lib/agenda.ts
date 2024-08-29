import { Agenda, AgendaEvent } from "./api/agendas";

export const filterAgenda = (
  agendaData: Agenda,
  searchKey: string,
  selectedDay: string | null,
  selectedStage: string | null,
): Agenda => {
  let filteredEvents = agendaData.events;

  if (selectedDay) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        new Date(event.startDate).toLocaleDateString().toLowerCase() ===
        new Date(selectedDay).toLocaleDateString().toLowerCase(),
    );
  }

  if (selectedStage) {
    filteredEvents = filteredEvents.filter(
      (event) => event.stage.toLowerCase() === selectedStage.toLowerCase(),
    );
  }

  if (searchKey) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchKey.toLowerCase()) ||
        event.stage.toLowerCase().includes(searchKey.toLowerCase()) ||
        event.presenter.toLowerCase().includes(searchKey.toLowerCase()),
    );
  }

  return {
    events: filteredEvents,
  };
};

export const findAllStages = (events: AgendaEvent[]): string[] => {
  const stages = new Set<string>();

  events.forEach((event) => {
    stages.add(event.stage);
  });

  return Array.from(stages);
};

export const findAllDays = (events: AgendaEvent[]): string[] => {
  const days = new Set<string>();

  events.forEach((event) => {
    days.add(new Date(event.startDate).toLocaleDateString());
    days.add(new Date(event.endDate).toLocaleDateString());
  });

  return Array.from(days);
};
