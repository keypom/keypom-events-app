import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  useToast,
  Spinner,
  Text,
  Flex,
} from "@chakra-ui/react";
import { AdminProfile, useAdminAuthContext } from "@/contexts/AdminAuthContext";
import eventHelperInstance from "@/lib/event";
import { jwtDecode } from "jwt-decode";
import { AIRTABLE_WORKER_URL } from "@/constants/common";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import GoogleSignInButton from "./google-sign-in";
import ProfileDropdown from "./profile-dropdown";
import { PageHeading } from "@/components/ui/page-heading";
import { useEventCredentials } from "@/stores/event-credentials";
import { useNavigate } from "react-router-dom";

export const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
      return false;
    }

    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    eventHelperInstance.debugLog(`Error decoding token: ${error}`, "error");
    return false;
  }
};

export function AdminDashboard() {
  const { adminUser, setAdminUser } = useAdminAuthContext();
  const navigate = useNavigate();
  const { setEventCredentials } = useEventCredentials();

  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const toast = useToast();

  // Step 1: retrieve admin token from google login
  useEffect(() => {
    const storedIdToken = localStorage.getItem("GOOGLE_AUTH_ID_TOKEN");
    if (storedIdToken && isTokenValid(storedIdToken)) {
      const decodedToken: AdminProfile = jwtDecode(storedIdToken);
      setProfile(decodedToken); // Store decoded profile information
      eventHelperInstance.debugLog(`Decoded token: ${decodedToken}`, "log");
      setAdminUser({ idToken: storedIdToken });
    } else {
      localStorage.removeItem("GOOGLE_AUTH_ID_TOKEN");
      setIsLoading(false);
    }
  }, [setAdminUser]);

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;
    localStorage.setItem("GOOGLE_AUTH_ID_TOKEN", idToken);
    const decodedToken: AdminProfile = jwtDecode(idToken);
    setProfile(decodedToken); // Store decoded profile information
    setAdminUser({ idToken });
  };

  const handleGoogleLoginError = () => {
    eventHelperInstance.debugLog("Login Failed", "error");
    setIsErr(true);
    toast({
      title: "Login failed",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  // Step 2: Fetch admin key
  const fetchAdminConnectionData = useCallback(async (idToken) => {
    try {
      const response = await fetch(`${AIRTABLE_WORKER_URL}/fetch-admin-login`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Access denied");
      }

      const data = await response.json();

      const recoveredAccount = await eventHelperInstance.viewCall({
        methodName: "recover_account",
        args: {
          key_or_account_id: eventHelperInstance.getPubFromSecret(
            data.secretKey,
          ),
        },
      });

      setIsValidated(recoveredAccount.account_status === "Admin");
      if (recoveredAccount.account_status === "Admin") {
        setEventCredentials(data.secretKey, { name: "Admin", email: "" }, true);
      }
      setIsLoading(false);
    } catch (error) {
      eventHelperInstance.debugLog(
        `Error fetching admin data: ${error}`,
        "error",
      );
      setIsErr(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminUser) {
      fetchAdminConnectionData(adminUser.idToken);
    }
  }, [adminUser, fetchAdminConnectionData]);

  const handleLogout = () => {
    localStorage.removeItem("GOOGLE_AUTH_ID_TOKEN");
    setAdminUser(null);
    setProfile(null); // Clear profile on logout
    setIsValidated(false);
    setEventCredentials("", { name: "", email: "" }, false);
  };

  if (isErr) {
    return (
      <NotFound404
        cta="Back"
        header="Account Unauthorized"
        subheader="Check the signed-in account and try again later."
        onClick={() => {
          handleLogout();
          window.location.reload();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <Box
        position="relative"
        width="100%"
        minHeight="100vh"
        bg="bg.primary"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title={`Admin Dashboard`}
        titleSize="24px"
        showBackButton
        sendTo="/me"
      />
      {!adminUser || !isValidated ? (
        <VStack spacing={4} pt="12">
          <Heading fontFamily="mono" color="white">
            Admin Login
          </Heading>
          <GoogleSignInButton
            handleGoogleLoginSuccess={handleGoogleLoginSuccess}
            handleGoogleLoginError={handleGoogleLoginError}
          />
        </VStack>
      ) : (
        <>
          <VStack spacing={6} align="center" pt="12" px="2">
            {profile && (
              <ProfileDropdown profile={profile} handleLogout={handleLogout} />
            )}
            {/* Dashboard Navigation Cards */}
            <Flex justify="center" gap={8} wrap="wrap">
              <DashboardCard
                title="Attendee Dashboard"
                description="Manage attendees and their event participation."
                onClick={() => navigate("/me/admin/attendees")}
              />
              <DashboardCard
                title="Manage Drops"
                description="Create and manage token or NFT drops for your event."
                onClick={() => navigate("/me/admin/drops")}
              />
            </Flex>
          </VStack>
        </>
      )}
    </VStack>
  );
}

const DashboardCard = ({ title, description, onClick }) => (
  <Box
    as={Flex}
    alignItems="center"
    cursor="pointer"
    bg="brand.400"
    px={3}
    borderRadius="md"
    py={2}
    boxShadow="sm"
    _hover={{ bg: "brand.600" }}
    onClick={onClick}
    transition="background-color 0.3s ease"
  >
    <VStack spacing={4} align="start">
      <Heading
        as="h3"
        fontSize="20px"
        fontFamily={"mono"}
        fontWeight="700"
        color="bg.primary"
      >
        {title}
      </Heading>

      <Text fontSize="md" lineHeight={"120%"} color="bg.primary">
        {description}
      </Text>
      <Button
        bg="bg.primary"
        variant="solid"
        width="full"
        _hover={{ bg: "bg.primary" }}
      >
        Open
      </Button>
    </VStack>
  </Box>
);
