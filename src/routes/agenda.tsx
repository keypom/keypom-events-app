import { Button, Heading, Box, VStack, Input, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { filterAgenda } from "@/lib/agenda";
import { PageHeading } from "@/components/ui/page-heading";
import {
  SearchIcon,
  FilterIcon,
  Chevron,
  CheckedIcon,
  SquareIcon,
} from "@/components/icons";
import { AgendaList } from "@/components/agenda/agenda-list";
import { agendaData } from "@/constants/agenda";

function FilterTitle({
  title,
  isOpen,
  handleFilterOpen,
}: {
  title: string;
  isOpen: boolean;
  handleFilterOpen?: () => void;
}) {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={2}
      borderRadius="4px"
      bg="#F2F1EA"
      width="100%"
      cursor="pointer"
      onClick={handleFilterOpen}
    >
      <Heading as="h4" fontSize="md" fontFamily="mono" color="brand.600">
        Filter by: <span style={{ color: "#000" }}>{title}</span>
      </Heading>
      <Chevron direction={isOpen ? "up" : "down"} width={24} height={24} />
    </Flex>
  );
}

function FilterCheckbox({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Flex
      width="100%"
      bg="#F2F1EA"
      p={2}
      borderRadius="4px"
      onClick={() => onChange(!checked)}
      alignItems="flex-start"
      cursor="pointer"
      userSelect={"none"}
    >
      <Heading
        as={"h4"}
        fontSize="md"
        fontFamily="mono"
        color="black"
        display="flex"
        alignItems="center"
        gap={2}
      >
        {checked ? <CheckedIcon /> : <SquareIcon />} {title}
      </Heading>
    </Flex>
  );
}

export function Agenda() {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Search states
  const [searchKey, setSearchKey] = useState("");

  // Filter states
  const [showFilterByDay, setShowFilterByDay] = useState(true);
  const [showFilterByStage, setShowFilterByStage] = useState(true);
  const [showFilterByTags, setShowFilterByTags] = useState(false);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const [filteredEvents, setFilteredEvents] = useState(agendaData);

  useEffect(() => {
    const filtered = filterAgenda(
      agendaData,
      searchKey,
      selectedDay,
      selectedStage,
    );
    setFilteredEvents(filtered);
  }, [
    searchKey,
    selectedDay,
    selectedStage,
    filteredEvents,
    setFilteredEvents,
  ]);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setShowFilter(false);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    if (!showFilter) setShowSearch(false);
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day === selectedDay ? null : day);
  };

  const handleStageChange = (stage: string) => {
    setSelectedStage(stage === selectedStage ? null : stage);
  };

  return (
    <Box p={4} display={"flex"} flexDirection={"column"}>
      <PageHeading
        title="Agenda"
        leftChildren={
          <Button variant="transparent" onClick={toggleSearch}>
            <SearchIcon
              color={showSearch ? "white" : "var(--chakra-colors-brand-400)"}
              width={24}
              height={24}
            />
          </Button>
        }
        rightChildren={
          <Button variant="transparent" onClick={toggleFilter}>
            <FilterIcon
              color={showFilter ? "white" : "var(--chakra-colors-brand-400)"}
              width={24}
              height={24}
            />
          </Button>
        }
      />

      <VStack spacing={4} align="start" pt={4}>
        {showSearch && (
          <Input
            fontFamily={"mono"}
            placeholder="Search..."
            color="black"
            background={"#F2F1EA"}
            variant="outline"
            borderRadius="md"
            fontWeight="700"
            px={4}
            py={2}
            autoFocus
            transition="all 0.3s ease-in-out"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            _placeholder={{
              color: "var(--black, #000)",
              fontFamily: "mono",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "14px",
              textTransform: "uppercase",
            }}
          />
        )}
        {showFilter && (
          <VStack width="100%">
            <VStack width="100%" spacing={0}>
              <FilterTitle
                title="Day"
                isOpen={showFilterByDay}
                handleFilterOpen={() => setShowFilterByDay((prev) => !prev)}
              />
              {showFilterByDay && (
                <>
                  <FilterCheckbox
                    checked={selectedDay === "SATURDAY, NOV 9TH"}
                    onChange={() => handleDayChange("SATURDAY, NOV 9TH")}
                    title="SATURDAY, NOV 9TH"
                  />
                  <FilterCheckbox
                    checked={selectedDay === "SUNDAY, NOV 10TH"}
                    onChange={() => handleDayChange("SUNDAY, NOV 10TH")}
                    title="SUNDAY, NOV 10TH"
                  />
                  <FilterCheckbox
                    checked={selectedDay === "MONDAY, NOV 11TH"}
                    onChange={() => handleDayChange("MONDAY, NOV 11TH")}
                    title="MONDAY, NOV 11TH"
                  />
                </>
              )}
            </VStack>
            <VStack width="100%" spacing={0}>
              <FilterTitle
                title="Stage"
                isOpen={showFilterByStage}
                handleFilterOpen={() => setShowFilterByStage((prev) => !prev)}
              />
              {showFilterByStage && (
                <>
                  <FilterCheckbox
                    checked={selectedStage === "MAIN STAGE"}
                    onChange={() => handleStageChange("MAIN STAGE")}
                    title="MAIN STAGE"
                  />
                  <FilterCheckbox
                    checked={selectedStage === "CYPHERPUNK STAGE"}
                    onChange={() => handleStageChange("CYPHERPUNK STAGE")}
                    title="CYPHERPUNK STAGE"
                  />
                </>
              )}
            </VStack>
            <FilterTitle
              title="Tags"
              isOpen={showFilterByTags}
              handleFilterOpen={() => setShowFilterByTags((prev) => !prev)}
            />
          </VStack>
        )}
        <AgendaList data={filteredEvents} />
      </VStack>
    </Box>
  );
}
