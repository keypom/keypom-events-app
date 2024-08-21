export function LockIcon({
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
      <g clip-path="url(#clip0_26_2968)">
        <path
          d="M20.5714 6.85714V3.42857H17.1429V6.85714H6.85714V3.42857H3.42857V6.85714H0V24H24V6.85714H20.5714ZM20.5714 20.5714H13.7143V13.7143H10.2857V20.5714H3.42857V10.2857H20.5714V20.5714ZM17.1429 0H6.85714V3.42857H17.1429V0Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_26_2968">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
