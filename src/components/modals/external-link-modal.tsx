import {
    Modal,
    ModalOverlay,
    ModalContent,
    Heading,
    VStack,
    HStack,
    Button,
    Text,
    Box,
    Icon,
    useBreakpointValue
  } from "@chakra-ui/react";
  import { FiExternalLink } from "react-icons/fi";
  
  import { useExternalLinkModalStore } from "@/stores/external-link-modal";
  
  export function ExternalLinkModal() {
    const { isOpen, onClose, link} = useExternalLinkModalStore();

    function handleContinue() {
      onClose(); // Close the modal
      window.open(link!, "_blank", "noopener,noreferrer"); // Open link in new tab
    }

    // Function to truncate the link
    const truncateLink = (url) => {
      if(!url) return '';
      if (url.length > 40) {
        return `${url.slice(0, 25)}...${url.slice(-10)}`;
      }
      return url;
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay/>
        <ModalContent
          background="black"
          padding={6}
          borderRadius="lg"
          border="1px solid"
          borderColor="brand.400"
          width="90%"
          maxWidth="400px"       
          marginX="auto"  
          mt="15vh"
        >
        <VStack spacing={4} align="center" textAlign="center">
          <Heading as="h3" fontSize="2xl" fontWeight="bold">
            External Link Found
          </Heading>
          <Box background="gray.800" p={3} borderRadius="md" width="100%">
            <Text fontSize="sm" color="brand.400" wordBreak="break-all">
              {truncateLink(link)}
            </Text>
          </Box>
          <Text fontSize="sm" color="gray.400">
            You will be redirected in a new tab. Proceed with caution!
          </Text>
          <HStack spacing={4} width="100%">
            <Button
              variant="primary"
              outline="green"
              colorScheme="green"
              width="100%"
              // height="48px"
              onClick={handleContinue}
            >
              <Box display="flex" alignItems="center">
                <Icon as={FiExternalLink} mr={2} />
                Continue
              </Box>
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              width="100%"
              // height="48px"
              onClick={onClose}
            >
              Cancel
            </Button>
          </HStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
  }
  