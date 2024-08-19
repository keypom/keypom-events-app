export const WalletIcon = ({
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
      <g clipPath="url(#a)">
        <path
          d="M20.571 0H0v24h24V0zm0 6.857h-6.857v3.429h6.857v3.428h-6.857v3.429h6.857v3.428H3.43V3.43h17.14zm-10.285 6.857h3.428v-3.428h-3.428z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};
