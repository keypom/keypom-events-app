/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Wallet } from "@near-wallet-selector/core";
import { Button, ModalContent, Text, VStack } from "@chakra-ui/react";

// import ProgressModalContent from "./ProgessModalContent";
import CompletionModalContent from "./CompletionModal";
import eventHelperInstance from "@/lib/event";
// import { useTokenDeleteModalStore } from "@/stores/token-delete-modal";

export const performDeletionLogic = async ({
  wallet,
  dropId,
  setAppModal,
  getAccountInformation,
}: {
  wallet: Wallet;
  dropId: string;
  setAppModal: any;
  getAccountInformation: () => Promise<void>;
}) => {
  try {
    // Completion Modal
    // setAppModal({
    //   isOpen: true,
    //   size: "xl",
    //   modalContent: (
    //     <ProgressModalContent
    //       title="Deleting Drop"
    //       progress={0}
    //       message="Please wait while we delete the drop..."
    //     />
    //   ),
    // });

    await eventHelperInstance.deleteConferenceDrop({
      wallet,
      dropId,
    });

    await getAccountInformation();

    // Completion Modal
    setAppModal({
      isOpen: true,
      size: "xl",
      modalContent: (
        <CompletionModalContent
          completionMessage="Drop deleted successfully"
          onClose={() => {
            setAppModal({ isOpen: false });
          }}
        />
      ),
    });
  } catch (error) {
    console.error("Error during deletion:", error);
    // Error Modal
    setAppModal({
      isOpen: true,
      size: "xl",
      modalContent: (
        <ModalContent padding={6}>
          <VStack align="stretch" spacing={4}>
            <Text color="red.500" fontSize="lg" fontWeight="semibold">
              Error
            </Text>
            <Text>There was an error deleting the drop. Please try again.</Text>
            <Button
              autoFocus={false}
              variant="secondary"
              width="full"
              onClick={() => {
                setAppModal({ isOpen: false });
              }}
            >
              Close
            </Button>
          </VStack>
        </ModalContent>
      ),
    });
  }
};
