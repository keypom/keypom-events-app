import { Box, Heading, Image, VStack, Text, Button } from "@chakra-ui/react";
import Boxes from "/boxes-background.webp";

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
          bg="black"
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
          <Heading
            as="h3"
            fontSize="5xl"
            fontFamily="mono"
            fontWeight="bold"
            color="white"
            bg="black"
            textAlign="left"
            px={2}
          >
            Congrats!
          </Heading>
          <Text
            fontFamily="mono"
            color="brand.400"
            bg="black"
            textAlign="right"
            alignSelf={"flex-end"}
            fontSize="xl"
            px={2}
            textTransform={"uppercase"}
          >
            You've found some {foundItem}
          </Text>
        </VStack>
        <Box p={4} width={"100%"}>
          <Button
            onClick={onReveal}
            width={"100%"}
            bg="black"
            fontFamily={"mono"}
            textTransform={"uppercase"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            height={"48px"}
            color={"white"}
            fontSize="sm"
            borderRadius={"0"}
            position={"relative"}
            _hover={{
              background: "black",
              color: "white",
            }}
            _active={{
              background: "black",
              color: "white",
            }}
            _before={{
              content: '""',
              position: "absolute",
              width: "57px",
              height: "37px",
              left: -4,
              top: -4,
              zIndex: -1,
              background: "black",
            }}
          >
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
