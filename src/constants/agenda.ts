import { Agenda } from "@/types/common";

export const agendaData: Agenda[] = [
  {
    date: "Saturday, Nov 9th",
    agendas: [
      {
        timeFrom: "11:00",
        timeTo: "11:30",
        events: [
          {
            title: "First Event",
            stage: "Main Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
          {
            title: "Second Event",
            stage: "Cypherpunk Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
        ],
      },
    ],
  },
  {
    date: "Sunday, Nov 10th",
    agendas: [
      {
        timeFrom: "11:00",
        timeTo: "11:30",
        events: [
          {
            title: "Third Event",
            stage: "Main Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
          {
            title: "Fourth Event",
            stage: "Cypherpunk Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
        ],
      },
    ],
  },
  {
    date: "Monday, Nov 11th",
    agendas: [
      {
        timeFrom: "11:00",
        timeTo: "11:30",
        events: [
          {
            title: "Fifth Event",
            stage: "Main Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
          {
            title: "Sixth Event",
            stage: "Cypherpunk Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
        ],
      },
      {
        timeFrom: "12:00",
        timeTo: "12:30",
        events: [
          {
            title: "Seventh Event",
            stage: "Main Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
          {
            title: "Eigth Event",
            stage: "Cypherpunk Stage",
            description: "Description of the event",
            presenter: "Presenter",
          },
        ],
      },
    ],
  },
];
