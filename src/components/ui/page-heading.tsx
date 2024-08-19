import { Heading, VStack, Text, Button } from "@chakra-ui/react";
import { ArrowIcon } from "../icons";
import { useNavigate } from "react-router-dom";

interface PageHeadingProps {
  title: string;
  titleSize?: string;
  description?: string;
  showBackButton?: boolean;
}

export function PageHeading({
  title,
  titleSize = "32px",
  description,
  showBackButton = false,
}: PageHeadingProps) {
  const navigate = useNavigate();
  return (
    <VStack gap={4} alignItems={"center"} justifyContent={"center"}>
      <Heading
        as="h2"
        size="lg"
        textTransform={"uppercase"}
        fontWeight={"bold"}
        textAlign={"center"}
        color={"white"}
        fontSize={titleSize}
        width={"100%"}
        letterSpacing={"-0.48px"}
        position={"relative"}
      >
        {showBackButton && (
          <Button
            onClick={() => navigate("/")}
            variant="transparent"
            position={"absolute"}
            left={0}
            top={"50%"}
            transform={"translate(0, -50%)"}
          >
            <ArrowIcon
              width={24}
              height={24}
              color={"var(--chakra-colors-brand-400)"}
              direction="left"
            />
          </Button>
        )}
        <span>{title}</span>
      </Heading>
      {description && (
        <Text
          fontFamily={"mono"}
          fontSize={"sm"}
          fontWeight={700}
          textAlign={"center"}
          color={"brand.400"}
        >
          {description}
        </Text>
      )}
    </VStack>
  );
}
