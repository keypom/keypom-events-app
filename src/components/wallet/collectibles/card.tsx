import { Box, Heading, Image as ChakraImage, VStack } from "@chakra-ui/react";
import { LockIcon } from "@/components/icons";
import { Link } from "react-router-dom";
import { Image as AppImage } from "@/components/ui/image";
import { MULTICHAIN_NETWORKS } from "@/constants/common";
import { Collectible } from "@/lib/api/collectibles";

export function CollectibleCard({
  disabled,
  id,
  title,
  imageSrc,
  chain,
}: Collectible & {
  disabled?: boolean;
}) {
  const chainInfo = MULTICHAIN_NETWORKS.find((c) => c.name === chain);
  return (
    <VStack
      as={Link}
      to={`/wallet/collectibles/${id}`}
      spacing={2}
      alignItems={"flex-start"}
      cursor={disabled ? "not-allowed" : "pointer"}
      maxW="210px"
    >
      <Box
        width="100%"
        paddingBottom="100%" // 1:1 aspect ratio
        position="relative"
        maxWidth="210px"
        maxHeight="210px"
      >
        <AppImage
          src={imageSrc}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
          borderRadius="md"
          opacity={disabled ? 0.5 : 1}
          bgColor={disabled ? "gray.200" : "transparent"}
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
        {/* Chain Icon Positioned at Bottom Right with Tooltip */}
        {chainInfo && (
          <ChakraImage
            src={chainInfo.icon}
            alt={chainInfo.name}
            bgColor="transparent"
            position="absolute"
            bottom="1"
            right="1"
            boxSize="24px"
            zIndex={2}
            filter="auto"
            borderRadius="md"
          />
        )}
      </Box>
      <VStack alignItems="flex-start" gap={0} width="100%">
        <Heading
          as="h3"
          fontSize="sm"
          fontFamily="mono"
          color="white"
          noOfLines={2}
          width="100%"
          lineHeight="1.25em"
          minHeight="2.5em"
          maxHeight="2.5em"
        >
          {title}
        </Heading>
      </VStack>
    </VStack>
  );
}
