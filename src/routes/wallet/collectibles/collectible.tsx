import { VStack, Image, Heading, Text } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";

import CollectibleLogo from "/collectible.webp";

export function Collectible() {
  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Collectible Details"
        titleSize="16px"
        showBackButton
        backUrl="/wallet/collectibles"
      />
      <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
        <Image
          src={CollectibleLogo}
          width={"100%"}
          height={"100%"}
          bg={"brand.400"}
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
            Title of asset here
          </Heading>
          <Text fontSize="xs" lineHeight={"120%"}>
            Here are some instructions on how to retrieve this collectible.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            placerat mauris turpis, vel consequat mi ultricies eu. Quisque
            ligula neque, placerat ut dui.
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
}
