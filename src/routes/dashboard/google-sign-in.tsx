import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons

const GoogleSignInButton = ({
  handleGoogleLoginSuccess,
  handleGoogleLoginError,
}) => {
  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginError}
      theme="filled_black"
      shape="circle"
      logo_alignment="center"
      render={(renderProps) => (
        <Button
          onClick={renderProps.onClick}
          isDisabled={renderProps.disabled}
          bg="#131314"
          border="1px solid"
          borderColor="#8e918f"
          borderRadius="20px"
          h="40px"
          px="12px"
          fontSize="14px"
          fontWeight="500"
          color="#e3e3e3"
          fontFamily="'Roboto', arial, sans-serif"
          display="flex"
          alignItems="center"
          justifyContent="center"
          minWidth="min-content"
          maxWidth="400px"
          transition="background-color 0.218s, border-color 0.218s, box-shadow 0.218s"
          _hover={{
            boxShadow:
              "0 1px 2px 0 rgba(60, 64, 67, 0.30), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
          }}
          _active={{
            boxShadow:
              "0 1px 2px 0 rgba(60, 64, 67, 0.30), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
          }}
          _focus={{
            boxShadow:
              "0 1px 2px 0 rgba(60, 64, 67, 0.30), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
          }}
          _disabled={{
            bg: "#13131461",
            borderColor: "#8e918f1f",
            cursor: "not-allowed",
            opacity: "38%",
          }}
        >
          <Flex alignItems="center" w="100%" justifyContent="center">
            <Box as="span" mr="12px" display="inline-block" h="20px" w="20px">
              <FcGoogle size="20px" />
            </Box>
            <Text>Sign in with Google</Text>
          </Flex>
        </Button>
      )}
    />
  );
};

export default GoogleSignInButton;
