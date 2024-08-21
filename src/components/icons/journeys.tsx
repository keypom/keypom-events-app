export function JourneysIcon({
  width = 25,
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
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_63_4630)">
        <path
          d="M7.35714 24H10.7857V20.5714H7.35714V24ZM10.7857 20.5714H14.2143V17.1429H10.7857V20.5714ZM17.6429 17.1429V13.7143H14.2143V17.1429H17.6429ZM14.2143 13.7143V10.2857H10.7857V13.7143H14.2143ZM7.35714 10.2857H10.7857V6.85714H7.35714V10.2857ZM10.7857 6.85714H14.2143V3.42857H10.7857V6.85714ZM14.2143 3.42857H17.6429V0H14.2143V3.42857ZM0.5 24H3.92857V0H0.5V24ZM21.0714 0V24H24.5V0H21.0714Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_63_4630">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
