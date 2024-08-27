import { Box } from "@chakra-ui/react";
import { SquareIcon } from "../icons/square";
import { useState } from "react";
import { CheckedIcon } from "../icons/checked";

export function Checkbox({
  children,
  value,
  isChecked,
  onChange,
  ...props
}: {
  children: React.ReactNode;
  value: string;
  isChecked?: boolean;
  onChange?: (value: string) => void;
}) {
  const handleCheckboxClick = () => {
    onChange && onChange(value);
  };
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        cursor: "pointer",
      }}
      onClick={handleCheckboxClick}
    >
      <input
        id="custom-checkbox"
        type="checkbox"
        {...props}
        style={{
          display: "none",
        }}
        checked={isChecked}
        onChange={handleCheckboxClick}
      />
      {isChecked ? (
        <CheckedIcon width={24} height={24} />
      ) : (
        <SquareIcon width={24} height={24} />
      )}
      <label>{children}</label>
    </Box>
  );
}
