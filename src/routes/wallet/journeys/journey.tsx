import { Flex, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { CheckIcon } from "@/components/icons";
import { PageHeading } from "@/components/ui/page-heading";
import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { useParams } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { useAccountData } from "@/hooks/useAccountData";
import { Journey } from "@/lib/api/journeys";

function Step({
  index,
  description,
  completed,
}: {
  index: number;
  description: string;
  completed: boolean;
}) {
  return (
    <VStack
      width={"100%"}
      alignItems={"flex-start"}
      borderBottom="1px solid var(--chakra-colors-brand-400)"
      py={2}
      gap={0}
    >
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Heading
          as="h3"
          fontSize="md"
          fontFamily={"mono"}
          color={completed ? "brand.400" : "white"}
        >
          Step {index}
        </Heading>
        {completed && (
          <CheckIcon
            width={24}
            height={24}
            color={"var(--chakra-colors-brand-400)"}
          />
        )}
      </Flex>
      <Text fontSize="sm">{description}</Text>
    </VStack>
  );
}

const JourneyDetails = ({
  title,
  description,
  imageSrc,
  steps,
  tokenReward,
}: Journey) => {
  return (
    <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
      {tokenReward ? (
        <HStack mt={4} gap={4} wrap="wrap">
          {/* Token amount */}
          <Heading
            as="h3"
            fontSize="50px"
            fontWeight="bold"
            color="white"
            lineHeight="1"
            isTruncated // Ensures the text is truncated if it's too long
            maxW="100%" // Ensures it wraps if needed
          >
            {tokenReward}
          </Heading>

          {/* Label text (e.g., $SOV3) */}
          <Heading
            as="h4"
            fontWeight="normal"
            textAlign="center"
            color="brand.400"
            fontSize="50px"
            isTruncated // Ensures the text is truncated if it's too long
            maxW="100%" // Ensures it wraps if needed
          >
            $SOV3
          </Heading>
        </HStack>
      ) : (
        <Image
          src={imageSrc}
          width="100%"
          height="100%"
          aspectRatio={"1/1"}
          objectFit="cover"
          borderRadius="md"
        />
      )}
      <VStack alignItems="flex-start" gap={3}>
        <Heading
          as="h3"
          fontSize="20px"
          fontFamily={"mono"}
          fontWeight="700"
          color="white"
        >
          {title}
        </Heading>
        <Text fontSize="xs" lineHeight={"120%"}>
          {description}
        </Text>
        <VStack alignItems="flex-start" gap={4} width={"100%"}>
          {steps.map((step, index) => (
            <Step key={index} {...step} index={index + 1} />
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default function JourneyPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useAccountData();

  // Filter the journey by its ID
  const journey = data?.journeys.find((j: Journey) => j.id === id);

  return (
    <VStack spacing={4} p={4}>
      <PageHeading title="Journey Details" titleSize="16px" showBackButton />
      {isLoading && <LoadingBox />}
      {journey ? (
        <JourneyDetails {...journey} />
      ) : (
        <Text>No journey found.</Text>
      )}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
