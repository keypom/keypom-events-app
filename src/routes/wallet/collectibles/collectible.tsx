import { Heading, Text, VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { Collectible, fetchCollectibleById } from "@/lib/api/collectibles";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

const CollectibleDetails = ({ title, description, imageSrc }: Collectible) => {
  return (
    <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
      <ImageWithFallback
        src={imageSrc}
        width={"100%"}
        height={"100%"}
        aspectRatio={"1/1"}
        borderRadius={"md"}
        objectFit={"cover"}
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
      </VStack>
    </VStack>
  );
};

export default function CollectiblePage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["collectible", id],
    queryFn: () => fetchCollectibleById(id!),
    enabled: !!id,
  });

  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Collectible Details"
        titleSize="16px"
        showBackButton
      />
      {isLoading && <LoadingBox />}
      {data && <CollectibleDetails {...data} />}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
