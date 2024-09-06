import { Flex, VStack, Heading, Text, Progress } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { ArrowIcon, CheckIcon } from "@/components/icons";
import { Journey } from "@/lib/api/journeys";
import { Image } from "@/components/ui/image";

export function JourneyCard({
  id,
  title,
  description,
  imageSrc,
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
      <VStack alignItems="flex-start" width="100%" gap={4}>
        <Heading
          as="h3"
          variant="journeys.cardTitle"
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
                color="primary"
                direction="right"
              />
            )}
          </span>
        </Heading>
        <Progress value={progress} width="100%" height="4px" />
        <Text variant="journeys.cardDescription">{description}</Text>
      </VStack>
    </Flex>
  );
}
