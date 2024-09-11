import { EventList } from "@/components/agenda/event-list";
import {
  CheckedIcon,
  Chevron,
  FilterIcon,
  SearchIcon,
  SquareIcon,
} from "@/components/icons";
import { AddToCalendarModal } from "@/components/modals/add-to-calendar";
import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { filterAgenda, findAllDays, findAllStages } from "@/lib/helpers/agenda";
import { AgendaEvent, fetchAgenda } from "@/lib/api/agendas";
import { formatDate } from "@/utils/date";
import { Box, Button, Flex, Heading, Input, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

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

export default function Agenda() {
  const {
    data: agendaData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agenda"],
    queryFn: fetchAgenda,
  });

  console.log(agendaData);

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

  const [filteredEvents, setfilteredEvents] = useState<AgendaEvent[] | []>(
    agendaData ? agendaData.events : [],
  );

  useEffect(() => {
    if (agendaData) {
      const filtered = filterAgenda(
        agendaData,
        searchKey,
        selectedDay,
        selectedStage,
      );
      setfilteredEvents(filtered.events);
    }
  }, [
    agendaData,
    searchKey,
    selectedDay,
    selectedStage,
    filteredEvents,
    setfilteredEvents,
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

  const stages = useMemo(
    () => (agendaData ? findAllStages(agendaData.events) : []),
    [agendaData],
  );

  const days = useMemo(
    () => (agendaData ? findAllDays(agendaData.events) : []),
    [agendaData],
  );

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
              {showFilterByDay &&
                days.map((day) => (
                  <FilterCheckbox
                    key={day}
                    checked={selectedDay === day}
                    onChange={() => handleDayChange(day)}
                    title={formatDate(new Date(day))}
                  />
                ))}
            </VStack>
            <VStack width="100%" spacing={0}>
              <FilterTitle
                title="Stage"
                isOpen={showFilterByStage}
                handleFilterOpen={() => setShowFilterByStage((prev) => !prev)}
              />
              {showFilterByStage &&
                stages.map((stage: string) => (
                  <FilterCheckbox
                    key={stage}
                    checked={selectedStage === stage}
                    onChange={() => handleStageChange(stage)}
                    title={stage.toUpperCase()}
                  />
                ))}
            </VStack>
            <FilterTitle
              title="Tags"
              isOpen={showFilterByTags}
              handleFilterOpen={() => setShowFilterByTags((prev) => !prev)}
            />
          </VStack>
        )}
        {isLoading && <LoadingBox />}
        {filteredEvents && <EventList events={filteredEvents} />}
        {isError && <ErrorBox message={`Error: ${error.message}`} />}
      </VStack>
      <AddToCalendarModal />
    </Box>
  );
}
