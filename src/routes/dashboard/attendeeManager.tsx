import { useEffect, useState, useCallback } from "react";
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
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import { AIRTABLE_WORKER_URL } from "@/constants/common";

interface AttendeeData {
  "Full Name": string;
  "NEAR Account": string;
  Email: string;
  "Type of Participant": string;
  "I consider myself...": string[];
  "Job Title": string;
  "Name of Project or Company": string;
  Country: string;
  "By submitting this form, I acknowledge that I have read and agree to the Privacy Policy. I consent to the collection, use, and disclosure of my personal information in accordance with the policy.";
  "Last Modified": string;
}

export function AttendeeManager({ setActiveView }) {
  const { adminUser } = useAdminAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);

  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<AttendeeData[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [attendeeTypeFilter, setAttendeeTypeFilter] = useState("All");

  const toast = useToast();

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
      } catch (error: any) {
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

  if (isErr) {
    return (
      <NotFound404
        header="Error fetching attendee data"
        subheader="Please try again later."
      />
    );
  }

  return (
    <Box p={8}>
      <>
        <Flex alignItems="center" mb={4}>
          <Heading fontFamily="mono" color="white">
            Attendee Dashboard
          </Heading>
          <Spacer />
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setActiveView("main")}
          >
            Back
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
                attendees.map((attendee) => attendee["Type of Participant"]),
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
        <AttendeeTable attendees={filteredAttendees} isLoading={isLoading} />
      </>
    </Box>
  );
}

const AttendeeTable = ({ attendees, isLoading }) => {
  const columns = [
    {
      id: "fullName",
      title: "Full Name",
      selector: (row) => row["Full Name"] || "N/A",
      loadingElement: <Skeleton height="30px" />,
      sortable: true,
    },
    {
      id: "email",
      title: "Email",
      selector: (row) => row["Email"] || "N/A",
      loadingElement: <Skeleton height="30px" />,
      sortable: true,
    },
    {
      id: "username",
      title: "Username",
      selector: (row) => row["NEAR Account"] || "N/A",
      loadingElement: <Skeleton height="30px" />,
      sortable: true,
    },
    {
      id: "attendeeType",
      title: "Attendee Type",
      selector: (row) => row["Type of Participant"] || "N/A",
      loadingElement: <Skeleton height="30px" />,
      sortable: true,
    },
    {
      id: "ticketSent",
      title: "Ticket Sent",
      selector: (row) => (row["Ticket Sent"] ? "Yes" : "No"),
      loadingElement: <Skeleton height="30px" />,
      sortable: true,
    },
    {
      id: "scannedIn",
      title: "Scanned In",
      selector: (row) => (row["Scanned In"] ? "Yes" : "No"),
      loadingElement: <Skeleton height="30px" />,
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
      loading={isLoading}
      showColumns={true}
      showMobileTitles={["scannedIn"]}
    />
  );
};
