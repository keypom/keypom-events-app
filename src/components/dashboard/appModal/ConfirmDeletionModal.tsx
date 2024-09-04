import { ModalContent, VStack, Text, HStack, Button } from "@chakra-ui/react";

interface ConfirmDeletionModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmMessage?: string;
}

const ConfirmDeletionModal = ({
  onConfirm,
  onCancel,
  confirmMessage = "Are you sure you want to delete this item? This action cannot be undone.",
}: ConfirmDeletionModalProps) => (
  <ModalContent
    padding={6}
    background={"black"}
    border={"1px solid var(--chakra-colors-brand-400)"}
    fontFamily={"mono"}
  >
    <VStack align="stretch" spacing={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Confirm Deletion
      </Text>
      <Text>{confirmMessage}</Text>
      <HStack justify="center" width="100%">
        <Button
          background={"red.400"}
          maxWidth={"fit-content"}
          variant="primary"
          onClick={onConfirm}
        >
          Delete
        </Button>
        <Button
          variant="primary"
          background={"transparent"}
          color={"white"}
          border={"1px solid white"}
          maxWidth={"fit-content"}
          height={"48px"}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </HStack>
    </VStack>
  </ModalContent>
);

export default ConfirmDeletionModal;
