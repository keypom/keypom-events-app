export function XIcon({
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
      {/* Top-left to bottom-right diagonal */}
      <path d="M0 0H3.42857V3.42857H0V0Z" fill={color} />
      <path
        d="M3.42857 3.42857H6.85714V6.85714H3.42857V3.42857Z"
        fill={color}
      />
      <path
        d="M6.85714 6.85714H10.2857V10.2857H6.85714V6.85714Z"
        fill={color}
      />
      <path
        d="M10.2857 10.2857H13.7143V13.7143H10.2857V10.2857Z"
        fill={color}
      />
      <path
        d="M13.7143 13.7143H17.1429V17.1429H13.7143V13.7143Z"
        fill={color}
      />
      <path
        d="M17.1429 17.1429H20.5714V20.5714H17.1429V17.1429Z"
        fill={color}
      />
      <path d="M20.5714 20.5714H24V24H20.5714V20.5714Z" fill={color} />

      {/* Top-right to bottom-left diagonal */}
      <path d="M20.5714 0H24V3.42857H20.5714V0Z" fill={color} />
      <path
        d="M17.1429 3.42857H20.5714V6.85714H17.1429V3.42857Z"
        fill={color}
      />
      <path
        d="M13.7143 6.85714H17.1429V10.2857H13.7143V6.85714Z"
        fill={color}
      />
      <path
        d="M10.2857 10.2857H13.7143V13.7143H10.2857V10.2857Z"
        fill={color}
      />
      <path
        d="M6.85714 13.7143H10.2857V17.1429H6.85714V13.7143Z"
        fill={color}
      />
      <path
        d="M3.42857 17.1429H6.85714V20.5714H3.42857V17.1429Z"
        fill={color}
      />
      <path d="M0 20.5714H3.42857V24H0V20.5714Z" fill={color} />
    </svg>
  );
}
