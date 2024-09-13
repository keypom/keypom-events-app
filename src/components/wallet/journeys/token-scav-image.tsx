import { Flex, Heading } from "@chakra-ui/react";

interface TokenScavRewardImageProps {
  tokenAmount: string;
  boxHeight?: string; // Height of the box
  boxWidth?: string; // Width of the box
  bgColor?: string; // Background color prop
  tokenFontSize?: string; // Font size for token amount
  tokenColor?: string; // Text color for token amount
  labelFontSize?: string; // Font size for label (e.g., SOV3)
  borderRadius?: string; // Border radius of the box
  labelColor?: string; // Text color for label
}

export const TokenScavRewardImage = ({
  tokenAmount,
  boxHeight = "100px",
  boxWidth = "100px",
  borderRadius = "0px",
  bgColor = "gray.200", // Default background color
  tokenFontSize = "50px", // Default font size for token amount
  tokenColor = "black", // Default token text color
  labelFontSize = "22px", // Default font size for the label
  labelColor = "black", // Default label text color
}: TokenScavRewardImageProps) => {
  return (
    <Flex
      w={boxWidth}
      h={boxHeight}
      flexShrink={0}
      borderRadius={borderRadius}
      bg={bgColor}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* Token amount */}
      <Heading
        as="h3"
        fontSize={tokenFontSize}
        fontWeight="bold"
        color={tokenColor}
        lineHeight="1"
      >
        {tokenAmount}
      </Heading>

      {/* Label text (e.g., SOV3) */}
      <Heading
        as="h4"
        fontWeight="normal"
        textAlign="center"
        color={labelColor}
        fontSize={labelFontSize}
        mt={1}
      >
        SOV3
      </Heading>
    </Flex>
  );
};
