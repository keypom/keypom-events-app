function formatDate(date) {
  const options = { weekday: "long", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options).toUpperCase();

  // Extract the day and add the correct suffix
  const day = date.getDate();
  const suffix = getDaySuffix(day);

  // Extract the parts of the formatted date
  const parts = formattedDate.split(" ");
  const weekday = parts[0];
  const month = parts[1];
  const dayWithSuffix = day + suffix;

  return `${weekday} ${month} ${dayWithSuffix}`;
}

function getDaySuffix(day) {
  if (day > 3 && day < 21) return "TH"; // Handles 11th, 12th, 13th
  switch (day % 10) {
    case 1:
      return "ST";
    case 2:
      return "ND";
    case 3:
      return "RD";
    default:
      return "TH";
  }
}

export default [
  {
    date: formatDate(new Date("2024-11-09")),
    agendas: [
      {
        timeFrom: new Date("2024-11-09T11:00:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        timeTo: new Date("2024-11-09T11:30:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
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
    date: formatDate(new Date("2024-11-10")),
    agendas: [
      {
        timeFrom: new Date("2024-11-10T11:00:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        timeTo: new Date("2024-11-10T11:30:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
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
    date: formatDate(new Date("2024-11-11")),
    agendas: [
      {
        timeFrom: new Date("2024-11-11T11:00:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        timeTo: new Date("2024-11-11T11:30:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
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
        timeFrom: new Date("2024-11-11T12:00:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        timeTo: new Date("2024-11-11T12:30:00").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
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
