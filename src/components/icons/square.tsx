export const SquareIcon = ({
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
      fill={color}
    >
      <g clipPath="url(#clip0_264_2486)">
        <path
          d="M20.5714 0H0V24H24V0H20.5714ZM20.5714 20.5714H3.42857V3.42857H20.5714V20.5714Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_264_2486">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
