import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Redacted } from "@/components/icons";

export function Header() {
  return (
    <Box
      p={0}
      height="60px"
      bg="bg.primary"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      borderTopRadius={"md"}
    >
      <header
        style={{
          width: "100%",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          as="nav"
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Flex
            as={Link}
            to="/"
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            width="100%"
            gap={4}
            textTransform="uppercase"
          >
            <Text
              fontFamily="mono"
              textAlign="center"
              fontSize={["xs", "sm"]}
              fontWeight="bold"
              lineHeight="1rem"
              letterSpacing="2.4px"
              color="brand.800"
              flexShrink={0}
            >
              Bangkok
            </Text>
            <Redacted />
            <Text
              fontFamily="mono"
              textAlign="center"
              fontSize={["xs", "sm"]}
              fontWeight="bold"
              lineHeight="1rem"
              letterSpacing="2.4px"
              color="brand.800"
              flexShrink={0}
            >
              Nov9-11
            </Text>
          </Flex>
        </Box>
      </header>
    </Box>
  );
}
