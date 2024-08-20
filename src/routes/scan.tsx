import {
  Button,
  VStack,
  Image,
  HStack,
  ListItem,
  UnorderedList,
  Heading,
  Box,
} from "@chakra-ui/react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import RedactedExpression from "/redacted-expression.webp";

import { PageHeading } from "@/components/ui/page-heading";
import { FlipIcon } from "@/components/icons";

const CameraSwitchButton = ({
  useNextDevice,
  devices,
}: {
  useNextDevice: () => void;
  devices: MediaDeviceInfo[];
}) => {
  return (
    <Button
      onClick={useNextDevice}
      background="brand.400"
      color="black"
      borderRadius={"lg"}
      padding="0px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position={"absolute"}
      bottom="1rem"
      right="1rem"
      hidden={devices.length < 2}
      _hover={{
        background: "brand.400",
        color: "black",
      }}
      _active={{
        background: "brand.400",
        color: "black",
      }}
    >
      <FlipIcon width={24} height={24} color={"black"} />
    </Button>
  );
};

export function Scan() {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined,
  );
  const devices = useDevices();
  const navigate = useNavigate();

  const useNextDevice = () => {
    const currentIndex =
      devices.findIndex((device) => device.deviceId === selectedDevice) || 0;
    setSelectedDevice(devices[currentIndex + (1 % devices.length)]?.deviceId);
  };

  return (
    <Box p={4} display={"flex"} flexDirection={"column"} gap={4}>
      <PageHeading title="Scan" />
      <VStack spacing={8}>
        <Scanner
          onScan={(result) => {
            navigate(`/scan/${result[0].rawValue}`);
          }}
          components={{
            finder: false,
            audio: false,
          }}
          constraints={{
            deviceId: selectedDevice,
          }}
          children={
            <CameraSwitchButton
              useNextDevice={useNextDevice}
              devices={devices}
            />
          }
          styles={{
            container: {
              width: "320px",
              height: "320px",
              position: "relative",
            },
            video: {
              borderRadius: "1rem",
              border: "3px solid var(--green, #00EC97)",
              background: "#00ec97",
              objectFit: "cover",
            },
          }}
        />
        <Image
          src={RedactedExpression}
          alt="Redacted Expression"
          width="100%"
          height="220px"
          objectFit={"cover"}
          loading="eager"
          position="absolute"
          top="0"
          left="0"
          transform="translateY(50%)"
          zIndex={-1}
        />
        <HStack alignItems="flex-start" gap={4} wrap={"wrap"}>
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
