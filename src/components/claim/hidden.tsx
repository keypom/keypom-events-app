import { useEffect, useState } from "react";
import { Box, Heading, Image, VStack, Text } from "@chakra-ui/react";
import { useSwipeable } from "react-swipeable";
import Boxes from "/assets/boxes-background.webp";
import { HelpIcon, ArrowIcon } from "@/components/icons";
import { DropData } from "@/lib/event";
import { motion, useSpring, useTransform } from "framer-motion";

interface HiddenProps {
  foundItem: DropData;
  numFound: number | undefined;
  numRequired: number | undefined;
  onReveal: () => void;
}

export function Hidden({
  foundItem,
  onReveal,
  numFound,
  numRequired,
}: HiddenProps) {
  const isNFT = foundItem.type === "nft";
  const rewardMessage = () => {
    if (numFound !== numRequired) {
      return "You found a Piece";
    }

    if (numFound !== undefined && numRequired !== undefined) {
      return "You found the pieces";
    }

    if (isNFT) {
      return "You found a POAP";
    }

    return "You found some SOV3";
  };

  const ctaMessage = () => {
    if (numFound !== numRequired) {
      return "Swipe to reveal";
    }
    return "Swipe to reveal and claim";
  };

  const maxSwipeDistance = 30; // Maximum swipe distance
  const [startX, setStartX] = useState(0); // Track where the swipe started

  // Create a spring animation for the swipe progress
  const springProgress = useSpring(0, { stiffness: 1000, damping: 30 });

  // Transform the spring progress to a percentage for the sliding bar
  const slideWidth = useTransform(
    springProgress,
    [0, maxSwipeDistance],
    ["0%", "100%"],
  );

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      // Calculate the swipe distance from the starting point
      const newProgress = Math.min(
        Math.max(0, eventData.deltaX - startX),
        maxSwipeDistance,
      );
      springProgress.set(newProgress);
    },
    onSwipeStart: (eventData) => {
      // Capture the starting point of the swipe
      setStartX(eventData.initial[0]);
    },
    onSwipedRight: () => {
      if (springProgress.get() >= maxSwipeDistance * 0.4) {
        // Trigger the reveal action if the user swiped at least 80% of the max distance
        onReveal();
      } else {
        springProgress.set(0);
      }
    },
    onSwiped: () => {
      if (springProgress.get() < maxSwipeDistance) {
        springProgress.set(0);
      }
    },
    trackTouch: true,
    trackMouse: false,
  });

  useEffect(() => {
    // Prevent default touchmove events to stop the page from scrolling or refreshing
    const preventTouchMove = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });
    return () => document.removeEventListener("touchmove", preventTouchMove);
  }, []);

  return (
    <Box position="relative" p={4}>
      <Image
        src={Boxes}
        width="100%"
        height="100%"
        loading="eager"
        maxH={"calc(100dvh - 170px)"}
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
            {rewardMessage()}
          </Text>
        </VStack>
        <Box p={4} width={"100%"}>
          <Box
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
            position={"relative"}
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
            {/* Sliding progress */}
            <motion.div
              style={{
                position: "absolute",
                background: "var(--chakra-colors-brand-400)",
                height: "100%",
                width: slideWidth,
                left: 0,
                top: 0,
              }}
            />
            <Box
              zIndex={1}
              position="relative"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={"48px"}
              {...handlers}
              style={{ touchAction: "none" }} // Disable touch-action to prevent default behaviors like scrolling or refreshing
            >
              <Text as="span" ms="3">
                {ctaMessage()}
              </Text>
              <Box
                as="span"
                position="absolute"
                left="0"
                top="50%"
                transform="translate(0, -50%)"
                ms="2"
              >
                <ArrowIcon
                  width={24}
                  direction="right"
                  height={24}
                  color={"var(--chakra-colors-brand-400)"}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
