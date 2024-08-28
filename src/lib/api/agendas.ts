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
  const response = await fetch("https://example.com/agendas");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const agendas: Agenda = await response.json();
  return agendas;
};
