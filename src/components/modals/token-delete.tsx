import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  Text,
  VStack,
  HStack,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useTokenDeleteModalStore } from "@/stores/token-delete-modal";
import { useState } from "react";
import eventHelperInstance from "@/lib/event";

export function TokenDeleteModal() {
  const { isOpen, onClose, deletionArgs } = useTokenDeleteModalStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleDelete = async ({
    secretKey,
    dropId,
    getAccountInformation,
  }: {
    secretKey: string;
    dropId: string;
    getAccountInformation: () => Promise<void>;
  }) => {
    try {
      setCurrentStep(1);

      await eventHelperInstance.deleteConferenceDrop({
        secretKey,
        dropId,
      });

      await getAccountInformation();

      setCurrentStep(2);
    } catch (error) {
      setCurrentStep(-1);
      console.error("Error during deletion:", error);
    }
  };

  const onConfirm = () => {
    setCurrentStep(0);
    handleDelete(deletionArgs);
  };

  const onCloseModal = () => {
    setCurrentStep(0);
    onClose();
  };

  function ConfirmDeletion() {
    return (
      <VStack align="stretch" spacing={8}>
        <Text fontSize="3xl" fontWeight="bold">
          Confirm Deletion
        </Text>
        <Text fontSize={"md"}>Are you sure you want to delete this drop?</Text>
        <HStack justify="center" width="100%">
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
          <Button variant="outline" onClick={onCloseModal}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    );
  }
  function ProgressContent() {
    return (
      <VStack align="stretch" spacing={4}>
        <Text fontSize="3xl" fontWeight="bold">
          Deleting Drop
        </Text>
        <Center>
          <Spinner
            color="brand.400"
            h={{ base: "16", md: "20" }}
            mb="6"
            w={{ base: "16", md: "20" }}
          />
        </Center>
        <Text>Please wait while we delete the drop...</Text>
        <Text color="gray.400" size="sm">
          Do not close this window
        </Text>
      </VStack>
    );
  }

  function CompletionContent() {
    return (
      <VStack align="stretch" spacing={4}>
        <Text fontSize="3xl" fontWeight="bold">
          Deletion Complete
        </Text>
        <Text>Drop deleted successfully</Text>
        <Button autoFocus={false} variant={"outline"} onClick={onCloseModal}>
          Close
        </Button>
      </VStack>
    );
  }

  function ErrorContent() {
    return (
      <VStack align="stretch" spacing={4}>
        <Text fontSize="3xl" fontWeight="bold">
          Error
        </Text>
        <Text>There was an error deleting the drop. Please try again.</Text>
        <Button autoFocus={false} variant={"navigation"} onClick={onCloseModal}>
          Close
        </Button>
      </VStack>
    );
  }
  const renderModalBody = () => {
    switch (currentStep) {
      case -1:
        return <ErrorContent />;
      case 0:
        return <ConfirmDeletion />;
      case 1:
        return <ProgressContent />;
      case 2:
        return <CompletionContent />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          fontFamily={"mono"}
          p={6}
          background="black"
          border={"1px solid var(--chakra-colors-brand-400)"}
        >
          {renderModalBody()}
        </ModalContent>
      </Modal>
    </>
  );
}
