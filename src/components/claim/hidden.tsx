import { useEffect, useState } from "react";
import { Box, Heading, Image, VStack, Text } from "@chakra-ui/react";
import { useSwipeable } from "react-swipeable";
import Boxes from "/assets/boxes-background.webp";
import { HelpIcon, ArrowIcon } from "@/components/icons";
import { ExtClaimedDrop } from "@/lib/event";
import { motion, useSpring, useTransform } from "framer-motion";

interface HiddenProps {
  foundItem: ExtClaimedDrop;
  onReveal: () => void;
  isActiveScavengerHunt: boolean;
  numFound: number;
  numRequired: number;
}

export function Hidden({
  foundItem,
  onReveal,
  isActiveScavengerHunt,
  numFound,
  numRequired,
}: HiddenProps) {
  const isNFT = foundItem.type !== "token";

  const piecesLeft = numRequired - numFound;
  const isScavengerHunt = numRequired > 1;
  const isScavengerComplete = isScavengerHunt && numFound === numRequired;

  // Define messages and CTA text based on conditions
  let mainMessage = "";
  let subMessage: string | undefined = undefined;
  let ctaText: React.ReactNode = "";

  if (isActiveScavengerHunt) {
    mainMessage = "COMPLETE";
    ctaText = (
      <>
        <Text as="span" color="brand.400">
          {piecesLeft} Left.
        </Text>
        <Box as="span" width="8px" /> {/* Adjust width as needed */}
        Swipe to continue
      </>
    );
  } else {
    mainMessage = "Congrats!";
    if (!isScavengerHunt || isScavengerComplete) {
      subMessage = isNFT ? "You found a POAP" : "You found some SOV3";
      ctaText = "Swipe to reveal and claim";
    } else {
      subMessage = "You found a Piece";
      ctaText = "Swipe to reveal";
    }
  }

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
      const newProgress = Math.min(
        Math.max(0, eventData.deltaX - startX),
        maxSwipeDistance,
      );
      springProgress.set(newProgress);
    },
    onSwipeStart: (eventData) => {
      setStartX(eventData.initial[0]);
    },
    onSwipedRight: () => {
      if (springProgress.get() >= maxSwipeDistance * 0.4) {
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

  // Define box dimensions
  const boxDimensions = isActiveScavengerHunt
    ? {
        width: { base: "210px", md: "273px", lg: "273px" },
        height: { base: "194px", md: "250px", lg: "250px" },
      }
    : {
        width: { base: "170px", md: "190px" },
        height: { base: "170px", md: "190px" },
      };

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
        {/* Top Box */}
        <Box
          bg="bg.primary"
          w={boxDimensions.width}
          h={boxDimensions.height}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {isActiveScavengerHunt ? (
            <VStack>
              <Heading
                as="h4"
                fontWeight="normal"
                textAlign="center"
                color="brand.400"
                fontSize={{ base: "50px", md: "48px", lg: "52px" }}
                mt={1}
              >
                STEP
              </Heading>
              <Heading
                as="h3"
                fontSize={{ base: "80px", md: "130px", lg: "108px" }}
                fontWeight="bold"
                color="white"
                lineHeight="1.1"
                textAlign="center"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {numFound}
              </Heading>
            </VStack>
          ) : (
            <HelpIcon
              width={128}
              height={128}
              color={"var(--chakra-colors-brand-400)"}
            />
          )}
        </Box>

        {/* Message Section */}
        <VStack
          alignItems={isActiveScavengerHunt ? "center" : "flex-start"}
          gap={0}
          width={"100%"}
        >
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
            {mainMessage}
          </Heading>
          {subMessage && (
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
              {subMessage}
            </Text>
          )}
        </VStack>

        {/* Swipe Section */}
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
              <Text as="span" ms="3" display="flex" alignItems="center">
                {ctaText}
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
