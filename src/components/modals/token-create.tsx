import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  VStack,
  Spinner,
  HStack,
  Button,
  Box,
} from "@chakra-ui/react";

import { useTokenCreateModalStore } from "@/stores/token-create-modal";
import { useState } from "react";
import { validateForm } from "../dashboard/create-drop-modal/drop-utils";
import { NameInput } from "../dashboard/create-drop-modal/name-input";
import { NFTInformation } from "../dashboard/create-drop-modal/nft-information";
import { ImageInput } from "../dashboard/create-drop-modal/image-input";
import DropTokenAmountSelector from "../dashboard/create-drop-modal/token-amount-select";
import { ScavengerHunt } from "../dashboard/create-drop-modal/scavenger-hunt";

const defaultDrop = {
  name: "",
  artwork: undefined,
  amount: "1",
  nftData: undefined,
  chain: "near", // Default to NEAR
};
const defaultScavengerHunt = [
  {
    piece: `Step 1`,
    description: "",
  },
];

interface TokenCreateModalProps {
  existingDropNames: string[];
  isAdmin: boolean;
}

export function TokenCreateModal({
  existingDropNames,
  isAdmin,
}: TokenCreateModalProps) {
  const {
    isOpen,
    onClose,
    handleClose: handleCloseModal,
    tokenType: modalType,
  } = useTokenCreateModalStore();

  const handleClose = (
    dropCreated: any,
    isScavengerHunt: boolean,
    scavengerHunt: Array<{ piece: string; description: string }>,
    setIsModalLoading: (loading: boolean) => void,
  ) => {
    if (!isLoading) {
      handleCloseModal(
        dropCreated,
        isScavengerHunt,
        scavengerHunt,
        setIsModalLoading,
      );
    }
  };

  const [createdDrop, setCreatedDrop] = useState<{
    name: string;
    artwork?: File;
    amount: string;
    nftData?: {
      title?: string;
      description?: string;
      media?: string;
    };
  }>(defaultDrop);

  const [scavengerPieces, setScavengerPieces] =
    useState<Array<{ piece: string; description: string }>>(
      defaultScavengerHunt,
    );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScavengerHunt, setIsScavengerHunt] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetValues = () => {
    setErrors({});
    setCreatedDrop(defaultDrop);
    setIsScavengerHunt(false);

    // Dynamically generate default scavenger pieces with reset descriptions
    setScavengerPieces([{ piece: `Step 1`, description: "" }]);
  };

  const handleCreateDrop = async () => {
    if (
      validateForm(
        createdDrop,
        setErrors,
        existingDropNames,
        isScavengerHunt,
        scavengerPieces,
      )
    ) {
      await handleClose(
        createdDrop,
        isScavengerHunt,
        scavengerPieces,
        setIsLoading,
      );
      resetValues();
    }
  };
  const handleCancelDrop = () => {
    handleClose(undefined, isScavengerHunt, scavengerPieces, setIsLoading);
    resetValues();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        closeOnEsc={!isLoading}
        closeOnOverlayClick={!isLoading}
      >
        <ModalOverlay />
        <ModalContent
          background={"black"}
          padding={8}
          borderRadius={"md"}
          border={"1px solid var(--chakra-colors-brand-400)"}
          paddingY={6}
          color={"white"}
          position="relative" // Add this line
        >
          <Heading as="h3" marginBottom={6} size="lg">
            Create Drop
          </Heading>
          <VStack align="stretch" spacing={0}>
            <NameInput
              createdDrop={createdDrop}
              setCreatedDrop={setCreatedDrop}
              errors={errors}
              setErrors={setErrors}
            />
            {modalType === "nft" && (
              <NFTInformation
                createdDrop={createdDrop}
                setCreatedDrop={setCreatedDrop}
                errors={errors}
                setErrors={setErrors}
                isAdmin={isAdmin}
              />
            )}
            {modalType === "token" && (
              <>
                <ImageInput
                  createdDrop={createdDrop}
                  setCreatedDrop={setCreatedDrop}
                  errors={errors}
                  setErrors={setErrors} // Pass setErrors here
                />
                <DropTokenAmountSelector
                  currentDrop={createdDrop}
                  setCurrentDrop={setCreatedDrop}
                  errors={errors}
                />
              </>
            )}
            <ScavengerHunt
              isScavengerHunt={isScavengerHunt}
              setIsScavengerHunt={setIsScavengerHunt}
              scavengerPieces={scavengerPieces}
              setScavengerPieces={setScavengerPieces}
              errors={errors}
              setErrors={setErrors}
            />
            <HStack>
              <Button
                variant="primary"
                width="full"
                onClick={() => handleCreateDrop()}
              >
                Create
              </Button>
              <Button
                variant="outline"
                width="full"
                onClick={() => handleCancelDrop()}
                disabled={isLoading} // Disable when loading
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
          {isLoading && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)" // Darken the modal
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={10}
            >
              <Spinner size="lg" />
            </Box>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
