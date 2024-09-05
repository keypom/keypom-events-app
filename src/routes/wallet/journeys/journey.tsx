import {
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { CheckIcon } from "@/components/icons";
import { PageHeading } from "@/components/ui/page-heading";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { fetchJourneyById, Journey } from "@/lib/api/journeys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

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
      p={2}
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
  bgColor,
  steps,
}: Journey) => {
  const imageStyles = {
    width: "100%",
    height: "100%",
    aspectRatio: "1/1",
    borderRadius: "md",
    objectFit: "cover" as const,
  };

  return (
    <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
      <Image
        src={imageSrc}
        {...imageStyles}
        bg={bgColor}
        fallback={
          <Box
            {...imageStyles}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner size="xl" />
          </Box>
        }
      />
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["journey", id],
    queryFn: () => fetchJourneyById(id!),
    enabled: !!id,
  });

  return (
    <VStack spacing={4} p={4}>
      <PageHeading title="Journey Details" titleSize="16px" showBackButton />
      {isLoading && <LoadingBox />}
      {data && <JourneyDetails {...data} />}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
