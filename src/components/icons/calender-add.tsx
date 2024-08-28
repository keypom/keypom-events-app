export function CalenderAddIcon({
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
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_57_3251)">
        <path
          d="M13.7143 8.57143H10.2857V12H6.85714V15.4286H10.2857V18.8571H13.7143V15.4286H17.1429V12H13.7143V8.57143ZM20.5714 0H0V24H24V0H20.5714ZM20.5714 20.5714H3.42857V6.85714H20.5714V20.5714Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_57_3251">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
