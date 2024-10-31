import { Flex, Heading } from "@chakra-ui/react";

interface TokenScavRewardImageProps {
  tokenAmount: string;
}

export const TokenScavRewardImage = ({
  tokenAmount,
}: TokenScavRewardImageProps) => {
  return (
    <Flex
      w={{ base: "210px", md: "273px", lg: "273px" }}
      h={{ base: "194px", md: "250px", lg: "250px" }}
      flexShrink={0}
      px={4}
      bg="black"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* Token amount */}
      <Heading
        as="h3"
        fontSize={{ base: "90px", md: "130px", lg: "108px" }}
        fontWeight="bold"
        color="white"
        lineHeight="1.1"
        textAlign="center"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {tokenAmount}
      </Heading>

      {/* Label text (e.g., SOV3) */}
      <Heading
        as="h4"
        fontWeight="normal"
        textAlign="center"
        color="brand.400"
        fontSize={{ base: "40px", md: "48px", lg: "52px" }}
        mt={1}
      >
        SOV3
      </Heading>
    </Flex>
  );
};
