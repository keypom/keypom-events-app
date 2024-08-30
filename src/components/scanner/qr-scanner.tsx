import { CameraSwitchButton } from "@/components/scanner/camera-switch-button";
import { ViewFinder } from "@/components/scanner/view-finder";
import { Box, useToast } from "@chakra-ui/react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ErrorBox } from "../ui/error-box";
import { LoadingOverlay } from "./loading-overlay";

export const QrScanner = ({
  handleScan,
}: {
  handleScan: (value: string) => Promise<{ message: string } | void>;
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined,
  );
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"success" | "error" | undefined>(
    undefined,
  );
  const [statusMessage, setStatusMessage] = useState<string | undefined>(
    undefined,
  );
  const [showAnimation, setShowAnimation] = useState(false);
  const devices = useDevices();
  const toast = useToast();

  const variants = {
    open: { x: [0, -50, 50, -50, 50, -50, 50, 0] },
    closed: { x: 0 },
  };
  const onScan = async (result) => {
    if (isOnCooldown || isScanning) return;
    setScanStatus(undefined); // Reset status
    setIsScanning(true);
    try {
      const value = result[0].rawValue;
      const response = await handleScan(value);

      onSuccess(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      onError(error);
    } finally {
      setIsScanning(false);
      enableCooldown();
    }
  }

  const enableCooldown = () => {
    setIsOnCooldown(true); // Activate cooldown
    setTimeout(() => {
      setIsOnCooldown(false); // Deactivate cooldown after 1000 milliseconds (1 seconds)
      setShowAnimation(false);
    }, 1000);
  };

  const useNextDevice = () => {
    const currentIndex =
      devices.findIndex((device) => device.deviceId === selectedDevice) || 0;
    setSelectedDevice(devices[currentIndex + (1 % devices.length)]?.deviceId);
  };

  const onError = (error: { message: string }) => {
    setShowAnimation(true);
    setScanStatus("error");
    setStatusMessage(error.message);
  };

  const onSuccess = (result: { message: string } | void) => {
    setScanStatus("success");
    if (result) {
      setStatusMessage(result.message);
    }
  };

  useEffect(() => {
    if (scanStatus) {
      toast({
        title: scanStatus === "success" ? "Success" : "Error",
        description: statusMessage,
        status: scanStatus,
        duration: 5000,
        isClosable: true,
      });
      // Reset the status after showing the message
      setTimeout(() => {
        setScanStatus(undefined);
      }, 5000);
    }
  }, [scanStatus, statusMessage, toast]);

  // DO NOT REMOVE: Exposes the triggerTestScan function to the window in test environment
  useEffect(() => {
    const isTestEnv = import.meta.env.VITE_IS_TEST;
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
        display="flex"
        justifyContent="center"
        alignItems="center"
        aspectRatio="1/1"
        position="relative"
        bg={"black"}
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
    >
      <Scanner
        onScan={onScan}
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
