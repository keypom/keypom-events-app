import { CameraSwitchButton } from "@/components/scanner/camera-switch-button";
import { ViewFinder } from "@/components/scanner/view-finder";
import { Box } from "@chakra-ui/react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ErrorBox } from "../ui/error-box";

export const QrScanner = ({ handleScan }: {
  // Method to handle the scan event, return false if error to show error animation
  handleScan: (value: string) => boolean | void;
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined,
  );

  const variants = {
    open: { x: [0, -50, 50, -50, 50, -50, 50, 0] },
    closed: { x: 0 },
  };

  const [showAnimation, setShowAnimation] = useState(false);
  const devices = useDevices();

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

  const onError = () => {
    setShowAnimation(true);
  }

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
        onScan={(result) => {
          const value = result[0].rawValue;
          const isSuccesfulScan = handleScan(value);
          if (!isSuccesfulScan) {
            console.log("Unsuccessful scan");
            onError();
          }
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
  );
};
