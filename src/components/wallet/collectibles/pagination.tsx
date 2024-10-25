import { ArrowIcon } from "@/components/icons";
import { Box, HStack, Text } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  setPage: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  setPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the item range being viewed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <HStack
      spacing={2}
      mt={4}
      justifyContent="space-between"
      maxWidth="450px"
      w="100%"
    >
      {/* Left Arrow Box */}
      <Box
        as="button"
        onClick={() => currentPage > 1 && setPage(currentPage - 1)}
        disabled={currentPage === 1}
        border="1px solid"
        borderColor="brand.400"
        color="brand.400"
        bg="transparent"
        _hover={currentPage > 1 ? { bg: "brand.100" } : {}}
        opacity={currentPage === 1 ? 0.5 : 1}
        cursor={currentPage === 1 ? "not-allowed" : "pointer"}
        w="50px"
        h="40px"
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
      >
        <ArrowIcon
          direction="left"
          color={"var(--chakra-colors-brand-400)"}
          width={16}
          height={16}
        />
      </Box>

      {/* Viewing Text */}
      <Text
        fontFamily={"mono"}
        color="brand.400"
        fontSize={"sm"}
        fontWeight={700}
        textAlign={"center"}
      >
        VIEWING {startItem}-{endItem} OF {totalItems}
      </Text>

      {/* Right Arrow Box */}
      <Box
        as="button"
        onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        border="1px solid"
        borderColor="brand.400"
        color="brand.400"
        bg="transparent"
        _hover={currentPage < totalPages ? { bg: "brand.100" } : {}}
        opacity={currentPage === totalPages ? 0.5 : 1}
        cursor={currentPage === totalPages ? "not-allowed" : "pointer"}
        w="50px"
        h="40px"
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
      >
        <ArrowIcon
          direction="right"
          color={"var(--chakra-colors-brand-400)"}
          width={16}
          height={16}
        />
      </Box>
    </HStack>
  );
};
