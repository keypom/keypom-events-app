import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  VStack,
  Center,
  Spinner,
  HStack,
  Button,
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
};
const defaultScavengerHunt = [
  {
    piece: `Piece 1`,
    description: "",
  },
  {
    piece: `Piece 2`,
    description: "",
  },
];

interface TokenCreateModalProps {
  existingDropNames: string[];
}

export function TokenCreateModal({ existingDropNames }: TokenCreateModalProps) {
  const {
    isOpen,
    onClose,
    handleClose,
    tokenType: modalType,
  } = useTokenCreateModalStore();

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
    setScavengerPieces(defaultScavengerHunt);
  };

  const handleCreateDrop = async () => {
    if (validateForm(createdDrop, setErrors, existingDropNames)) {
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
              />
            )}
            {modalType === "token" && (
              <>
                <ImageInput
                  createdDrop={createdDrop}
                  setCreatedDrop={setCreatedDrop}
                  errors={errors}
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
              // errors={errors}
            />
            {isLoading ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : (
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
                >
                  Cancel
                </Button>
              </HStack>
            )}
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
}
