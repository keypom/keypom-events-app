import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { LockIcon } from "@/components/icons";
import { Link } from "react-router-dom";
import { Collectible } from "@/lib/api/collectibles";

export function CollectibleCard({
  disabled,
  id,
  title,
  assetType,
  imageSrc,
  bgColor,
}: Collectible & {
  disabled?: boolean;
}) {
  return (
    <VStack
      as={Link}
      // handle disabled case
      to={disabled ? "" : `/wallet/collectibles/${id}`}
      spacing={2}
      alignItems={"flex-start"}
      cursor={disabled ? "not-allowed" : "pointer"}
    >
      <Box position="relative">
        <Image
          src={imageSrc}
          width={"100%"}
          height={"100%"}
          bg={bgColor}
          borderRadius={"md"}
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
