export const FilterIcon = ({
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
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M24 3V6.42857H0V3H24ZM20.5714 13.2857H3.42857V9.85714H20.5714V13.2857ZM17.1429 20.1429H6.85714V16.7143H17.1429V20.1429Z"
        fill={color}
      />
    </svg>
  );
};
