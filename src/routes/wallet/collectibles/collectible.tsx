import { Heading, HStack, Text, VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";

import { ErrorBox } from "@/components/ui/error-box";
import { Image } from "@/components/ui/image";
import { LoadingBox } from "@/components/ui/loading-box";
import { Collectible, fetchCollectibleById } from "@/lib/api/collectibles";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { MULTICHAIN_NETWORKS } from "@/constants/common";

const CollectibleDetails = ({
  title,
  description,
  imageSrc,
  chain,
}: Collectible) => {
  const chainInfo = MULTICHAIN_NETWORKS.find((c) => c.id === chain);

  return (
    <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
      <Image
        src={imageSrc}
        width="100%"
        height="100%"
        aspectRatio={"1/1"}
        objectFit="cover"
        borderRadius="md"
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
        <HStack width="100%" spacing={6} mt={6}>
          <Image
            src={chainInfo?.icon}
            aspectRatio={"1/1"}
            width="50px" // Set width to make the image larger
            height="50px" // Set height to make the image larger
            objectFit="cover"
            borderRadius="md"
          />
          <VStack alignItems="flex-start">
            <Heading
              as="h3"
              fontSize="17px"
              fontFamily={"mono"}
              fontWeight="700"
              color="white"
            >
              Deployed on {chainInfo?.name}
            </Heading>
            <Text fontSize="xs" lineHeight={"120%"} color="brand.400">
              Made possible with NEAR Chain Abstraction
            </Text>
          </VStack>
        </HStack>
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
