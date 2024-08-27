export function CheckedIcon({
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
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
    >
      <g clip-path="url(#clip0_59_4207)">
        <path
          d="M10.2857 17.1429H13.7143V13.7143H10.2857V17.1429ZM6.85714 10.2857V13.7143H10.2857V10.2857H6.85714ZM17.1429 10.2857H20.5714V6.85714H17.1429V10.2857ZM13.7143 13.7143H17.1429V10.2857H13.7143V13.7143ZM20.5714 3.42857V6.85714H24V3.42857H20.5714ZM20.5714 20.5714H3.42857V3.42857H17.1429V0H0V24H24V13.7143H20.5714V20.5714Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_59_4207">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
