import { CameraSwitchButton } from "@/components/scanner/camera-switch-button";
import { ViewFinder } from "@/components/scanner/view-finder";
import { isTestEnv } from "@/constants/common";
import { Box } from "@chakra-ui/react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ErrorBox } from "../ui/error-box";
import { LoadingOverlay } from "./loading-overlay";
import eventHelperInstance from "@/lib/event";

export const QrScanner = ({
  handleScan,
  scanStatus,
  scanDelay = 1000,
  allowMultiple = true,
}: {
  handleScan: (value: string) => Promise<{ message: string } | void>;
  scanStatus: "success" | "error" | undefined;
  scanDelay?: number;
  allowMultiple?: boolean;
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined,
  );
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const devices = useDevices();

  const variants = {
    open: { x: [0, -50, 50, -50, 50, -50, 50, 0] },
    closed: { x: 0 },
  };
  const onScan = async (result) => {
    if (isOnCooldown || isScanning) return;
    setIsScanning(true);
    try {
      const value = result[0].rawValue;
      await handleScan(value);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      eventHelperInstance.debugLog(error, "error");
    } finally {
      setIsScanning(false);
      enableCooldown();
    }
  };

  // Increase the cooldown duration to 5000 milliseconds (5 seconds)
  const enableCooldown = () => {
    setIsOnCooldown(true); // Activate cooldown
    setTimeout(() => {
      setIsOnCooldown(false); // Deactivate cooldown after 5000 milliseconds
      setShowAnimation(false);
    }, scanDelay);
  };

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
      // @ts-expect-error - Expose the triggerTestScan function to the window
      window.triggerTestScan = (result) => {
        onScan(result);
      };
    }
    return () => {
      if (isTestEnv) {
        // @ts-expect-error - Expose the triggerTestScan function to the window
        delete window.triggerTestScan;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            border: `3px solid ${showAnimation ? "red" : "var(--green, #00EC97)"}`,
            background: "#00ec97",
            objectFit: "cover",
            aspectRatio: "1/1",
          },
        }}
      />
    </Box>
  );
};
