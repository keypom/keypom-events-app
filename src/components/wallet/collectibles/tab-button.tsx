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
  const theme = useTheme(); // Access the theme object

  const getText = (type: "found" | "explore") => {
    switch (type) {
      case "found":
        return `FOUND (${numItems})`;
      case "explore":
        return `EXPLORE (${numItems})`;
    }
  };

  const getOpacity = (numItems: number) => {
    return numItems < 1 ? 0.25 : 1;
  };

  // Function to convert hex to RGB
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

    // Dynamically get the brand.400 color from the theme and convert it to RGB
    const brand400Hex = theme.colors.brand[400];
    const rgb = hexToRgb(brand400Hex);

    if (rgb) {
      return `rgba(${rgb}, ${opacity})`; // Apply the RGB color with the dynamic opacity
    }

    return "transparent";
  };

  const getBottomBorderColor = (active: boolean) => {
    if (active) {
      return "transparent";
    }
    return "brand.400";
  };

  return (
    <Box
      borderTopLeftRadius="md"
      borderTopRightRadius="md"
      w="full"
      bg={getBackgroundColor(active, numItems)} // Pass both active and numItems for dynamic opacity
      h="40px"
      alignItems={"center"}
      justifyContent={"center"}
      display={"flex"}
      borderWidth="1px"
      borderColor={active ? "brand.400" : "transparent"}
      borderBottomColor={getBottomBorderColor(active)}
      cursor={numItems > 0 ? "pointer" : "not-allowed"}
      pointerEvents={numItems > 0 ? "auto" : "none"}
      onClick={numItems > 0 ? onClick : undefined}
    >
      <Text
        fontFamily={"mono"}
        fontSize={"sm"}
        fontWeight={700}
        textAlign={"center"}
        color={active ? "brand.400" : "black"}
      >
        {getText(type)}
      </Text>
    </Box>
  );
}
