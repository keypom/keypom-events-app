import type React from "react";

export interface IFlowPage {
  name: string;
  description: string;
  component: React.ReactNode; // forms, summary. etc
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface IWalletOption {
  name: string;
  title: string;
}

export interface IToken {
  amount: string;
  symbol: string;
}

export interface TokenAsset {
  icon: string;
  value: string;
  symbol: string;
}

export type AgendaAgenda = {
  timeFrom: string;
  timeTo: string;
  events: AgendaEvent[];
};

export type AgendaEvent = {
  title: string;
  stage: string;
  description: string;
  presenter: string;
};

export type Agenda = {
  date: string;
  agendas: AgendaAgenda[];
};
