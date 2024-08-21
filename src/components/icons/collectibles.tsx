export function CollectiblesIcon({
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
      <g clip-path="url(#clip0_63_4627)">
        <path
          d="M10.2857 20.5714H6.85714V24H17.1429V20.5714H13.7143V17.1429H10.2857V20.5714ZM6.85714 13.7143V17.1429H10.2857V13.7143H6.85714ZM3.42857 10.2857V13.7143H6.85714V10.2857H3.42857ZM0 6.85714V10.2857H3.42857V6.85714H0ZM13.7143 17.1429H17.1429V13.7143H13.7143V17.1429ZM17.1429 13.7143H20.5714V10.2857H17.1429V13.7143ZM20.5714 10.2857H24V6.85714H20.5714V10.2857ZM0 0V3.42857H24V0H0Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_63_4627">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
