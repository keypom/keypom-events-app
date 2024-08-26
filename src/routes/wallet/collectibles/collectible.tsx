import { Heading, Image, Text, VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { Collectible, fetchCollectibleById } from "@/lib/api/collectibles";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const CollectibleDetails = ({ title, description, imageSrc, bgColor }: Collectible) => {
  return (
    <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
      <Image
        src={imageSrc}
        width={"100%"}
        height={"100%"}
        bg={bgColor}
        borderRadius={"md"}
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

export function CollectiblePage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
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
        backUrl="/wallet/collectibles"
      />
      {isLoading && <LoadingBox />}
      {data && <CollectibleDetails {...data} />}
      {error && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
