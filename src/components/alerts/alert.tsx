import { VStack, Text, Heading, Flex, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { ArrowIcon } from "@/components/icons";

interface AlertProps {
  title?: string;
  description?: string;
  href?: string;
  timeAgo?: string;
}

export function Alert({
  title = "Title of the Alert goes here",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat mauris turpis, vel consequat mi ultricies eu. Quisque ligula neque, placerat ut dui.",
  href = "/",
  timeAgo = "2 days ago",
}: AlertProps) {
  return (
    <VStack
      spacing={2}
      pt={2}
      width="100%"
      alignItems="flex-start"
      gap={4}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        width: "16px",
        height: "2px",
        backgroundImage: "url(/alert-line.webp)",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      }}
    >
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Heading
          as="h3"
          fontSize="14px"
          fontFamily={"mono"}
          color="brand.400"
          display={"flex"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          {title}
        </Heading>
        <Text fontSize="10px" fontWeight="700" color="brand.600">
          {timeAgo}
        </Text>
      </Flex>
      <Text color="white" fontSize="xs">
        {description}
      </Text>
      <Button
        variant="navigation"
        as={Link}
        to={href}
        flexDirection="row"
        padding="4px 8px"
        maxWidth={"max-content"}
        width="100%"
        fontSize="xs"
        background="black"
        border="1px solid var(--chakra-colors-brand-400)"
        color="brand.400"
        gap="8px"
      >
        <span>CUSTOM TITLE LINK</span>
        <ArrowIcon
          direction="right"
          width={8}
          height={8}
          color={"var(--chakra-colors-brand-400)"}
        />
      </Button>
    </VStack>
  );
}
