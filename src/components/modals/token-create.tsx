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
import { validateForm } from "../dashboard/CreateDropModal/dropUtils";
import { NameInput } from "../dashboard/CreateDropModal/NameInput";
import { NFTInformation } from "../dashboard/CreateDropModal/NFTInformation";
import { ImageInput } from "../dashboard/CreateDropModal/ImageInput";
import DropTokenAmountSelector from "../dashboard/CreateDropModal/TokenAmountSelector";
import { ScavengerHunt } from "../dashboard/CreateDropModal/ScavengerHunt";

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

export function TokenCreateModal() {
  const {
    isOpen,
    onClose,
    handleClose,
    tokenType: modalType,
  } = useTokenCreateModalStore();

  const [createdDrop, setCreatedDrop] = useState(defaultDrop);
  const [scavengerPieces, setScavengerPieces] =
    useState<Array<{ piece: string; description: string }>>(
      defaultScavengerHunt,
    );

  const [isLoading, setIsLoading] = useState(false);
  const [isScavengerHunt, setIsScavengerHunt] = useState(false);
  const [errors, setErrors] = useState({});

  const resetValues = () => {
    setErrors({});
    setCreatedDrop(defaultDrop);
    setIsScavengerHunt(false);
    setScavengerPieces(defaultScavengerHunt);
  };

  const handleCreateDrop = () => {
    if (validateForm(createdDrop, setErrors)) {
      handleClose(createdDrop, isScavengerHunt, scavengerPieces, setIsLoading);
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
                  variant="primary"
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
