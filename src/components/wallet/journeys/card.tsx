import { Flex, VStack, Heading, Text, Progress } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { ArrowIcon, CheckIcon } from "@/components/icons";
import { Journey } from "@/lib/api/journeys";
import { Image } from "@/components/ui/image";
import { TokenScavRewardImage } from "./token-scav-image";

export function JourneyCard({
  id,
  title,
  description,
  imageSrc,
  tokenReward,
  steps,
}: Journey) {
  const progress = steps.reduce(
    (acc, step) => (step.completed ? acc + 100 / steps.length : acc),
    0,
  );

  return (
    <Flex
      width="100%"
      gap={4}
      p={2}
      bg="bg.primary"
      borderRadius={"md"}
      as={Link}
      to={`/wallet/journeys/${id}`}
      cursor={"pointer"}
    >
      {tokenReward ? (
        <TokenScavRewardImage
          tokenAmount={tokenReward}
          bgColor="gray.200"
          tokenFontSize="40px"
          labelFontSize="16px"
          tokenColor="black"
          labelColor="black"
        />
      ) : (
        <Image
          src={imageSrc}
          width={"100px"}
          height={"100px"}
          display={"flex"}
          objectFit={"cover"}
          flexShrink={0}
          justifyContent={"center"}
          alignItems={"center"}
        />
      )}
      <VStack alignItems="flex-start" width="100%" gap={4}>
        <Heading
          as="h3"
          fontSize="md"
          fontFamily={"mono"}
          color="white"
          display={"flex"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          <span>{title}</span>
          <span style={{ flexShrink: 0 }}>
            {progress === 100 ? (
              <CheckIcon
                width={24}
                height={24}
                color={"var(--chakra-colors-brand-400)"}
              />
            ) : (
              <ArrowIcon
                width={24}
                height={24}
                color={"white"}
                direction="right"
              />
            )}
          </span>
        </Heading>
        <Progress value={progress} width="100%" height="4px" />
        <Text color="brand.400" fontSize="10px" fontWeight={700}>
          {description}
        </Text>
      </VStack>
    </Flex>
  );
}
