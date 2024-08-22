export function TelegramIcon({
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
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_65_4639)">
        <path
          d="M21.0714 0H14.2143V3.42857H21.0714V10.2857H24.5V0H21.0714ZM17.6429 17.1429H21.0714V10.2857H17.6429V17.1429ZM14.2143 20.5714H10.7857V13.7143H3.92857V10.2857H7.35714V6.85714H0.5V17.1429H7.35714V24H17.6429V17.1429H14.2143V20.5714ZM14.2143 3.42857H7.35714V6.85714H14.2143V3.42857ZM10.7857 13.7143H14.2143V10.2857H10.7857V13.7143ZM17.6429 10.2857V6.85714H14.2143V10.2857H17.6429Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_65_4639">
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
