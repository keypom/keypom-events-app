import { Box, Heading, Image, VStack } from "@chakra-ui/react";

import Boxes from "/assets/claim-blocks.webp";

interface RevealProps {
  foundItem: string;
  itemCount?: number;
}

export function Reveal({ foundItem, itemCount }: RevealProps) {
  return (
    <Box mt="64px" position="relative" p={4}>
      <Box position="relative">
        <Image
          src={Boxes}
          width="100%"
          height="100%"
          objectFit={"cover"}
          position="relative"
          minW="100%"
          minH="500px"
          loading="eager"
        />
      </Box>
      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width={"100%"}
        p={4}
        spacing={8}
      >
        <Box bg="bg.primary" p={4}>
          <Heading
            as="h3"
            fontSize="108px"
            fontWeight={"bold"}
            textAlign={"center"}
            color={"white"}
          >
            {itemCount}
          </Heading>
          <Heading
            as="h4"
            fontWeight={"normal"}
            textAlign={"center"}
            color={"brand.400"}
            fontSize="52px"
          >
            {foundItem}
          </Heading>
        </Box>
        <VStack alignItems="center" gap={0} width={"100%"}>
          <Heading
            as="h3"
            fontSize="5xl"
            fontFamily="mono"
            fontWeight="bold"
            color="white"
            bg="bg.primary"
            textAlign="left"
            textTransform={"uppercase"}
            px={4}
          >
            Claimed
          </Heading>
        </VStack>
      </VStack>
    </Box>
  );
}
