import {
  Box,
  Heading,
  HStack,
  Image,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RedactedExpression from "/redacted-expression.webp";

import { PageHeading } from "@/components/ui/page-heading";
import { motion } from "framer-motion";
import { CameraSwitchButton } from "@/components/scanner/camera-switch-button";
import { ViewFinder } from "@/components/scanner/view-finder";

export function Scan() {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined,
  );

  const variants = {
    open: { x: [0, -50, 50, -50, 50, -50, 50, 0] },
    closed: { x: 0 },
  };

  const [showAnimation, setShowAnimation] = useState(false);
  const devices = useDevices();
  const navigate = useNavigate();

  const handleError = () => {
    console.log("error");
    setShowAnimation(true);
  };

  // set showAnimation to false after 1 second
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAnimation(false);
    }, 1000);

    return () => clearTimeout(timeout);
  });

  const useNextDevice = () => {
    const currentIndex =
      devices.findIndex((device) => device.deviceId === selectedDevice) || 0;
    setSelectedDevice(devices[currentIndex + (1 % devices.length)]?.deviceId);
  };

  const isValidToken = (value: string) => {
    return value.startsWith("token:");
  };

  if (!devices) {
    return (
      <VStack p={4}>
        <PageHeading title="Scan" />
        <Heading>No Camera Device Found</Heading>
      </VStack>
    );
  }

  return (
    <Box pt={4} display={"flex"} flexDirection={"column"} gap={4}>
      <PageHeading title="Scan" />
      <VStack spacing={8} width="100%">
        <Box
          as={motion.div}
          animate={showAnimation ? "open" : "closed"}
          variants={variants}
          initial="closed"
          transition="1s linear"
          width="100%"
          height="100%"
          position={"relative"}
          px={4}
        >
          <Image
            src={RedactedExpression}
            alt="Redacted Expression"
            width="100%"
            height="220px"
            objectFit={"cover"}
            loading="eager"
            position="absolute"
            top="50%"
            left="0"
            transform="translateY(-50%)"
            zIndex={-1}
          />
          <Scanner
            onScan={(result) => {
              const value = result[0].rawValue;

              if (isValidToken(value)) {
                navigate(`/scan/${value}`);
                return;
              }

              handleError();
            }}
            allowMultiple={true}
            scanDelay={1000}
            components={{
              finder: false,
              audio: false,
            }}
            constraints={{
              deviceId: selectedDevice,
            }}
            children={
              <>
                <ViewFinder />
                <CameraSwitchButton
                  useNextDevice={useNextDevice}
                  devices={devices}
                />
              </>
            }
            styles={{
              container: {
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                position: "relative",
              },
              video: {
                borderRadius: "1rem",
                border: `3px solid ${showAnimation ? "red" : "var(--green, #00EC97)"}`,
                background: "#00ec97",
                objectFit: "cover",
                aspectRatio: "1/1",
              },
            }}
          />
        </Box>
        <HStack
          width="100%"
          justifyContent={"space-between"}
          alignItems="flex-start"
          gap={4}
          px={4}
          wrap={"wrap"}
        >
          <VStack alignItems="flex-start" gap={4}>
            <Heading as="h3" fontSize="2xl" color="white">
              Earn:
            </Heading>
            <UnorderedList color="brand.400" fontFamily="mono">
              <ListItem>Attending Talks</ListItem>
              <ListItem>Visiting Booths</ListItem>
              <ListItem>Scavenger Hunts</ListItem>
              <ListItem>Sponsor Quizzes</ListItem>
              <ListItem>and more.</ListItem>
            </UnorderedList>
          </VStack>
          <VStack alignItems="flex-start" gap={4}>
            <Heading as="h3" fontSize="2xl" color="white">
              Spend:
            </Heading>
            <UnorderedList color="brand.400" fontFamily="mono">
              <ListItem>Swag</ListItem>
              <ListItem>Food</ListItem>
              <ListItem>Raffles</ListItem>
              <ListItem>NFTs</ListItem>
              <ListItem>and more.</ListItem>
            </UnorderedList>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
