import { Heading, VStack, Text, Image, Button } from "@chakra-ui/react";
import Arrow from "../../assets/icon-arrow.svg";
import { useNavigate } from "react-router-dom";

interface PageHeadingProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
}

export function PageHeading({
  title,
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
        fontSize="2xl"
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
            <Image src={Arrow} width="24px" height="24px" />
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
