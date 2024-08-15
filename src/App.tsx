import { useState } from "react";
import {
  Box,
  Image,
  Heading,
  Button,
  Link,
  Text,
  Code,
  VStack,
  Flex,
} from "@chakra-ui/react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <VStack
      spacing={8}
      padding={8}
      justifyContent={"center"}
      minHeight={"100vh"}
    >
      <Box>
        <Link href="https://nearbuilders.org" isExternal>
          <Image
            src="https://builders.mypinata.cloud/ipfs/QmWt1Nm47rypXFEamgeuadkvZendaUvAkcgJ3vtYf1rBFj"
            alt="Near Builders logo"
            width="192px"
            padding="1.5em"
            willChange={"filter"}
            transition={"filter 300ms"}
            _hover={{
              filter: "drop-shadow(0 0 2em #646cffaa)",
            }}
          />
        </Link>
      </Box>
      <Heading>NEAR Builders</Heading>
      <Flex direction={"column"} gap={4} alignItems={"center"}>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <Text>
          Edit <Code>src/App.tsx</Code> and save to test HMR
        </Text>
      </Flex>
      <Text className="read-the-docs">
        Click on the NEAR Builders logo to learn more
      </Text>
    </VStack>
  );
}

export default App;
