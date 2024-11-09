import { CameraSwitchButton } from "@/components/scanner/camera-switch-button";
import { ViewFinder } from "@/components/scanner/view-finder";
import { isTestEnv } from "@/constants/common";
import { Box } from "@chakra-ui/react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ErrorBox } from "../ui/error-box";
import { LoadingOverlay } from "./loading-overlay";

export const QrScanner = ({
  handleScan,
  scanStatus,
  scanDelay = 1000,
  allowMultiple = true,
}: {
  handleScan: (value: string) => Promise<void>;
  scanStatus: "success" | "error" | undefined;
  scanDelay?: number;
  allowMultiple?: boolean;
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined,
  );
  const [showAnimation, setShowAnimation] = useState(false);
  const devices = useDevices();

  // Use refs for scanning logic
  const isScanningRef = useRef(false);
  const isOnCooldownRef = useRef(false);

  // Use state for triggering re-renders
  const [isScanning, setIsScanning] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const variants = {
    open: { x: [0, -50, 50, -50, 50, -50, 50, 0] },
    closed: { x: 0 },
  };

  const enableCooldown = useCallback(() => {
    isOnCooldownRef.current = true; // Set cooldown flag
    setIsOnCooldown(true); // Trigger re-render

    setShowAnimation(true); // Optional: Show animation or overlay

    setTimeout(() => {
      isOnCooldownRef.current = false; // Reset cooldown flag after 3 seconds
      setIsOnCooldown(false); // Trigger re-render
      setShowAnimation(false); // Hide animation or overlay
    }, 3000); // Cooldown duration in milliseconds
  }, []);

  const onScan = useCallback(
    async (result: any) => {
      if (isOnCooldownRef.current || isScanningRef.current) {
        // Ignore scans during cooldown or if already scanning
        return;
      }

      isScanningRef.current = true; // Set scanning flag to true
      setIsScanning(true); // Trigger re-render

      const value = result[0]?.rawValue;

      try {
        await handleScan(value);
      } catch (error) {
        // Handle errors
        console.error(error);
      } finally {
        isScanningRef.current = false; // Reset scanning flag
        setIsScanning(false); // Trigger re-render
        enableCooldown(); // Start cooldown
      }
    },
    [handleScan, enableCooldown],
  );

  const useNextDevice = () => {
    if (devices.length > 0) {
      const currentIndex = devices.findIndex(
        (device) => device.deviceId === selectedDevice,
      );
      const nextIndex = (currentIndex + 1) % devices.length;
      const nextDevice = devices[nextIndex];
      setSelectedDevice(nextDevice.deviceId);
      localStorage.setItem("selectedDeviceId", nextDevice.deviceId);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      localStorage.setItem("selectedDeviceId", selectedDevice);
    }
  }, [selectedDevice]);

  // DO NOT REMOVE: Exposes the triggerTestScan function to the window in test environment
  useEffect(() => {
    if (isTestEnv) {
      // Expose the triggerTestScan function to the window
      (window as any).triggerTestScan = (result) => {
        onScan(result);
      };
    }
    return () => {
      if (isTestEnv) {
        delete (window as any).triggerTestScan;
      }
    };
  }, [onScan]);

  if (!devices) {
    return (
      <Box
        width="100%"
        height="100%"
        maxWidth="300px"
        maxHeight="300px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        aspectRatio="1/1"
        position="relative"
        bg={"bg.primary"}
        z-index={0}
        border="3px solid red"
        borderRadius="1rem"
      >
        <ErrorBox message={"No Camera Found"} />
      </Box>
    );
  }

  return (
    <Box
      as={motion.div}
      variants={variants}
      initial="closed"
      transition="1s linear"
      animate={showAnimation ? "open" : "closed"}
      width="100%"
      height="100%"
      maxWidth="300px"
      maxHeight="300px"
    >
      <Scanner
        onScan={onScan}
        allowMultiple={allowMultiple}
        scanDelay={scanDelay}
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
            <LoadingOverlay
              isVisible={isOnCooldown || isScanning}
              status={scanStatus}
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
            border: `3px solid var(--green, #00EC97)`,
            background: "#00ec97",
            objectFit: "cover",
            aspectRatio: "1/1",
          },
        }}
      />
    </Box>
  );
};
