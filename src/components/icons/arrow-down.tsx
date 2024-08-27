export function ArrowDownIcon({
  width = 24,
  height = 24,
  color = "black",
  rotate = false, // New prop to control rotation
}: {
  width?: number;
  height?: number;
  color?: string;
  rotate?: boolean; // New boolean prop
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      style={{
        transform: rotate ? "rotate(180deg)" : "none", // Apply rotation if the prop is true
        transition: "transform 0.3s ease", // Optional: Add a smooth transition
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.42857 7H3V10.4286H6.42857V7ZM9.85716 10.4286H6.42859V13.8572H9.85716V10.4286ZM16.7142 13.8571H13.2857V17.2857H9.85718V13.8571H13.2857V10.4286H16.7142V13.8571ZM16.7143 10.4286H20.1428V7.00002H16.7143V10.4286Z"
        fill="black"
      />
    </svg>
  );
}
