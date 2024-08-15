import { Box, Container, Flex, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <Container maxW={"container.sm"} p={0}>
      <header>
        <Box as="nav" m={4}>
          <Flex
            as="a"
            href="/"
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            textTransform="uppercase"
            gap={4}
          >
            <Text fontSize="sm">Bangkok</Text>
            <Text fontSize="2xl">(Redacted)</Text>
            <Text fontSize="sm">Nov9-11</Text>
          </Flex>
        </Box>
      </header>
    </Container>
  );
}
