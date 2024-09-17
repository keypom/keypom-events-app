import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Skeleton,
  useToast,
  Button,
  Input,
  Flex,
  Spacer,
  Text,
  HStack,
} from "@chakra-ui/react";
import Select from "react-select"; // Import from react-select
import makeAnimated from "react-select/animated";
import { DataTable } from "@/components/dashboard/table";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import {
  AIRTABLE_WORKER_URL,
  KEYPOM_TOKEN_FACTORY_CONTRACT,
} from "@/constants/common";
import chroma from "chroma-js"; // To handle color manipulation
import { colors } from "@/theme/colors";
import { truncateAddress } from "@/utils/truncateAddress";
import eventHelperInstance from "@/lib/event";

interface AttendeeData {
  "Full Name": string;
  "NEAR Account": string;
  Email: string;
  "Type of Participant": string;
  "I consider myself...": string[];
  "Job Title": string;
  "Name of Project or Company": string;
  Country: string;
  "Conference Public Key": string;
  "By submitting this form, I acknowledge that I have read and agree to the Privacy Policy. I consent to the collection, use, and disclosure of my personal information in accordance with the policy.";
  "Last Modified": string;
}

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];

const animatedComponents = makeAnimated();
// Custom color styles for react-select
const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
    // Make placeholder text the same color as the main text
    borderColor: colors.brand[400],
    color: "white",
    ":hover": {
      borderColor: colors.brand[400],
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "white", // Set the placeholder text color to white
  }),
  option: (styles, { isFocused, isSelected }) => {
    const color = chroma(colors.brand[400]);
    return {
      ...styles,
      backgroundColor: isSelected
        ? colors.brand[600]
        : isFocused
          ? color.alpha(0.1).css()
          : colors.bg.primary,
      color: isSelected ? "white" : colors.brand[400],
      ":hover": {
        backgroundColor: colors.brand[600],
        color: "white",
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(colors.brand[400]);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.brand[400],
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: colors.brand[400],
    ":hover": {
      backgroundColor: colors.brand[600],
      color: "white",
    },
  }),
};

