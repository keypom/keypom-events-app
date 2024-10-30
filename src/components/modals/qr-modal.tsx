import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  IconButton,
  Text,
  Button,
  ModalFooter,
  HStack,
} from "@chakra-ui/react";

import { useQRModalStore } from "@/stores/qr-modal";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export function QRCodeModal() {
  const {
    isOpen,
    onClose,
    qrCodeUrls,
    qrCodeDescriptions,
    dropName,
    onDownloadAll,
    onDownload,
  } = useQRModalStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQrCodes = qrCodeUrls.length;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQrCodes - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Function to generate filenames
  const generateFilename = (dropName: string, description?: string): string => {
    const baseName = dropName.toLowerCase().replace(/\s+/g, "_");
    if (description && description.trim() !== "" && totalQrCodes > 1) {
      const desc = description.toLowerCase().replace(/\s+/g, "_");
      return `${baseName}_piece_${desc}.png`;
    }
    return `${baseName}.png`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent
        background={"black"}
        maxH="95vh"
        overflowY="auto"
        padding={8}
        borderRadius={"md"}
        border={"1px solid var(--chakra-colors-brand-400)"}
        paddingY={6}
        color={"white"}
      >
        <ModalHeader fontFamily={"mono"} textAlign="center">
          {qrCodeDescriptions[currentIndex] ||
            `QR Code ${currentIndex + 1} of ${totalQrCodes}`}
        </ModalHeader>
        <ModalBody>
          {totalQrCodes > 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={4}
            >
              <img
                src={qrCodeUrls[currentIndex]}
                alt={`QR Code ${currentIndex + 1}`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
              {totalQrCodes > 1 && (
                <HStack justifyContent="center" mt={4}>
                  <IconButton
                    aria-label="Previous QR Code"
                    icon={<ChevronLeftIcon />}
                    onClick={handlePrevious}
                    isDisabled={currentIndex === 0}
                  />
                  <IconButton
                    aria-label="Next QR Code"
                    icon={<ChevronRightIcon />}
                    onClick={handleNext}
                    isDisabled={currentIndex === totalQrCodes - 1}
                  />
                </HStack>
              )}
              <Text fontFamily={"mono"} mt={4} mb={4}>
                {totalQrCodes > 1
                  ? "This is a journey. Scan all QR codes to get the rewards."
                  : "Scan this QR code to get the rewards."}
              </Text>
            </Box>
          ) : (
            <Text>No QR codes available.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          {totalQrCodes > 1 && (
            <Button
              variant="primary"
              mr={3}
              px={16}
              onClick={() => {
                const filenames = qrCodeDescriptions.map((description) =>
                  generateFilename(dropName, description),
                );
                onDownloadAll(qrCodeUrls, filenames);
              }}
            >
              Download All
            </Button>
          )}
          {totalQrCodes > 0 && (
            <Button
              variant="primary"
              mr={3}
              px={12}
              onClick={() => {
                const filename = generateFilename(
                  dropName,
                  qrCodeDescriptions[currentIndex],
                );
                onDownload(qrCodeUrls[currentIndex], filename);
              }}
            >
              Download
            </Button>
          )}
          <Button variant="outline" height={"48px"} onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
