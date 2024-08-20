export const FlipIcon = ({
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
      <g clipPath="url(#clip0_26_1574)">
        <path
          d="M3.42857 3.42857H0V6.85714H3.42857V3.42857ZM6.85714 0H3.42857V3.42857H6.85714V0ZM3.42857 10.2857H6.85714V6.85714H3.42857V10.2857ZM17.1429 24H20.5714V20.5714H17.1429V24ZM20.5714 13.7143H17.1429V17.1429H20.5714V13.7143ZM20.5714 17.1429V20.5714H24V17.1429H20.5714ZM6.85714 17.1429V13.7143H3.42857V20.5714H17.1429V17.1429H6.85714ZM17.1429 6.85714V10.2857H20.5714V3.42857H6.85714V6.85714H17.1429Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_26_1574">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
