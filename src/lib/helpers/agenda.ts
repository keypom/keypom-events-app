import { formatDate, pureFormat } from "@/utils/date";
import { Agenda, AgendaItem } from "../api/agendas";
import eventHelperInstance from "../event";

// helpers/agenda.ts
export const filterAgenda = (
  agendaData: Agenda,
  searchKey: string,
  selectedDays: string[] | null,
  selectedStage: string | null,
  selectedTags: string[],
  favouritedEventIds: Set<number> | null = null,
): Agenda => {
  let filteredEvents = agendaData.events;

  if (favouritedEventIds) {
    filteredEvents = filteredEvents.filter((event) =>
      favouritedEventIds.has(event.id),
    );
  }

  // Filter by multiple selected days
  if (selectedDays && selectedDays.length > 0) {
    filteredEvents = filteredEvents.filter((event) => {
      const eventDay = formatDate(event.startDate); // Format event start date to match displayDate format
      return selectedDays.includes(eventDay);
    });
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
  // Group and sort events
  const groupedEvents = groupAndSortEvents(events);

  // Extract displayDate values
  const displayDates = Object.values(groupedEvents).map(
    ({ displayDate }) => displayDate,
  );

  eventHelperInstance.debugLog(`Display Dates: ${displayDates}`, "log");
  return displayDates;
};

export const groupAndSortEvents = (
  events: AgendaItem[],
): Record<
  string,
  { date: Date; displayDate: string; timeslots: Record<string, AgendaItem[]> }
> => {
  // Sort the groupedEvents by date (earliest to latest)
  // Group events by start date in local time
  const groupedEvents = events.reduce(
    (acc, event) => {
      // Use pureFormat with the 'yyyy-MM-dd' format to get the local date
      const dateKey = pureFormat(event.startDate.toISOString(), "yyyy-MM-dd"); // Local date e.g., "2024-11-09"
      const displayDate = formatDate(event.startDate); // e.g., "SATURDAY, NOV 9TH"
      const timeKey = `${pureFormat(event.startDate.toISOString(), "HH:mm")}-${pureFormat(event.endDate.toISOString(), "HH:mm")}`; // Local times

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: event.startDate, // Use startDate for sorting
          displayDate: displayDate,
          timeslots: {},
        };
      }
      if (!acc[dateKey].timeslots[timeKey]) {
        acc[dateKey].timeslots[timeKey] = [];
      }
      acc[dateKey].timeslots[timeKey].push(event);

      return acc;
    },
    {} as Record<
      string,
      {
        date: Date;
        displayDate: string;
        timeslots: Record<string, AgendaItem[]>;
      }
    >,
  );
  // Sort by date and maintain the Record structure
  const sortedGroupedEvents = Object.fromEntries(
    Object.entries(groupedEvents).sort(
      ([, a], [, b]) => a.date.getTime() - b.date.getTime(),
    ),
  );

  return sortedGroupedEvents;
};
