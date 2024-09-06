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
          <Heading as="h3" variant="reveal.itemCount">
            {itemCount}
          </Heading>
          <Heading as="h4" variant="reveal.item">
            {foundItem}
          </Heading>
        </Box>
        <VStack alignItems="center" gap={0} width={"100%"}>
          <Heading as="h3" px={4} py={2} variant="reveal.claimed">
            Claimed
          </Heading>
        </VStack>
      </VStack>
    </Box>
  );
}
