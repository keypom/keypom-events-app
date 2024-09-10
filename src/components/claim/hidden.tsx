import { useState } from "react";
import { Box, Heading, Image, VStack, Text } from "@chakra-ui/react";
import { useSwipeable } from "react-swipeable";
import Boxes from "/assets/boxes-background.webp";
import { HelpIcon, ArrowIcon } from "@/components/icons";

interface HiddenProps {
  foundItem: string;
  onReveal: () => void;
}

export function Hidden({ foundItem, onReveal }: HiddenProps) {
  const [swipeProgress, setSwipeProgress] = useState(0);

  // Define the maximum swipe distance (e.g., 100% of the button's width)
  const maxSwipeDistance = 300; // You can adjust this value based on your design

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const newProgress = Math.min(
        Math.max(0, eventData.deltaX),
        maxSwipeDistance,
      );
      setSwipeProgress(newProgress);
    },
    onSwipedRight: () => {
      if (swipeProgress >= maxSwipeDistance) {
        onReveal();
      }
    },
    trackTouch: true,
    trackMouse: false,
  });

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
        {...handlers}
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
          <Heading
            as="h3"
            fontSize="5xl"
            fontFamily="mono"
            fontWeight="bold"
            color="white"
            bg="bg.primary"
            textAlign="left"
            px={2}
          >
            Congrats!
          </Heading>
          <Text
            fontFamily="mono"
            color="brand.400"
            bg="bg.primary"
            textAlign="right"
            alignSelf={"flex-end"}
            fontSize="xl"
            px={2}
            textTransform={"uppercase"}
          >
            You've found {foundItem}
          </Text>
        </VStack>
        <Box p={4} width={"100%"}>
          <Box
            position="relative"
            width={"100%"}
            bg="bg.primary"
            fontFamily={"mono"}
            textTransform={"uppercase"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            height={"48px"}
            color={"white"}
            fontSize="sm"
            borderRadius={"0"}
            overflow="hidden"
            border="2px solid var(--chakra-colors-brand-400)"
          >
            {/* Sliding progress */}
            <Box
              position="absolute"
              bg="var(--chakra-colors-brand-400)"
              height="100%"
              width={`${(swipeProgress / maxSwipeDistance) * 100}%`}
              transition="width 0.1s ease-out"
              left={0}
              top={0}
            />
            <Box zIndex={1} position="relative" width="100%">
              <span>Slide to Reveal & Claim</span>
              <ArrowIcon
                width={24}
                direction="right"
                height={24}
                color={"var(--chakra-colors-brand-400)"}
              />
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
