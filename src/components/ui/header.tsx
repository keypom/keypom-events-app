import { Box, Flex, Text } from "@chakra-ui/react";
import { Redacted } from "../icons";

export function Header() {
  return (
    <Box
      p={0}
      height="60px"
      background="black"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      bg="black"
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
            as="a"
            href="/"
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            width="100%"
            gap={4}
            textTransform="uppercase"
          >
            <Text
              fontFamily={"'Martin Mono', monospace"}
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
              fontFamily={"'Martin Mono', monospace"}
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