export function AttendeeManager({ setActiveView }) {
  const { adminUser } = useAdminAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);

  console.log(
    "PK: ",
    eventHelperInstance.getPubFromSecret(
      "ed25519:67TvR1fimTfmCeanLbfqNVsRLJBZSwcXDpiGZQPTnEsXMsW1ShhFrFtzMuB338HJ7m4HUpNae4dudCbnuLGwgyiw",
    ),
  );

  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [uniqueAttendeeTypes, setUniqueAttendeeTypes] = useState<string[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<AttendeeData[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [attendeeTypeFilter, setAttendeeTypeFilter] = useState<string[]>([]); // Allow for multiple selections

  const [curPage, setCurPage] = useState(0); // Add current page state
  const [pageSize, setPageSize] = useState(10); // Add page size state
  const [numPages, setNumPages] = useState(0); // Add total number of pages
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
        // Check if data.attendees is an array before calling map
        const attendees = data.attendees;

        if (!Array.isArray(attendees)) {
          throw new Error(
            "Unexpected response format: attendees is not an array",
          );
        }

        // Process attendee data in parallel using Promise.all
        const updatedAttendees = await Promise.all(
          attendees.map(async (attendee) => {
            const pubKey = attendee["Conference Public Key"];
            if (!pubKey) {
              return {
                ...attendee,
                "NEAR Account": "TBD",
                "Scanned In": false,
              };
            }

            // Make the view call for each attendee
            const attendeeInfo = await eventHelperInstance.viewCall({
              methodName: "get_key_information",
              args: {
                key: pubKey,
              },
            });

            if (!attendeeInfo) {
              return {
                ...attendee,
                "NEAR Account": "TBD",
                "Scanned In": false,
              };
            }

            // Return the updated attendee information
            return {
              ...attendee,
              "NEAR Account": attendeeInfo.account_id
                .split(".")[0]
                .substring(KEYPOM_TOKEN_FACTORY_CONTRACT),

              "Scanned In": attendeeInfo.has_scanned,
            };
          }),
        );

        setAttendees(updatedAttendees);
        setFilteredAttendees(updatedAttendees); // Initialize filtered data
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

  // Fetch attendee data when adminUser is available
  useEffect(() => {
    if (adminUser) {
      fetchAttendeeData(adminUser.idToken);
    }
  }, [adminUser, fetchAttendeeData]);

  // Create the unique attendee types only when the attendees array changes
  useEffect(() => {
    const uniqueTypes = Array.from(
      new Set(
        attendees.flatMap((attendee) => attendee["I consider myself..."] || []),
      ),
    );

    setUniqueAttendeeTypes(uniqueTypes); // Save unique types for the dropdown
  }, [attendees]); // Only rerun this effect when `attendees` changes

  // Apply filtering logic across all attendees (before pagination)
  useEffect(() => {
    let filtered = attendees;

    // Apply search query filter across all attendees
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((attendee) =>
        attendee["Full Name"]
          ? attendee["Full Name"].toLowerCase().includes(lowercasedQuery)
          : false,
      );
    }

    // Apply attendee type filter across all attendees
    if (attendeeTypeFilter.length > 0) {
      filtered = filtered.filter(
        (attendee) =>
          Array.isArray(attendee["I consider myself..."]) &&
          attendeeTypeFilter.every((filter) =>
            attendee["I consider myself..."].includes(filter),
          ),
      );
    }
    console.log("Filtered attendees: ", filtered);

    // Update filtered attendees and reset pagination
    setFilteredAttendees(filtered);
    setNumPages(Math.ceil(filtered.length / pageSize)); // Calculate total pages
    setCurPage(0); // Reset to first page when filters change
  }, [searchQuery, attendeeTypeFilter, attendees, pageSize]);

  const handleNextPage = () => {
    setCurPage((prev) => Math.min(prev + 1, numPages - 1));
  };

  const handlePrevPage = () => {
    setCurPage((prev) => Math.max(prev - 1, 0));
  };

  const handlePageSizeChange = (newSize) => {
    if (newSize) {
      setPageSize(newSize);
    }
    setCurPage(0); // Reset to first page when page size changes
  };

  if (isErr) {
    return (
      <NotFound404
        header="Error fetching attendee data"
        subheader="Please try again later."
      />
    );
  }

  const typeOptions = uniqueAttendeeTypes.map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <Box p={8}>
      {/* Filters */}
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
          _placeholder={{ color: "white" }}
          borderColor="brand.400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="300px"
        />
        <Select
          isMulti
          components={animatedComponents}
          options={typeOptions}
          styles={colourStyles}
          placeholder="Filter by attendee type"
          onChange={(selectedOptions) => {
            const values = selectedOptions.map((option) => option.value);
            setAttendeeTypeFilter(values);
          }}
        />
      </Flex>

      {/* Data Table */}
      <AttendeeTable
        attendees={filteredAttendees}
        isLoading={isLoading}
        curPage={curPage}
        pageSize={pageSize}
      />

      {/* Pagination Controls */}
      <Flex justify="space-between" alignItems="center" mt={4}>
        <Button onClick={handlePrevPage} isDisabled={curPage === 0}>
          Previous
        </Button>
        <Text>
          Page {curPage + 1} of {numPages}
        </Text>
        <Button onClick={handleNextPage} isDisabled={curPage + 1 === numPages}>
          Next
        </Button>
      </Flex>

      {/* Page Size Selector */}
      <Flex mt={4} justify="flex-end">
        <HStack>
          <Text mr={2}>Rows per page:</Text>
          <Select
            defaultValue={pageSizeOptions.find(
              (option) => option.value === pageSize,
            )} // Set default value
            options={pageSizeOptions}
            onChange={(selectedOption) =>
              handlePageSizeChange(selectedOption?.value)
            } // Handle change correctly
            placeholder="Rows per page"
            styles={colourStyles} // Apply the styles
          />
        </HStack>
      </Flex>
    </Box>
  );
}

const AttendeeTable = ({ attendees, isLoading, curPage, pageSize }) => {
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
      id: "scannedIn",
      title: "Scanned In",
      selector: (row) => (row["Scanned In"] ? "Yes" : "No"),
      loadingElement: <Skeleton height="30px" />,
      sortable: true,
    },
  ];

  // Apply pagination by slicing the data based on current page and page size
  const paginatedData = attendees.slice(
    curPage * pageSize,
    (curPage + 1) * pageSize,
  );

  const data = paginatedData.map((attendee, index) => ({
    id: index,
    ...attendee,
    "Full Name": truncateAddress(attendee["Full Name"], "end", 20),
    "NEAR Account": truncateAddress(attendee["NEAR Account"], "end", 20),
    Email: truncateAddress(attendee["Email"], "end", 20),
  }));

  return (
    <DataTable
      columns={columns}
      data={data}
      excludeMobileColumns={[]}
      loading={isLoading}
      showColumns={true}
      type="event-attendees"
      showMobileTitles={["scannedIn"]}
    />
  );
};
