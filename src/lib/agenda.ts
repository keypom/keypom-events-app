function filterAgenda(
  agendaData: any,
  searchKey: string,
  selectedDay: string | null,
  selectedStage: string | null,
) {
  let filtered = agendaData;

  if (selectedDay) {
    filtered = filtered.filter(
      (event) => event.date.toLowerCase() === selectedDay.toLowerCase(),
    );
  }

  if (selectedStage) {
    let newData: { [key: string]: any } = {};

    filtered.forEach((event) => {
      const date = event.date;
      const agendas = event.agendas;

      agendas.forEach((agenda) => {
        const events = agenda.events;

        events.forEach((event) => {
          if (event.stage.toLowerCase() === selectedStage.toLowerCase()) {
            if (!newData[date]) {
              newData[date] = {
                date,
                agendas: [],
              };
            }

            if (
              !newData[date].agendas.find(
                (agendaItem: any) => agendaItem.timeFrom === agenda.timeFrom,
              )
            ) {
              newData[date].agendas.push({
                timeFrom: agenda.timeFrom,
                timeTo: agenda.timeTo,
                events: [],
              });
            }

            newData[date].agendas
              .find(
                (agendaItem: any) => agendaItem.timeFrom === agenda.timeFrom,
              )
              .events.push(event);
          }
        });
      });
    });

    filtered = Object.values(newData);
  }

  if (searchKey) {
    let newData: { [key: string]: any } = {};

    filtered.forEach((event) => {
      const date = event.date;
      const agendas = event.agendas;

      agendas.forEach((agenda) => {
        const events = agenda.events;

        events.forEach((event) => {
          if (
            event.title.toLowerCase().includes(searchKey.toLowerCase()) ||
            event.stage.toLowerCase().includes(searchKey.toLowerCase()) ||
            event.presenter.toLowerCase().includes(searchKey.toLowerCase())
          ) {
            if (!newData[date]) {
              newData[date] = {
                date,
                agendas: [],
              };
            }

            if (
              !newData[date].agendas.find(
                (agendaItem: any) => agendaItem.timeFrom === agenda.timeFrom,
              )
            ) {
              newData[date].agendas.push({
                timeFrom: agenda.timeFrom,
                timeTo: agenda.timeTo,
                events: [],
              });
            }

            newData[date].agendas
              .find(
                (agendaItem: any) => agendaItem.timeFrom === agenda.timeFrom,
              )
              .events.push(event);
          }
        });
      });
    });

    return Object.values(newData);
  } else {
    return filtered;
  }
}

export { filterAgenda };
