import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

export const ModalWrapper = ({ isOpen, onClose, children }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="2xl">
    <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
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
      {children}
    </ModalContent>
  </Modal>
);
