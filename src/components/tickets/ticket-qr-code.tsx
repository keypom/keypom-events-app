import {
  Box,
  Center,
  Flex,
  Heading,
  Text,
  Image,
  Skeleton,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import QRCode from "react-qr-code";
import eventHelperInstance from "@/lib/event";
import { AttendeeKeyInfo } from "@/lib/helpers/events";
import { useNavigate } from "react-router-dom";
import { useEventCredentials, UserData } from "@/stores/event-credentials";
import { encodeToBase64 } from "@/lib/helpers/crypto";
import { GLOBAL_EVENT_INFO } from "@/constants/eventInfo";
import KeypomLogo from "/assets/keypom-logo.webp";

interface TicketQRCodeProps {
  isLoading: boolean;
  secretKey: string;
  userData: UserData;
}

export default function TicketQRCode({
  isLoading,
  secretKey,
  userData,
}: TicketQRCodeProps) {
  const navigate = useNavigate();
  const { setEventCredentials } = useEventCredentials();
  // State to store dynamic QR code size
  const [qrSize, setQrSize] = useState(200);
  // Effect to check for QR scan and reload if necessary
  useEffect(() => {
    const checkForQRScanned = async () => {
      console.log("Checking for QR scanned: ", secretKey);
      const pubKey = eventHelperInstance.getPubFromSecret(secretKey);
      const keyInfo: AttendeeKeyInfo = await eventHelperInstance.viewCall({
        methodName: "get_key_information",
        args: { key: pubKey },
      });

      if (keyInfo === undefined) {
        throw new Error("Invalid ticket");
      }

      if (keyInfo.has_scanned === true) {
        setEventCredentials(secretKey, userData, false);
        if (keyInfo.account_id === null) {
          navigate("/nameselect");
        } else {
          navigate("/me");
        }
      }
    };

    // Set up an interval to call checkForQRScanned every 3 seconds
    const intervalId = setInterval(checkForQRScanned, 3000);

    // Clean up interval on component unmount or dependency change
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secretKey]);

  const getQRValue = () => {
    return encodeToBase64({ ticket: secretKey, userData });
  };

  useEffect(() => {
    const calculateQrSize = () => {
      const screenHeight = window.innerHeight;
      const minSize = 100; // Minimum QR size
      const maxSize = 300; // Maximum QR size
      const minHeight = 600; // Minimum screen height to start scaling
      const maxHeight = 800; // Maximum screen height to stop scaling

      // Linearly interpolate between minSize and maxSize based on the screen height
      const interpolatedSize =
        ((screenHeight - minHeight) * (maxSize - minSize)) /
          (maxHeight - minHeight) +
        minSize;

      // Clamp the size between minSize and maxSize
      const newSize = Math.min(Math.max(interpolatedSize, minSize), maxSize);

      console.log("Screen height: ", screenHeight, "QR Size: ", newSize);
      setQrSize(newSize);
    };

    // Initial calculation of QR code size
    calculateQrSize();
  }, []);

  return (
    <VStack
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      py="10"
      width="100%"
      spacing={4} // Add some spacing between items
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        px={4}
        width="100%"
        flexGrow={1} // Allow this Box to stretch
      >
        <Heading textAlign="center" color="brand.400" size="lg">
          WELCOME TO {GLOBAL_EVENT_INFO.name}
        </Heading>
        <Heading textAlign="center" size="lg">
          THIS IS YOUR TICKET
        </Heading>
      </Box>

      <Center flexGrow={1}>
        {" "}
        {/* This will also stretch vertically */}
        {isLoading ? (
          <Skeleton height="200px" width="full" />
        ) : (
          <Flex
            align="center"
            flexDir="column"
            p={{ base: "6", md: "8" }}
            flexGrow={1} // Stretch the content inside
            justifyContent="center" // Center the QR code and details
          >
            <Box
              border="1px solid"
              borderColor="brand.400"
              borderRadius="12px"
              mb={{ base: "10", md: "16" }}
              p="2"
              bg="white"
            >
              <QRCode
                value={getQRValue()}
                fgColor="black"
                bgColor="transparent"
                size={qrSize}
              />
            </Box>
            <Text
              color="white"
              fontFamily="heading"
              fontWeight="600"
              mb="4"
              textAlign="center"
            >
              Scan this at the door & gain access to the conference.
            </Text>
            <Text
              color="brand.400"
              fontFamily="body"
              fontWeight="400"
              fontSize="2xs"
              mb="8"
              textAlign="center"
            >
              Keep it open and watch it refresh to reveal the app.
            </Text>
            <Text
              color="gray.400"
              fontFamily="heading"
              fontSize="xs"
              mb="2"
              textAlign="center"
            >
              Developed in partnership with
            </Text>
            <Image
              src={KeypomLogo}
              objectFit={"cover"}
              bgColor={"transparent"}
              position="relative"
              loading="eager"
              width="180px"
            />
          </Flex>
        )}
      </Center>
    </VStack>
  );
}
