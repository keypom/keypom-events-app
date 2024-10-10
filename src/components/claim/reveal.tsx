import { Box, Heading, VStack, Image } from "@chakra-ui/react";
import eventHelperInstance, { ExtClaimedDrop } from "@/lib/event";
import { ImageSplit } from "./reward-image";
import { TokenScavRewardImage } from "../wallet/journeys/token-scav-image";
import { Image as FallbackImage } from "../ui/image";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";

// Use the GIF file instead of the static image
import TokenAnimation from "/assets/token_anim.gif";

interface RevealProps {
  foundItem: ExtClaimedDrop;
  numFound: number | undefined;
  numRequired: number | undefined;
}

export function Reveal({ foundItem, numFound, numRequired }: RevealProps) {
  const amountToDisplay = eventHelperInstance.yoctoToNearWithMinDecimals(
    foundItem.token_amount || "0",
  );

  const isScavenger = numFound !== undefined && numRequired !== undefined;
  const rewardMessage = () => {
    if (isScavenger) {
      if (numFound === numRequired) {
        return "Claimed";
      }

      return `${numRequired - numFound} Left`;
    }

    return "Claimed";
  };

  const rewardComponent = () => {
    // For NFTs we can just use the image split component
    if ((foundItem.type === "nft" || foundItem.type === "multichain") && foundItem.nft_metadata) {
      return (
        <Box
          bg="bg.primary"
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <ImageSplit numPieces={numRequired || 1} numFound={numFound || 1}>
            <Box borderRadius="12px">
              <FallbackImage
                src={getIpfsImageSrcUrl(foundItem.nft_metadata?.media || "")}
                alt="Masked Image"
                objectFit="cover"
              />
            </Box>
          </ImageSplit>
          <Heading
            as="h4"
            width={"250px"}
            fontWeight={"normal"}
            textAlign={"center"}
            color={"brand.400"}
            fontSize="18px"
            mt={4}
          >
            {foundItem.nft_metadata.title}
          </Heading>
        </Box>
      );
    }

    // For tokens we can use the token image component
    return (
      <TokenScavRewardImage
        tokenAmount={amountToDisplay}
        boxWidth="200px"
        boxHeight="250px"
        bgColor="black"
        labelFontSize="52px"
        tokenColor="white"
        labelColor="brand.400"
      />
    );
  };

  return (
    <Box position="relative" p={4}>
      <Box position="relative">
        {/* Update the image source to use the GIF */}
        <Image
          src={TokenAnimation}
          width="100%"
          height="100%"
          position="relative"
          minW="100%"
          maxH={"calc(100dvh - 170px)"}
          loading="eager"
        />
      </Box>
      <VStack
        position="absolute"
        top="45%"
        left="50%"
        transform="translate(-50%, -50%)"
        width={"100%"}
        p={4}
        spacing={8}
      >
        {rewardComponent()}

        <VStack alignItems="center" gap={0} width={"100%"}>
          <Heading
            as="h3"
            fontSize="5xl"
            fontFamily="mono"
            fontWeight="bold"
            color="white"
            bg="bg.primary"
            textAlign="left"
            textTransform={"uppercase"}
            px={4}
          >
            {rewardMessage()}
          </Heading>
        </VStack>
      </VStack>
    </Box>
  );
}
