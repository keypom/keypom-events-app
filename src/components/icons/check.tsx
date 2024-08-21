export function CheckIcon({
  width = 24,
  height = 24,
  color = "black",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 9.85714V13.2857H3.42857V9.85714H0ZM3.42857 13.2857V16.7143H6.85714V13.2857H3.42857ZM6.85714 20.1429H10.2857V16.7143H6.85714V20.1429ZM10.2857 16.7143H13.7143V13.2857H10.2857V16.7143ZM13.7143 13.2857H17.1429V9.85714H13.7143V13.2857ZM17.1429 9.85714H20.5714V6.42857H17.1429V9.85714ZM20.5714 3V6.42857H24V3H20.5714Z"
        fill={color}
      />
    </svg>
  );
}
