import {
  ModalContent,
  VStack,
  Text,
  Progress,
  Center,
  Spinner,
} from "@chakra-ui/react";

interface ProgressModalContentProps {
  title: string;
  progress: number;
  message: string;
}

const ProgressModalContent = ({
  title,
  progress,
  message,
}: ProgressModalContentProps) => (
  <ModalContent
    padding={6}
    bg="bg.primary"
    border={"1px solid var(--chakra-colors-brand-400)"}
    fontFamily={"mono"}
  >
    <VStack align="stretch" spacing={4}>
      <Text fontSize="lg" fontWeight="semibold">
        {title}
      </Text>
      <Progress hasStripe isAnimated value={progress} />
      <Center>
        <Spinner
          color="brand.400"
          h={{ base: "16", md: "20" }}
          mb="6"
          w={{ base: "16", md: "20" }}
        />
      </Center>
      <Text>{message}</Text>
      <Text color="gray.400" size="sm">
        Do not close this window
      </Text>
    </VStack>
  </ModalContent>
);

export default ProgressModalContent;
