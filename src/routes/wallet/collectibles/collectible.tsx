import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Image as ChakraImage,
} from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";

import { ErrorBox } from "@/components/ui/error-box";
import { Image as AppImage } from "@/components/ui/image";
import { LoadingBox } from "@/components/ui/loading-box";
import { Collectible, fetchCollectibleById } from "@/lib/api/collectibles";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { MULTICHAIN_NETWORKS } from "@/constants/common";
import { LockIcon } from "@/components/icons";
import { useAccountData } from "@/hooks/useAccountData";

const CollectibleDetails = ({
  title,
  description,
  imageSrc,
  isFound,
  chain,
}: Collectible) => {
  const chainInfo = MULTICHAIN_NETWORKS.find((c) => c.name === chain);
  const disabled = !isFound;

  return (
    <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
      <Box position="relative" h="320px" w="100%">
        <AppImage
          src={imageSrc}
          objectFit="contain"
          top={0}
          h="100%"
          w="100%"
          left={0}
          borderRadius="md"
          opacity={disabled ? 0.5 : 1}
          filter="auto"
          blur={disabled ? "8px" : "0px"}
        />
        {disabled && (
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
          <ChakraImage
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
            {chainInfo?.name !== "NEAR" && (
              <Text fontSize="xs" lineHeight={"120%"} color="brand.400">
                Made possible with NEAR Chain Abstraction
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default function CollectiblePage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: accountData,
    isLoading: accountDataLoading,
    isError: isAccountDataError,
    error: accountDataError,
  } = useAccountData();

  const {
    data,
    isLoading: isQueryLoading,
    isError: isQueryError,
    error: queryError,
  } = useQuery({
    queryKey: ["collectible", id, accountData?.accountId],
    queryFn: () => fetchCollectibleById(id!, accountData?.accountId || ""),
    enabled: !!id,
  });
  console.log(data);

  const isLoading = accountDataLoading || isQueryLoading;
  const isError = isAccountDataError || isQueryError;
  const error = isAccountDataError ? accountDataError : queryError;

  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Collectible Details"
        titleSize="16px"
        showBackButton
      />
      {isLoading && <LoadingBox />}
      {data && <CollectibleDetails {...data} />}
      {isError && <ErrorBox message={`Error: ${error?.message}`} />}
    </VStack>
  );
}
