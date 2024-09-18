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
import { AttendeeManager } from "./attendeeManager";
import { DropManager } from "./dropManager";
import eventHelperInstance from "@/lib/event";
import { jwtDecode } from "jwt-decode";
import { AIRTABLE_WORKER_URL } from "@/constants/common";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import { Header } from "@/components/ui/header";
import GoogleSignInButton from "./google-sign-in";
import ProfileDropdown from "./profile-dropdown";

export function AdminDashboard() {
  const { adminUser, setAdminUser } = useAdminAuthContext();
  const [adminAccount, setAdminAccount] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("main");
  const [isErr, setIsErr] = useState(false);
  const toast = useToast();

  // Step 1: retrieve admin token from google login
  useEffect(() => {
    const storedIdToken = localStorage.getItem("GOOGLE_AUTH_ID_TOKEN");
    if (storedIdToken && isTokenValid(storedIdToken)) {
      const decodedToken: AdminProfile = jwtDecode(storedIdToken);
      setProfile(decodedToken); // Store decoded profile information
      console.log("Decoded token:", decodedToken);
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
    console.error("Login Failed");
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
      setAdminKey(data.secretKey);

      const recoveredAccount = await eventHelperInstance.viewCall({
        methodName: "recover_account",
        args: {
          key_or_account_id: eventHelperInstance.getPubFromSecret(
            data.secretKey,
          ),
        },
      });

      setAdminAccount(recoveredAccount.account_id);
      setIsValidated(recoveredAccount.account_status === "Admin");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setIsErr(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminUser) {
      fetchAdminConnectionData(adminUser.idToken);
    }
  }, [adminUser, fetchAdminConnectionData]);

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        return false;
      }

      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("GOOGLE_AUTH_ID_TOKEN");
    setAdminUser(null);
    setProfile(null); // Clear profile on logout
    setActiveView("main");
    setIsValidated(false);
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
    <Box position="relative" width="100%" minHeight="100vh" bg="bg.primary">
      {/* Header */}
      <Header sendTo="/adminDashboard" />

      <Box
        position="relative"
        width="100%"
        minHeight="100vh"
        zIndex={5}
        px={8}
        _before={{
          content: '""',
          position: "absolute",
          opacity: 0.7,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/assets/background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      >
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
            {activeView === "main" && (
              <VStack spacing={6} align="center" pt="12">
                <Heading fontFamily="mono" color="white" textAlign="center">
                  Admin Dashboard
                </Heading>
                {/* User Profile Dropdown */}
                {profile && (
                  <ProfileDropdown
                    profile={profile}
                    handleLogout={handleLogout}
                  />
                )}
                {/* Dashboard Navigation Cards */}
                <Flex justify="center" gap={8} wrap="wrap">
                  <DashboardCard
                    title="Attendee Dashboard"
                    description="Manage attendees and their event participation."
                    onClick={() => setActiveView("attendee")}
                  />
                  <DashboardCard
                    title="Manage Drops"
                    description="Create and manage token or NFT drops for your event."
                    onClick={() => setActiveView("drops")}
                  />
                </Flex>
              </VStack>
            )}
            {activeView === "attendee" && (
              <AttendeeManager
                setActiveView={setActiveView}
                adminKey={adminKey}
              />
            )}
            {activeView === "drops" && adminKey && adminAccount && (
              <DropManager
                isAdmin={true}
                setIsErr={setIsErr}
                accountId={adminAccount}
                secretKey={adminKey}
                setActiveView={setActiveView}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

const DashboardCard = ({ title, description, onClick }) => (
  <Box
    w="300px"
    p={6}
    borderRadius="lg"
    bg="brand.400"
    boxShadow="lg"
    transition="transform 0.2s"
    _hover={{ transform: "scale(1.05)" }}
    onClick={onClick}
    cursor="pointer"
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
