import { Icon, type IconProps } from '@chakra-ui/react';

interface LocationPinIconProps extends IconProps {
  color?: string;
  strokeWidth?: string;
}

export const LocationPinIcon = ({
  strokeWidth = '2',
  color = '#3E3E3E',
  ...props
}: LocationPinIconProps) => {
  return (
    <Icon
      fill="none"
      height="10"
      viewBox="0 0 24 24"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </Icon>
  );
};
