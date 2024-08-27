export const SearchIcon = ({
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
      <g clip-path="url(#clip0_35_3427)">
        <path
          d="M17.1429 17.1429V20.5714H20.5714V17.1429H17.1429ZM20.5714 20.5714V24H24V20.5714H20.5714ZM13.7143 0H3.42857V3.42857H13.7143V0ZM0 3.42857V13.7143H3.42857V3.42857H0ZM17.1429 3.42857H13.7143V13.7143H3.42857V17.1429H17.1429V3.42857Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_35_3427">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
