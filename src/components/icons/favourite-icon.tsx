// components/icons/FavouriteIcon.tsx
import React from "react";
import { Icon, IconProps } from "@chakra-ui/react";

interface FavouriteIconProps extends IconProps {
  isFavourited: boolean;
}

export const FavouriteIcon: React.FC<FavouriteIconProps> = ({
  isFavourited,
  ...props
}) => {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill={isFavourited ? "var(--chakra-colors-brand-400)" : "transparent"}
        stroke={"var(--chakra-colors-brand-400)"}
        strokeWidth="2"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1L12 2z"
      />
    </Icon>
  );
};
