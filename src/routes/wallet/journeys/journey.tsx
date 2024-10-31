import { Box, Flex, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { CheckIcon, LockIcon } from "@/components/icons";
import { PageHeading } from "@/components/ui/page-heading";
import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { useParams } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { useAccountData } from "@/hooks/useAccountData";
import { Journey } from "@/lib/api/journeys";
import { getRewardText } from "@/components/wallet/journeys/card";

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
          width="100%"
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
  isDisabled,
}: Journey) => {
  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title={getRewardText(isDisabled, tokenReward)}
        titleSize="16px"
        sendTo={"/wallet/journeys"}
        showBackButton
      />
      <VStack
        alignItems="flex-start"
        gap={"30px"}
        maxWidth="320px"
        width="100%"
      >
        <Box
          width="100%"
          paddingBottom="100%" // 1:1 aspect ratio
          position="relative"
        >
          <Image
            src={imageSrc}
            position="absolute"
            width="100%"
            height="100%"
            aspectRatio={"1/1"}
            objectFit="cover"
            borderRadius="md"
            opacity={isDisabled ? 0.5 : 1}
            filter="auto"
            blur={isDisabled ? "8px" : "0px"}
          />
          {isDisabled && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={1}
            >
              <LockIcon
                width={24}
                height={24}
                color={"var(--chakra-colors-brand-400)"}
              />
            </Box>
          )}
        </Box>
        <VStack alignItems="flex-start" gap={3} width={"100%"}>
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
    </VStack>
  );
};

export default function JourneyPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useAccountData();

  // Filter the journey by its ID
  const journey = data?.journeys.find((j: Journey) => j.id === id);

  return (
    <>
      {isLoading && <LoadingBox />}
      {journey ? (
        <JourneyDetails {...journey} />
      ) : (
        <Text>No journey found.</Text>
      )}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </>
  );
}
