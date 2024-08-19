export const AgendaIcon = ({
  width = 25,
  height = 24,
  color = "black",
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.900146 17.1429H4.32872V13.7143H0.900146V17.1429ZM7.75729 17.1429H24.9001V13.7143H7.75729V17.1429ZM7.75729 24H24.9001V20.5714H7.75729V24ZM0.900146 24H4.32872V20.5714H0.900146V24ZM0.900146 10.2857H4.32872V6.85714H0.900146V10.2857ZM7.75729 10.2857H24.9001V6.85714H7.75729V10.2857ZM7.75729 0V3.42857H24.9001V0H7.75729ZM0.900146 3.42857H4.32872V0H0.900146V3.42857Z"
        fill={color}
      />
    </svg>
  );
};
