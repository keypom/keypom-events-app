export const ArrowIcon = ({
  width = 24,
  height = 24,
  color = "black",
  direction = "right",
}: {
  width?: number;
  height?: number;
  color?: string;
  direction?: "right" | "left" | "up" | "down";
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `
          ${direction === "right" ? "rotate(90deg)" : ""}
          ${direction === "left" ? "rotate(-90deg)" : ""}
          ${direction === "down" ? "rotate(180deg)" : ""}
        `,
      }}
    >
      <path
        d="M6.85714 3.42857V6.85714H10.2857V3.42857H6.85714ZM3.42857 10.2857H6.85714V6.85714H3.42857V10.2857ZM0 13.7143H3.42857V10.2857H0V13.7143ZM13.7143 3.42857V6.85714H17.1429V3.42857H13.7143ZM17.1429 6.85714V10.2857H20.5714V6.85714H17.1429ZM20.5714 10.2857V13.7143H24V10.2857H20.5714ZM13.7143 0H10.2857V3.42857H13.7143V0ZM10.2857 24H13.7143V6.85714H10.2857V24Z"
        fill={color}
      />
    </svg>
  );
};
