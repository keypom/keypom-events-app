import { useEffect, useState, useCallback } from "react";
import {
  Box,
  useToast,
  Spinner, // Ensure Spinner is imported here
} from "@chakra-ui/react";
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { useEventCredentials } from "@/stores/event-credentials";
import { isTokenValid } from "@/routes/dashboard/adminDashboard";
import eventHelperInstance from "@/lib/event";
import { PageHeading } from "@/components/ui/page-heading"; // Ensure this component is imported
import { DropManager } from "./dropManager";

export function AdminCreateDrop() {
  const { adminUser, setAdminUser } = useAdminAuthContext();
  const { secretKey: adminKey, isAdmin } = useEventCredentials();
  const navigate = useNavigate();

  const [adminAccountId, setAdminAccountId] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  // Step 1: retrieve admin token from google login
  useEffect(() => {
    const storedIdToken = localStorage.getItem("GOOGLE_AUTH_ID_TOKEN");
    if (storedIdToken && isTokenValid(storedIdToken)) {
      setAdminUser({ idToken: storedIdToken });
    } else {
      localStorage.removeItem("GOOGLE_AUTH_ID_TOKEN");
      navigate("/me/admin");
      setIsLoading(false);
      return; // Return here to avoid executing further code after navigation
    }
  }, [setAdminUser, navigate]);

  // Step 2: Fetch admin key
  const fetchAdminAccount = useCallback(async () => {
    try {
      const recoveredAccount = await eventHelperInstance.viewCall({
        methodName: "recover_account",
        args: {
          key_or_account_id: eventHelperInstance.getPubFromSecret(adminKey),
        },
      });

      setAdminAccountId(recoveredAccount.account_id);
      if (recoveredAccount.account_status !== "Admin") {
        navigate("/me/admin");
        return; // Return here to avoid executing further code after navigation
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setIsLoading(false);
      navigate("/me/admin");
      return; // Return here to avoid executing further code after navigation
    }
  }, [adminKey, navigate]);

  // Fetch attendee data when adminUser is available
  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      toast({
        title: "Unauthorized",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/me/admin");
      return; // Return here to avoid executing further code after navigation
    }

    if (adminUser && adminKey) {
      fetchAdminAccount();
    }
  }, [isAdmin, adminUser, adminKey, fetchAdminAccount, navigate, toast]);

  if (isLoading || !adminAccountId) {
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
    <Box px={8} py={4}>
      <PageHeading title={`Admin Dashboard`} titleSize="24px" showBackButton />
      <DropManager
        accountId={adminAccountId}
        secretKey={adminKey}
        isAdmin={true}
      />
    </Box>
  );
}
