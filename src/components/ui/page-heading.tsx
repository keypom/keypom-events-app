import { Heading, VStack, Text, Button, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { ArrowIcon } from "@/components/icons";

interface PageHeadingProps {
  title: string;
  titleSize?: string;
  description?: string;
  showBackButton?: boolean;
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
}

export function PageHeading({
  title,
  titleSize = "32px",
  description,
  showBackButton = false,
  leftChildren,
  rightChildren,
}: PageHeadingProps) {
  const navigate = useNavigate();
  return (
    <VStack
      gap={"1rem"}
      alignItems={"center"}
      justifyContent={"center"}
      w="100%"
      zIndex={4}
    >
      <Heading
        as="h2"
        fontSize={titleSize}
        variant="page-heading"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        position="relative"
        width={"100%"}
      >
        {showBackButton && (
          <Button
            data-testid="back-button"
            onClick={() => navigate(-1)}
            variant="transparent"
            position={"absolute"}
            left={0}
            top={"50%"}
            transform="translate(0, -50%)"
          >
            <ArrowIcon
              width={24}
              height={24}
              color={"var(--chakra-colors-brand-400)"}
              direction="left"
            />
          </Button>
        )}
        {leftChildren && (
          <Box
            position={"absolute"}
            left={0}
            top={"50%"}
            transform="translate(0, -50%)"
          >
            {leftChildren}
          </Box>
        )}
        {rightChildren && (
          <Box
            position={"absolute"}
            right={0}
            top={"50%"}
            transform="translate(0, -50%)"
          >
            {rightChildren}
          </Box>
        )}
        <span>{title}</span>
      </Heading>
      {description && <Text variant={"page-description"}>{description}</Text>}
    </VStack>
  );
}
