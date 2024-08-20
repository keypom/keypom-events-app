export const ScanIcon = ({
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
        d="M21.0714 3.42857H17.6429V6.85714H21.0714V17.1429H17.6429V20.5714H24.5V3.42857H21.0714ZM17.6429 0H7.35714V3.42857H17.6429V0ZM7.35714 24H17.6429V20.5714H7.35714V24ZM3.92857 17.1429V6.85714H7.35714V3.42857H0.5V20.5714H7.35714V17.1429H3.92857ZM10.7857 6.85714H7.35714V17.1429H17.6429V6.85714H10.7857ZM14.2143 13.7143H10.7857V10.2857H14.2143V13.7143Z"
        fill={color}
      />
    </svg>
  );
};
