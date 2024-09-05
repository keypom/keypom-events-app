import { Box, Heading, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import { LockIcon } from "@/components/icons";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Collectible } from "@/lib/api/collectibles";
import { FALLBACK_IMAGE_URL } from "@/constants/common";

export function CollectibleCard({
  disabled,
  id,
  title,
  assetType,
  imageSrc,
}: Collectible & {
  disabled?: boolean;
}) {
  const imageStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    borderRadius: "md",
    opacity: disabled ? 0.5 : 1,
    filter: "auto",
    blur: disabled ? "8px" : "0px",
  };

  const [loading, setLoading] = useState(true);

  return (
    <VStack
      as={Link}
      to={disabled ? "" : `/wallet/collectibles/${id}`}
      spacing={2}
      alignItems={"flex-start"}
      cursor={disabled ? "not-allowed" : "pointer"}
    >
      <Box
        width="100%"
        paddingBottom="100%" // This creates a 1:1 aspect ratio
        position="relative"
        maxWidth="210px"
        maxHeight="210px"
      >
        <Skeleton isLoaded={!loading} {...imageStyles}>
          <Image
            src={imageSrc}
            fallbackSrc={FALLBACK_IMAGE_URL}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            {...imageStyles}
          />
        </Skeleton>
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
      <VStack alignItems="flex-start" gap={0}>
        <Heading as="h3" fontSize="sm" fontFamily={"mono"} color="white">
          {title}
        </Heading>
        <Text color="brand.400" fontSize="10px" fontWeight={700}>
          {assetType}
        </Text>
      </VStack>
    </VStack>
  );
}
