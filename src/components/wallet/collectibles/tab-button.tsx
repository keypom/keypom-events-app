import { Box, Text, useTheme } from "@chakra-ui/react";

export function CollectibleTabButton({
  active,
  type,
  numItems,
  onClick,
}: {
  active: boolean;
  type: "found" | "explore";
  numItems: number;
  onClick: () => void;
}) {
  const theme = useTheme();

  const getText = (type: "found" | "explore") => {
    return type === "found" ? `FOUND (${numItems})` : `EXPLORE (${numItems})`;
  };

  const getOpacity = (numItems: number) => (numItems < 1 ? 0.25 : 1);

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16,
        )}`
      : null;
  };

  const getBackgroundColor = (active: boolean, numItems: number) => {
    if (active) {
      return "transparent";
    }
    const opacity = getOpacity(numItems);
    const brand400Hex = theme.colors.brand[400];
    const rgb = hexToRgb(brand400Hex);
    return rgb ? `rgba(${rgb}, ${opacity})` : "transparent";
  };

  const getBottomBorderColor = (active: boolean) =>
    active ? "transparent" : "brand.400";

  return (
    <Box
      borderTopLeftRadius="md"
      borderTopRightRadius="md"
      w="full"
      bg={getBackgroundColor(active, numItems)}
      h="50px"
      alignItems="center"
      justifyContent="center"
      display="flex"
      borderWidth="1px"
      borderColor={active ? "brand.400" : "transparent"}
      borderBottomColor={getBottomBorderColor(active)}
      cursor={numItems > 0 || active ? "pointer" : "not-allowed"}
      pointerEvents={numItems > 0 || active ? "auto" : "none"}
      onClick={numItems > 0 || active ? onClick : undefined}
    >
      <Text
        fontFamily="mono"
        fontSize="md"
        fontWeight={700}
        textAlign="center"
        color={active ? "brand.400" : "black"}
      >
        {getText(type)}
      </Text>
    </Box>
  );
}
