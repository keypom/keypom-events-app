import {
  Flex,
  VStack,
  Heading,
  Text,
  Progress,
  HStack,
  Box,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { ArrowIcon, CheckIcon, LockIcon } from "@/components/icons";
import { Journey } from "@/lib/api/journeys";
import { Image } from "@/components/ui/image";

export const getRewardText = (isDisabled: boolean, tokenReward?: string) => {
  if (isDisabled) return "LIMIT REACHED";

  if (tokenReward) return `REWARD: ${tokenReward} $SOV3`;

  return `REWARD: NFT`;
};

export function JourneyCard({
  id,
  title,
  description,
  imageSrc,
  tokenReward,
  isDisabled,
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
      {/* Wrap the Image and LockIcon in a Box */}
      <Box position="relative" width="100px" height="100px" flexShrink={0}>
        <Image
          src={imageSrc}
          width="100%"
          height="100%"
          objectFit="cover"
          opacity={isDisabled ? 0.5 : 1}
          filter="auto"
          blur={isDisabled ? "8px" : "0px"}
        />
        {isDisabled && (
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
        <HStack spacing={1}>
          <Text color="white" fontSize="10px" fontWeight={700}>
            {getRewardText(isDisabled, tokenReward)}
          </Text>
          <Text color="brand.400" fontSize="10px" fontWeight={700}>
            |
          </Text>
          <Text color="brand.400" fontSize="10px" fontWeight={700}>
            {description}
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
}
