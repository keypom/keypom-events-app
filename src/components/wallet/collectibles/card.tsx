import { VStack, Image, Heading, Text, Box } from "@chakra-ui/react";

import { LockIcon } from "@/components/icons";

import CollectibleLogo from "/collectible.webp";
import { Link } from "react-router-dom";

const randomColors = [
  "#00EC97",
  "#FFA99F",
  "#4D3BC2",
  "#9797FF",
  "#E91409",
  "#62EBE4",
];

export function CollectibleCard({
  disabled,
  id,
}: {
  disabled?: boolean;
  id: string;
}) {
  return (
    <VStack
      as={Link}
      // handle disabled case
      to={disabled ? "" : `/wallet/collectibles/${id}`}
      spacing={2}
      alignItems={"flex-start"}
      cursor={disabled ? "not-allowed" : "pointer"}
    >
      <Box position="relative">
        <Image
          src={CollectibleLogo}
          width={"100%"}
          height={"100%"}
          bg={randomColors[Math.floor(Math.random() * randomColors.length)]}
          borderRadius={"md"}
          opacity={disabled ? 0.5 : 1}
          filter="auto"
          blur={disabled ? "8px" : "0px"}
        />
        {disabled && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <LockIcon
              width={24}
              height={24}
              color={"var(--chakra-colors-brand-400)"}
            />
          </Box>
        )}
      </Box>
      <VStack alignItems="flex-start" gap={0}>
        <Heading as="h3" fontSize="sm" fontFamily={"mono"} color="white">
          Title of asset here
        </Heading>
        <Text color="brand.400" fontSize="10px" fontWeight={700}>
          POAP
        </Text>
      </VStack>
    </VStack>
  );
}
