import {
  TableContainer,
  Tbody,
  Table,
  type TableProps,
  Tr,
  Td,
  Thead,
  Th,
  Center,
  Text,
  Heading,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { IconBox } from "../icon-box";
import { EMPTY_TABLE_TEXT_MAP } from "./constants";
import { MobileDataTable } from "./mobile-data-table";
import { type ColumnItem, type DataItem } from "./types";

interface DataTableProps extends TableProps {
  type?:
    | "all-drops"
    | "drop-manager"
    | "no-filtered-keys"
    | "no-filtered-drops"
    | "event-manager"
    | "all-tickets"
    | "no-filtered-events"
    | "all-events"
    | "no-filtered-tickets"
    | "create-tickets"
    | "collect-info"
    | "conference-drops"
    | "event-attendees";
  showColumns?: boolean;
  columns: ColumnItem[];
  data: DataItem[];
  loading?: boolean;
  stackedActionCols: string[];
  excludedMobileCols: string[];
}

export const DataTable = ({
  type = "drop-manager",
  showColumns = true,
  columns = [],
  data = [],
  loading = false,
  stackedActionCols = [],
  excludedMobileCols = [],
  ...props
}: DataTableProps) => {
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, lg: false });

  const getDesktopTableBody = () => {
    if (loading) {
      return Array.from([1, 2, 3]).map((_, index) => (
        <Tr key={index}>
          {columns.map((column, colIndex) => (
            <Td
              key={`${column.title}-${index}-${colIndex}`}
              {...column.tdProps}
            >
              {column.loadingElement}
            </Td>
          ))}
        </Tr>
      ));
    }

    return data.map((drop) => (
      <Tr
        key={drop.id}
        _hover={
          (drop.href as string | undefined)
            ? {
                cursor: "pointer",
                background: "gray.50",
              }
            : {}
        }
        onClick={
          (drop.href as string | undefined)
            ? () => {
                navigate(drop.href as string);
              }
            : undefined
        }
      >
        {columns.map((column, i) => (
          <Td key={`${column.id}-${drop.id}-${i}`} {...column.tdProps}>
            {column.selector(drop)}
          </Td>
        ))}
      </Tr>
    ));
  };

  return (
    <>
      {loading || data.length > 0 ? (
        isMobile ? (
          <MobileDataTable
            columns={columns}
            data={data}
            loading={loading}
            stackedActionCols={stackedActionCols}
            excludedCols={excludedMobileCols}
            {...props}
          />
        ) : (
          <TableContainer
            background={"rgba(23, 25, 35, 0.4)"}
            borderRadius="md"
            p={8}
            border={"1px solid var(--chakra-colors-brand-400)"}
            fontFamily={"mono"}
          >
            <Table {...props} borderRadius="12px">
              {showColumns && (
                <Thead>
                  <Tr>
                    {columns.map((col, index) => (
                      <Th
                        color={"white"}
                        key={col.id}
                        fontFamily="body"
                        {...col.thProps}
                        borderTopLeftRadius={
                          index === 0 ? "12px !important" : undefined
                        }
                        borderTopRightRadius={
                          index === columns.length - 1
                            ? "12px !important"
                            : undefined
                        }
                      >
                        {col.title}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
              )}
              <Tbody>{getDesktopTableBody()}</Tbody>
            </Table>
          </TableContainer>
        )
      ) : (
        <IconBox
          h="full"
          mt={{ base: "6", md: "7" }}
          p={{ base: "4", md: "8" }}
          w="full"
        >
          <Center>
            <VStack w="full">
              <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight="600">
                {EMPTY_TABLE_TEXT_MAP[type].heading}
              </Heading>
              <Text fontFamily={"mono"}>{EMPTY_TABLE_TEXT_MAP[type].text}</Text>
            </VStack>
          </Center>
        </IconBox>
      )}
    </>
  );
};
