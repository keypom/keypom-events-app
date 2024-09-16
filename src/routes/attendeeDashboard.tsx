// AttendeeDashboard.js

import { useEffect, useState, useCallback, useContext } from "react";
import {
  Box,
  Heading,
  Skeleton,
  useToast,
  Button,
  Input,
  Select,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { DataTable } from "@/components/dashboard/table";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import { AdminAuthContext } from "@/contexts/AdminAuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { AIRTABLE_WORKER_URL } from "@/constants/common";
import { jwtDecode } from "jwt-decode";

export function AttendeeDashboard() {
  const { adminUser, setAdminUser } = useContext(AdminAuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendeeTypeFilter, setAttendeeTypeFilter] = useState("All");

  const toast = useToast();

  // Function to check if the token is valid (not expired)
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // Convert to seconds
      return decoded.exp > now;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // Function to fetch attendee data
  const fetchAttendeeData = useCallback(
    async (idToken) => {
      try {
        const response = await fetch(`${AIRTABLE_WORKER_URL}/fetch-attendees`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Access denied");
          } else {
            throw new Error("Failed to fetch attendees");
          }
        }

        const data = await response.json();
        console.log("Data: ", data);
        setAttendees(data.attendees);
        setFilteredAttendees(data.attendees); // Initialize filtered data
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching attendees:", error);
        setIsErr(true);
        setIsLoading(false);
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [toast],
  );

  // Retrieve the token from localStorage on app load
  useEffect(() => {
    const storedIdToken = localStorage.getItem("GOOGLE_AUTH_ID_TOKEN");
    if (storedIdToken && isTokenValid(storedIdToken)) {
      setAdminUser({ idToken: storedIdToken });
    } else {
      // Remove invalid or expired token
      localStorage.removeItem("GOOGLE_AUTH_ID_TOKEN");
      setIsLoading(false); // Stop loading if no valid token
    }
  }, [setAdminUser]);

  // Fetch attendee data when adminUser is available
  useEffect(() => {
    if (adminUser) {
      fetchAttendeeData(adminUser.idToken);
    }
  }, [adminUser, fetchAttendeeData]);

  // Filter attendees based on search query and attendee type
  useEffect(() => {
    let filtered = attendees;

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((attendee) =>
        attendee["Full Name"]
          ? attendee["Full Name"].toLowerCase().includes(lowercasedQuery)
          : false,
      );
    }

    if (attendeeTypeFilter !== "All") {
      filtered = filtered.filter(
        (attendee) => attendee["Type of Participant"] === attendeeTypeFilter,
      );
    }

    setFilteredAttendees(filtered);
  }, [searchQuery, attendeeTypeFilter, attendees]);

  const handleLoginSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;

    // Store the idToken in localStorage
    localStorage.setItem("GOOGLE_AUTH_ID_TOKEN", idToken);

    // Set the admin user with ID token
    setAdminUser({ idToken });
  };

  const handleLoginError = () => {
    console.error("Login Failed");
    toast({
      title: "Login failed",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    setIsLoading(false);
  };

  const handleLogout = () => {
    // Remove the idToken from localStorage
    localStorage.removeItem("GOOGLE_AUTH_ID_TOKEN");
    setAdminUser(null);
    setAttendees([]);
    setIsLoading(false);
  };

  if (!adminUser) {
    // User is not authenticated; show the sign-in button
    return (
      <Box
        position={"relative"}
        width="100%"
        minHeight="100vh"
        bg="bg.primary"
        zIndex={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        _before={{
          content: '""',
          position: "absolute",
          opacity: 0.5,
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
        <Box p={8}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </Box>
      </Box>
    );
  }

  if (isErr) {
    return (
      <NotFound404
        cta="Return to homepage"
        header="Error fetching attendee data"
        subheader="Please try again later."
      />
    );
  }

  return (
    <Box
      position={"relative"}
      width="100%"
      minHeight="100dvh"
      bg="bg.primary"
      zIndex={5}
      _before={{
        content: '""',
        position: "absolute",
        opacity: 0.5,
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
      <Box p={8}>
        {isLoading ? (
          <Skeleton height="40px" mb="4" width="200px" />
        ) : (
          <>
            <Flex alignItems="center" mb={4}>
              <Heading fontFamily="mono" color="white">
                Attendee Dashboard
              </Heading>
              <Spacer />
              <Button
                colorScheme="red"
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Flex>
            <Flex mb={4} flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                width="300px"
              />
              <Select
                placeholder="Filter by attendee type"
                value={attendeeTypeFilter}
                onChange={(e) => setAttendeeTypeFilter(e.target.value)}
                width="300px"
              >
                <option value="All">All Types</option>
                {/* Dynamically populate attendee types */}
                {Array.from(
                  new Set(
                    attendees.map(
                      (attendee) => attendee["Type of Participant"],
                    ),
                  ),
                )
                  .filter((type) => type)
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </Select>
            </Flex>
            <AttendeeTable attendees={filteredAttendees} />
          </>
        )}
      </Box>
    </Box>
  );
}

const AttendeeTable = ({ attendees }) => {
  const columns = [
    {
      id: "fullName",
      title: "Full Name",
      selector: (row) => row["Full Name"] || "N/A",
      sortable: true,
    },
    {
      id: "email",
      title: "Email",
      selector: (row) => row["Email"] || "N/A",
      sortable: true,
    },
    {
      id: "username",
      title: "Username",
      selector: (row) => row["NEAR Account"] || "N/A",
      sortable: true,
    },
    {
      id: "attendeeType",
      title: "Attendee Type",
      selector: (row) => row["Type of Participant"] || "N/A",
      sortable: true,
    },
    {
      id: "ticketSent",
      title: "Ticket Sent",
      selector: (row) => (row["Ticket Sent"] ? "Yes" : "No"),
      sortable: true,
    },
    {
      id: "scannedIn",
      title: "Scanned In",
      selector: (row) => (row["Scanned In"] ? "Yes" : "No"),
      sortable: true,
    },
  ];

  const data = attendees.map((attendee, index) => ({
    id: index,
    ...attendee,
  }));

  return (
    <DataTable
      columns={columns}
      data={data}
      excludeMobileColumns={[]}
      loading={false}
      showColumns={true}
      type="attendees"
    />
  );
};
