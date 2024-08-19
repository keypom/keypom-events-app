export const HelpIcon = ({
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
        d="M6.72862 0V3.42857H17.0143V0H6.72862ZM3.30005 6.85714H6.72862V3.42857H3.30005V6.85714ZM17.0143 3.42857V10.2857H20.4429V3.42857H17.0143ZM10.1572 24H13.5858V20.5714H10.1572V24ZM10.1572 10.2857V17.1429H13.5858V13.7143H17.0143V10.2857H10.1572Z"
        fill={color}
      />
    </svg>
  );
};
