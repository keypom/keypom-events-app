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
} from "@chakra-ui/react";

import { useQRModalStore } from "@/stores/qr-modal";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
export function QRCodeModal() {
  const { isOpen, onClose, qrCodeUrls, onDownloadAll, onDownload } =
    useQRModalStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQrCodes = qrCodeUrls.length;

  const handlePrevious = () => {
    if (totalQrCodes > 1) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + totalQrCodes) % totalQrCodes,
      );
    }
  };

  const handleNext = () => {
    if (totalQrCodes > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalQrCodes);
    }
  };

  return (
    <>
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
          <ModalHeader fontFamily={"mono"}>
            QR Code
            {totalQrCodes > 1
              ? ` (${currentIndex + 1} of ${totalQrCodes})`
              : ""}
          </ModalHeader>
          <ModalBody>
            {totalQrCodes > 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={4}
              >
                {totalQrCodes > 1 ? (
                  <Box display="flex" justifyContent="center" mb={4}>
                    <IconButton
                      aria-label="Previous QR Code"
                      icon={<ChevronLeftIcon />}
                      onClick={handlePrevious}
                      isDisabled={totalQrCodes <= 1}
                      mr={2}
                    />
                    <img
                      src={qrCodeUrls[currentIndex]}
                      alt={`QR Code ${currentIndex + 1}`}
                    />
                    <IconButton
                      aria-label="Next QR Code"
                      icon={<ChevronRightIcon />}
                      onClick={handleNext}
                      isDisabled={totalQrCodes <= 1}
                      ml={2}
                    />
                  </Box>
                ) : (
                  <img src={qrCodeUrls[0]} alt={`QR Code`} />
                )}
                {totalQrCodes === 1 && (
                  <Text fontFamily={"mono"} mt={4} mb={4}>
                    Scan this QR code to get the rewards.
                  </Text>
                )}
                {totalQrCodes > 1 && (
                  <Text mb={4}>
                    This is a scavenger hunt. Scan all QR codes to get the
                    rewards.
                  </Text>
                )}
              </Box>
            ) : (
              <Text>No QR codes available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            {totalQrCodes > 1 && (
              <Button
                variant="primary"
                maxWidth={"fit-content"}
                mr={3}
                onClick={() => onDownloadAll(qrCodeUrls)}
              >
                Download All
              </Button>
            )}
            {totalQrCodes > 0 && (
              <Button
                variant="primary"
                maxWidth={"fit-content"}
                mr={3}
                onClick={() => onDownload(qrCodeUrls[currentIndex])}
              >
                Download
              </Button>
            )}
            <Button
              variant="primary"
              background={"transparent"}
              color={"white"}
              border={"1px solid white"}
              maxWidth={"fit-content"}
              height={"48px"}
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
