import { Agenda, AgendaItem } from "../api/agendas";

// helpers/agenda.ts
export const filterAgenda = (
  agendaData: Agenda,
  searchKey: string,
  selectedDay: string | null,
  selectedStage: string | null,
  selectedTags: string[] | null,
): Agenda => {
  let filteredEvents = agendaData.events;

  if (selectedDay) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        new Date(event.startDate).toLocaleDateString() ===
        new Date(selectedDay).toLocaleDateString(),
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

  if (selectedTags && selectedTags.length > 0) {
    filteredEvents = filteredEvents.filter((event) =>
      event.tags.some((tag) => selectedTags.includes(tag)),
    );
  }

  return {
    events: filteredEvents,
  };
};

export const findAllTags = (events: AgendaItem[]): string[] => {
  const tagsSet = new Set<string>();
  events.forEach((event) => {
    event.tags.forEach((tag) => {
      tagsSet.add(tag);
    });
  });
  return Array.from(tagsSet);
};

export const findAllStages = (events: AgendaItem[]): string[] => {
  const stages = new Set<string>();

  events.forEach((event) => {
    stages.add(event.stage);
  });

  return Array.from(stages);
};

export const findAllDays = (events: AgendaItem[]): string[] => {
  const days = new Set<string>();

  events.forEach((event) => {
    days.add(new Date(event.startDate).toLocaleDateString());
    days.add(new Date(event.endDate).toLocaleDateString());
  });

  return Array.from(days);
};
