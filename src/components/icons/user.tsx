export const UserIcon = ({
  width = 24,
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
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7143 10.2857H17.1429V0H6.85714V10.2857H13.7143ZM10.2857 3.42857H13.7143V6.85714H10.2857V3.42857ZM20.5714 13.7143H0V24H3.42857V17.1429H20.5714V24H24V13.7143H20.5714Z"
        fill={color}
      />
    </svg>
  );
};
