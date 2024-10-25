import { Box, VStack, Text, Stack, Skeleton, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ColumnItem, DataItem } from "./types";

interface MobileDataTableProps {
  columns: ColumnItem[];
  data: DataItem[];
  loading?: boolean;
  stackedActionCols?: string[];
  excludedCols?: string[];
}

export const MobileDataTable = ({
  columns,
  data,
  loading = false,
  stackedActionCols = [],
  excludedCols = [],
}: MobileDataTableProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Stack spacing={4}>
        {[...Array(3)].map((_, index) => (
          <Box key={index} padding={4} borderWidth={1} borderRadius="md">
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" mb={2} />
            <Skeleton height="20px" />
          </Box>
        ))}
      </Stack>
    );
  }

  const dataRows = columns.filter(
    (row) =>
      (!row.id.includes("action") || stackedActionCols.includes(row.id)) &&
      !excludedCols.includes(row.id),
  );
  const actionRows = columns.filter(
    (row) =>
      row.id.includes("action") &&
      !stackedActionCols.includes(row.id) &&
      !excludedCols.includes(row.id),
  );

  return (
    <VStack spacing={4} align="stretch">
      {data.map((row) => (
        <Box
          key={row.id}
          padding={4}
          borderWidth={1}
          borderRadius="md"
          borderColor="brand.400"
          onClick={
            row.href
              ? () => {
                  navigate(row.href as string);
                }
              : undefined
          }
          _hover={
            row.href
              ? {
                  cursor: "pointer",
                  backgroundColor: "gray.700",
                }
              : {}
          }
          overflowX="auto" // Enable horizontal scroll for rows
          whiteSpace="nowrap" // Prevent text wrapping to ensure everything fits
        >
          <HStack spacing={4} alignItems="center" width="full">
            <VStack w="full" align="stretch">
              {dataRows.map((column) => (
                <Box key={column.id} mb={1} width="100%">
                  <Text
                    fontFamily="mono"
                    fontSize="sm"
                    color="brand.400"
                    textAlign="left"
                  >
                    {column.title}
                  </Text>
                  <Text
                    fontFamily="mono"
                    fontSize="xs"
                    color="white"
                    textAlign="left"
                    overflow="hidden" // Ensure text does not overflow
                    textOverflow="ellipsis" // Show ellipsis if text overflows
                  >
                    {column.selector(row)}
                  </Text>
                </Box>
              ))}
            </VStack>
            {/* Action Buttons */}
            <VStack w="full" align="stretch" spacing={2}>
              {actionRows.map((column) => (
                <Box key={column.id} mt={2} minWidth="fit-content">
                  {column.selector(row)}
                </Box>
              ))}
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};
