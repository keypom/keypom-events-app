import { Box, Heading, Image, VStack, Text, Button } from "@chakra-ui/react";

import Help from "../../assets/icon-help.svg";
import Boxes from "/boxes-background.webp";
import Arrow from "../../assets/icon-arrow.svg";

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
          <Image
            src={Help}
            width="128px"
            height="128px"
            filter="
          brightness(0) saturate(100%) invert(70%) sepia(28%) saturate(2698%) hue-rotate(106deg) brightness(99%) contrast(101%);
          "
            objectFit={"cover"}
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
            <Image
              src={Arrow}
              width="24px"
              height="24px"
              transform="rotate(180deg)"
              filter="
            brightness(0) saturate(100%) invert(70%) sepia(28%) saturate(2698%) hue-rotate(106deg) brightness(99%) contrast(101%);
            "
            />
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
