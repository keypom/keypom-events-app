import { Box, Heading, Image, VStack, Text, Button } from "@chakra-ui/react";
import Boxes from "/assets/boxes-background.webp";

import { HelpIcon, ArrowIcon } from "@/components/icons";

interface HiddenProps {
  foundItem: string;
  onReveal: () => void;
}

export function Hidden({ foundItem, onReveal }: HiddenProps) {
  return (
    <Box mt="64px" position="relative" p={4}>
      <Image
        src={Boxes}
        width="100%"
        height="100%"
        objectFit={"cover"}
        loading="eager"
        minH="476px"
      />
      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width={"100%"}
        p={4}
        spacing={8}
      >
        <Box
          bg="bg.primary"
          width={"170px"}
          height={"170px"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <HelpIcon
            width={128}
            height={128}
            color={"var(--chakra-colors-brand-400)"}
          />
        </Box>
        <VStack alignItems="flex-start" gap={0} width={"100%"}>
          <Heading as="h3" variant="claim.congrats" px={2}>
            Congrats!
          </Heading>
          <Text variant="claim.description" alignSelf={"flex-end"} px={2}>
            You've found some {foundItem}
          </Text>
        </VStack>
        <Box p={4} width={"100%"}>
          <Button onClick={onReveal} variant="claimCongrats">
            <span>Reveal & Claim</span>
            <ArrowIcon
              width={24}
              direction="right"
              height={24}
              color={"var(--chakra-colors-brand-400)"}
            />
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
