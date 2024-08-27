import {
  Button,
  Heading,
  Box,
  VStack,
  Input,
  Accordion,
  CheckboxGroup,
  AccordionPanel,
  AccordionItem,
  AccordionButton,
  useAccordionItemState,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { PageHeading } from "@/components/ui/page-heading";
import { SearchIcon } from "@/components/icons/search";
import { FilterIcon } from "@/components/icons/filter";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDownIcon } from "@/components/icons/arrow-down";

function RotatingArrowDownIcon() {
  const { isOpen } = useAccordionItemState();

  return <ArrowDownIcon rotate={isOpen} />;
}

export function Agenda() {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const days = ["SATURDAY, NOV 9TH", "SUNDAY, NOV 10TH", "MONDAY, NOV 11TH"];
  const stages = ["MAIN STAGE", "CYBHERPUNK STAGE"];
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

      <VStack spacing={4} align="start" p={4}>
        {showSearch && (
          <Input
            fontFamily={"mono"}
            placeholder="Search..."
            color="white"
            background={"#F2F1EA"}
            variant="outline"
            borderRadius="md"
            px={4}
            py={2}
            autoFocus
            transition="all 0.3s ease-in-out"
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
          <Accordion
            width={"full"}
            defaultIndex={[0]}
            padding={0}
            border={"none"}
            allowMultiple
          >
            <AccordionItem
              borderRadius={"4px"}
              border={"none"}
              background={"#F2F1EA"}
            >
              <h2>
                <AccordionButton>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight={700}
                    fontFamily={"mono"}
                    color={"#04A46E"}
                  >
                    <Box as="span" fontFamily={"mono"} color={"#04A46E"}>
                      Filter by:{" "}
                      <Box as="span" color={"#000"}>
                        Day
                      </Box>
                    </Box>
                  </Box>
                  <RotatingArrowDownIcon />
                </AccordionButton>
              </h2>

              <AccordionPanel pb={4}>
                <VStack
                  align="start"
                  color={"#000"}
                  fontFamily={"mono"}
                  fontWeight={700}
                  fontSize={"sm"}
                >
                  {days.map((day) => (
                    <Checkbox
                      key={day}
                      value={day}
                      isChecked={selectedDay === day}
                      onChange={handleDayChange}
                    >
                      {day}
                    </Checkbox>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem
              borderRadius={"4px"}
              border={"none"}
              background={"#F2F1EA"}
            >
              <h2>
                <AccordionButton>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight={700}
                    fontFamily={"mono"}
                    color={"#04A46E"}
                  >
                    <Box as="span" fontFamily={"mono"} color={"#04A46E"}>
                      Filter by:{" "}
                      <Box as="span" color={"#000"}>
                        Stage
                      </Box>
                    </Box>
                  </Box>
                  <RotatingArrowDownIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <CheckboxGroup>
                  <VStack
                    align="start"
                    color={"#000"}
                    fontFamily={"mono"}
                    fontWeight={700}
                    fontSize={"sm"}
                  >
                    {stages.map((stage) => (
                      <Checkbox
                        key={stage}
                        value={stage}
                        isChecked={selectedStage === stage}
                        onChange={handleStageChange}
                      >
                        {stage}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem
              borderRadius={"4px"}
              border={"none"}
              background={"#F2F1EA"}
            >
              <h2>
                <AccordionButton>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight={700}
                    fontFamily={"mono"}
                    color={"#04A46E"}
                  >
                    <Box as="span" fontFamily={"mono"} color={"#04A46E"}>
                      Filter by:
                      <Box as="span" color={"#000"}>
                        Tags
                      </Box>
                    </Box>
                  </Box>
                  <RotatingArrowDownIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}></AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
        {selectedDay && (
          <Box
            width={"100%"}
            p={2}
            borderRadius={"4px"}
            background={"#00EC97"}
            display={"flex"}
            gap={"10px"}
          >
            <VStack
              align="stretch"
              color={"black"}
              fontFamily={"mono"}
              fontWeight={700}
              fontSize={"16px"}
              lineHeight={"14px"}
              textTransform={"uppercase"}
            >
              <Box>{selectedDay}</Box>
            </VStack>
          </Box>
        )}
        <Heading>Agenda</Heading>
        <Link to="/">Home</Link>
      </VStack>
    </Box>
  );
}
