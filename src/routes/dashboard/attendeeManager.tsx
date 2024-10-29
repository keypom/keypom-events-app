import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Skeleton,
  useToast,
  Button,
  Input,
  Flex,
  Text,
  HStack,
  Progress, // Import the Progress component from Chakra UI
} from "@chakra-ui/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { DataTable } from "@/components/dashboard/table";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import {
  AIRTABLE_WORKER_URL,
  KEYPOM_TOKEN_FACTORY_CONTRACT,
} from "@/constants/common";
import chroma from "chroma-js";
import { colors } from "@/theme/colors";
import { truncateAddress } from "@/utils/truncateAddress";
import eventHelperInstance from "@/lib/event";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { useEventCredentials } from "@/stores/event-credentials";
import { PageHeading } from "@/components/ui/page-heading";
import { isTokenValid } from "@/routes/dashboard/adminDashboard";

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
  "Scanned In": boolean;
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
    borderColor: colors.brand[400],
    color: "white",
    ":hover": {
      borderColor: colors.brand[400],
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "white",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "white",
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
  multiValue: (styles) => {
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

export function AttendeeManager() {
  const { adminUser, setAdminUser } = useAdminAuthContext();
  const { secretKey: adminKey, isAdmin } = useEventCredentials();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);

  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [uniqueAttendeeTypes, setUniqueAttendeeTypes] = useState<string[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<AttendeeData[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [attendeeTypeFilter, setAttendeeTypeFilter] = useState<string[]>([]);

  const [curPage, setCurPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [numPages, setNumPages] = useState(0);
  const toast = useToast();

  // Progress tracking state variables
  const [progress, setProgress] = useState(0);
  const [isFetchingAttendees, setIsFetchingAttendees] = useState(true);
  const [totalBatches, setTotalBatches] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);

  // Step 1: retrieve admin token from google login
  useEffect(() => {
    const storedIdToken = localStorage.getItem("GOOGLE_AUTH_ID_TOKEN");
    if (storedIdToken && isTokenValid(storedIdToken)) {
      setAdminUser({ idToken: storedIdToken });
    } else {
      localStorage.removeItem("GOOGLE_AUTH_ID_TOKEN");
      navigate("/me/admin");
      setIsLoading(false);
    }
  }, [setAdminUser, navigate]);

  // Function to chunk an array into batches
  function chunkArray(array, size) {
    const result: any = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // Fetch attendee data with batching and progress tracking
  const fetchAttendeeData = useCallback(
    async (idToken) => {
      try {
        setProgress(0);
        setIsFetchingAttendees(true);

        // Fetch the attendee list from Airtable
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
        const attendees = data.attendees;

        if (!Array.isArray(attendees)) {
          throw new Error(
            "Unexpected response format: attendees is not an array",
          );
        }

        // Update progress after fetching attendees list
        setProgress(10);

        // Initialize updatedAttendees with attendees having default values
        const updatedAttendees = attendees.map((attendee) => ({
          ...attendee,
          "NEAR Account": undefined,
          "Scanned In": false,
        }));

        const filteredAttendees = updatedAttendees.filter(
          (attendee) =>
            (attendee["Conference Public Key"] || "") !== "ed25519:INVALID" &&
            (attendee["Ticket Sent"] || "").split(" ").length === 1,
        );

        // Map public keys to their indices in filteredAttendees
        const publicKeyToIndexMap = {};
        const publicKeys: string[] = [];

        filteredAttendees.forEach((attendee, index) => {
          const pubKey = attendee["Conference Public Key"];
          if (pubKey) {
            publicKeyToIndexMap[pubKey] = index;
            publicKeys.push(pubKey);
          }
        });

        // Split public keys into batches of up to 50
        const batches = chunkArray(publicKeys, 50);
        setTotalBatches(batches.length);

        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];

          // Wait for 100ms between each batch
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          // Make the batch view call
          try {
            const attendeesInfo = await eventHelperInstance.viewCall({
              methodName: "get_keys_information",
              args: {
                public_keys: batch,
              },
            });
            // Process the results
            attendeesInfo.forEach((attendeeInfo, index) => {
              const pubKey = batch[index];
              const attendeeIndex = publicKeyToIndexMap[pubKey];
              const attendee = filteredAttendees[attendeeIndex];

              if (attendeeInfo && attendeeInfo.account_id) {
                attendee["NEAR Account"] = attendeeInfo.account_id
                  .split(".")[0]
                  .substring(KEYPOM_TOKEN_FACTORY_CONTRACT.length + 1);
                attendee["Scanned In"] = attendeeInfo.has_scanned;
              }
            });

            // Update progress after each batch
            setCurrentBatch(i + 1);
            const progressPercent = 10 + ((i + 1) / batches.length) * 90; // Remaining 90% of progress
            setProgress(progressPercent);
          } catch (error: any) {
            console.error("Error fetching attendee info:", error);
            console.log("BATCH: ", batch);
          }
        }

        setAttendees(filteredAttendees);
        setFilteredAttendees(filteredAttendees); // Initialize filtered data
        setIsLoading(false);
        setIsFetchingAttendees(false);
        setProgress(100); // Set progress to 100% when done
      } catch (error: any) {
        console.error("Error fetching attendees:", error);
        setIsErr(true);
        setIsLoading(false);
        setIsFetchingAttendees(false);
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
    if (!isAdmin) {
      setIsErr(true);
      setIsLoading(false);
      toast({
        title: "Unauthorized",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    if (adminUser) {
      fetchAttendeeData(adminUser.idToken);
    }
  }, [adminUser, fetchAttendeeData, isAdmin, toast]);

  // Create the unique attendee types only when the attendees array changes
  useEffect(() => {
    const uniqueTypes = Array.from(
      new Set(
        attendees.flatMap((attendee) => attendee["I consider myself..."] || []),
      ),
    );

    setUniqueAttendeeTypes(uniqueTypes); // Save unique types for the dropdown
  }, [attendees]);

  // Apply filtering logic across all attendees (before pagination)
  useEffect(() => {
    let filtered = attendees;

    // Apply search query filter across all attendees
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((attendee) => {
        const fullName = attendee["Full Name"]
          ? attendee["Full Name"].toLowerCase()
          : "";
        const nearAccount = attendee["NEAR Account"]
          ? attendee["NEAR Account"].toLowerCase()
          : "";

        return (
          fullName.includes(lowercasedQuery) ||
          nearAccount.includes(lowercasedQuery)
        );
      });
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
    <Box px={8} py={4}>
      <PageHeading title={`Admin Dashboard`} titleSize="24px" showBackButton />
      {isFetchingAttendees && (
        <Box my={4}>
          <Text mb={2}>
            {currentBatch === 0
              ? "Fetching attendees..."
              : `Getting batch info for ${currentBatch} of ${totalBatches}`}
          </Text>
          <Progress
            hasStripe
            isAnimated
            value={progress}
            colorScheme="teal"
            size="md"
            borderRadius="md"
          />
        </Box>
      )}
      <>
        <Flex my={4} flexWrap="wrap" gap={4} justifyContent="space-between">
          <HStack spacing={4}>
            <Input
              placeholder="Search name or username"
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
              onChange={(selectedOptions: any) => {
                const values = selectedOptions.map((option) => option.value);
                setAttendeeTypeFilter(values);
              }}
            />
          </HStack>
          <HStack ml="auto">
            <Text mr={2}>Rows per page:</Text>
            <Select
              defaultValue={pageSizeOptions.find(
                (option) => option.value === pageSize,
              )}
              options={pageSizeOptions}
              onChange={(selectedOption) =>
                handlePageSizeChange(selectedOption?.value)
              }
              placeholder="Rows per page"
              styles={colourStyles}
            />
          </HStack>
        </Flex>

        {/* Data Table */}
        <AttendeeTable
          attendees={filteredAttendees}
          adminKey={adminKey}
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
          <Button
            onClick={handleNextPage}
            isDisabled={curPage + 1 === numPages}
          >
            Next
          </Button>
        </Flex>
      </>
    </Box>
  );
}

const AttendeeTable = ({
  attendees,
  isLoading,
  curPage,
  pageSize,
  adminKey,
}) => {
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [tokenAmounts, setTokenAmounts] = useState<{ [key: string]: string }>(
    {},
  );
  const toast = useToast();

  const handleSendTokens = async (attendeeId: string) => {
    setSendingTo(attendeeId);
    try {
      const tokenAmount = parseFloat(tokenAmounts[attendeeId] || "0");

      if (tokenAmount <= 0) {
        toast({
          title: "Invalid Token Amount",
          description: "Please enter a valid token amount greater than 0.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Simulate sending tokens logic (replace with actual token sending code)
      await eventHelperInstance.mintConferenceTokens({
        secretKey: adminKey,
        sendTo: attendeeId,
        amount: tokenAmount,
      });

      // Show success toast after sending tokens
      toast({
        title: "Tokens sent",
        description: `Successfully sent ${tokenAmount} tokens to ${attendeeId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset the state after sending tokens
      setSendingTo(null);
      setTokenAmounts({});
    } catch (error) {
      console.error("Error sending tokens", error);

      // Show error toast if token sending fails
      toast({
        title: "Error",
        description: `Failed to send tokens to ${attendeeId}. Please try again.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setSendingTo(null);
    }
  };

  const handleTokenChange = (attendeeId: string, value: string) => {
    // Allow only positive numbers and decimals
    if (!/^\d*\.?\d*$/.test(value)) return;

    setTokenAmounts((prev) => ({
      ...prev,
      [attendeeId]: value,
    }));
  };

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
    {
      id: "action1",
      title: "Send Tokens",
      selector: (row) => {
        const nearAccount = row["NEAR Account"];
        const isNearAccountValid = nearAccount && nearAccount !== "TBD";
        const isCurrentSending = sendingTo === row["NEAR Account"];

        return (
          <HStack>
            {isCurrentSending ? (
              <>
                <Text>Sending...</Text>
                <Spinner size="sm" />
              </>
            ) : (
              <>
                {tokenAmounts[row["NEAR Account"]] !== undefined ? (
                  <>
                    <Input
                      size="sm"
                      width="80px"
                      type="text"
                      value={tokenAmounts[row["NEAR Account"]] || ""}
                      onChange={(e) =>
                        handleTokenChange(row["NEAR Account"], e.target.value)
                      }
                      isDisabled={
                        sendingTo !== null && sendingTo !== row["NEAR Account"]
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSendTokens(row["NEAR Account"])}
                      isDisabled={
                        !isNearAccountValid ||
                        sendingTo !== null ||
                        parseFloat(tokenAmounts[row["NEAR Account"]] || "0") <=
                          0
                      }
                    >
                      ✔️
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      setTokenAmounts({
                        ...tokenAmounts,
                        [row["NEAR Account"]]: "0",
                      })
                    }
                    isDisabled={!isNearAccountValid || sendingTo !== null}
                  >
                    Send Tokens
                  </Button>
                )}
              </>
            )}
          </HStack>
        );
      },
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
      stackedActionCols={[]}
      excludedMobileCols={[]}
      data={data}
      loading={isLoading}
      showColumns={true}
      type="event-attendees"
    />
  );
};
