import { Box, Heading, Image, VStack, Text } from "@chakra-ui/react";
import Boxes from "/assets/claim-blocks.webp";
import eventHelperInstance, { ExtDropData } from "@/lib/event";

interface RevealProps {
  foundItem: ExtDropData;
  itemCount?: number;
}

export function Reveal({ foundItem, itemCount }: RevealProps) {
  return (
    <Box mt="64px" position="relative" p={4}>
      <Box position="relative">
        <Image
          src={Boxes}
          width="100%"
          height="100%"
          objectFit={"cover"}
          position="relative"
          minW="100%"
          minH="500px"
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
        {/* Conditionally render based on whether it's a token or an NFT */}
        {foundItem.type === "nft" && foundItem.nft_metadata ? (
          <Box
            bg="bg.primary"
            p={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {/* Display the NFT image */}

            <Image
              src={foundItem.nft_metadata.media}
              width="250px"
              height="250px"
              aspectRatio={"1/1"}
              objectFit="cover"
              borderRadius="md"
            />
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
        ) : (
          <Box bg="black" p={4}>
            {/* Display the token amount */}
            <Heading
              as="h3"
              fontSize="108px"
              fontWeight={"bold"}
              textAlign={"center"}
              color={"white"}
            >
              {eventHelperInstance.yoctoToNearWith4Decimals(
                foundItem.amount || "0",
              )}
            </Heading>
            <Heading
              as="h4"
              fontWeight={"normal"}
              textAlign={"center"}
              color={"brand.400"}
              fontSize="52px"
            >
              SOV3
            </Heading>
          </Box>
        )}

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
            Claimed
          </Heading>
        </VStack>
      </VStack>
    </Box>
  );
}
