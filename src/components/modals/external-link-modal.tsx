import {
    Modal,
    ModalOverlay,
    ModalContent,
    Heading,
    VStack,
    HStack,
    Button,
    Text
  } from "@chakra-ui/react";
  
  import { useExternalLinkModalStore } from "@/stores/external-link-modal";
  
  export function ExternalLinkModal() {
    const { isOpen, onClose, link} = useExternalLinkModalStore();
    console.log("link received: ", link)

    function handleClose(){
      console.log("leaving link: ", link)
      onClose()
    }
  
    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
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
            <VStack align="stretch" spacing={0}>
            <Heading as="h3" marginBottom={6} size="lg">External Link Scanned
            </Heading>
            <Text align={"center"} marginBottom={3}>{link}</Text>
              <HStack marginBottom={4}>
                <Button
                  variant="primary"
                  width="full"
                  href = {link!}
                  as="a"
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  width="full"
                  onClick={() => handleClose()}
                >
                  Cancel
                </Button>
              </HStack>
              <Text align={"center"} color={"grey"} >You will be redirected in a new tab. Visit at your own discretion!</Text>
            </VStack>
          </ModalContent>
        </Modal>
      </>
    );
  }
  