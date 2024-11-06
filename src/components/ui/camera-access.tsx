import {
  Box,
  Button,
  Heading,
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DinoIcon } from "../icons/dino";

export function CameraAccess({ children }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately after checking
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      localStorage.setItem("cameraPermission", "granted");
      setShowInstructions(false);
    } catch {
      setHasPermission(false);
      setShowInstructions(true);
    }
  };

  const handleRetryAccess = () => {
    checkCameraPermission();
  };

  if (hasPermission) {
    // If permission is granted, render children (e.g., QrScanner)
    return children;
  }

  // If permission is denied, render the instruction UI
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1}
    >
      <VStack
        gap={4}
        alignItems="center"
        justifyContent={"center"}
        fontFamily={"mono"}
      >
        <Box width="112px" height="144px" overflow="clip">
          <DinoIcon color={"var(--chakra-colors-brand-400)"} />
        </Box>
        <Heading>Camera Access Required</Heading>
        <Text>We need access to your camera to scan QR codes.</Text>
        <HStack>
          <Button variant="primary" onClick={handleRetryAccess}>
            Retry Access
          </Button>
        </HStack>

        {showInstructions && (
          <Box mt={4} textAlign="left" color="gray.500">
            <Text fontSize="sm">
              If you denied camera access, please follow these steps to enable
              it:
            </Text>
            <UnorderedList mt={2} fontSize="sm" spacing={1}>
              <ListItem>
                <strong>Chrome:</strong>{" "}
                {`Settings > Privacy and Security > Site Settings > Camera, and allow access for this site.`}
              </ListItem>
              <ListItem>
                <strong>Firefox:</strong>{" "}
                {`Click the lock icon in the address bar, select Permissions, and allow camera access.`}
              </ListItem>
              <ListItem>
                <strong>Safari:</strong>{" "}
                {`Settings > Safari > Camera, then set to "Ask" or "Allow".`}
              </ListItem>
            </UnorderedList>
            <Text mt={2} fontSize="sm">
              After updating settings, please reload the page and click "Retry
              Access".
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
