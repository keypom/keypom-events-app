import { Icon, type IconProps } from '@chakra-ui/react';

interface ReceiveIconProps extends IconProps {
  color?: string;
  strokeWidth?: string;
}

export const ReceiveIcon = ({
  strokeWidth = '2',
  color = '#3E3E3E',
  ...props
}: ReceiveIconProps) => {
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
        d="M12 21V3M19 14L12 21L5 14"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </Icon>
  );
};
