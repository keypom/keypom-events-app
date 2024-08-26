import { Button, Heading, Box, Checkbox, CheckboxGroup, VStack, Input, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, color, RadioGroup, Radio } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { PageHeading } from "@/components/ui/page-heading";
import { SearchIcon } from "@/components/icons/search";
import { FilterIcon } from "@/components/icons/filter";
import { ArrowIcon } from "@/components/icons/arrow";



export function Agenda() {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setShowFilter(false);
  };
  
  const toggleFilter = () => {
    setShowFilter(!showFilter);
    if (!showFilter) setShowSearch(false);
  };



  return (
    <Box display={"flex"} flexDirection={"column"}>
      <PageHeading
        title="Agenda"
        leftChildren={
          <Button
            variant="transparent"
            onClick={toggleSearch}
          >
            <SearchIcon width={24} height={24} />
          </Button>
        }
        rightChildren={
          <Button
            variant="transparent"
            onClick={toggleFilter}
          >
            <FilterIcon width={24} height={24} />
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
              textTransform: "uppercase"
            }}
          />
        )}
        {showFilter && (
          <Accordion width={"full"} defaultIndex={[0]} padding={0} border={"none"} allowMultiple>
  <AccordionItem borderRadius={"4px"} border={"none"} background={"#F2F1EA"}>
    <h2>
      <AccordionButton>
        <Box as='span' flex='1' textAlign='left' fontWeight={700} fontFamily={"mono"} color={"#04A46E"}>
        <Box as='span' fontFamily={"mono"} color={"#04A46E"}>
          Filter by: <Box as='span' color={"#000"}>Day</Box>
          </Box>
        </Box>
        <ArrowIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    <RadioGroup defaultValue="option1">
                  <VStack align="start" color={"#000"} fontFamily={"mono"} fontWeight={700} fontSize={"sm"}>
                    <Checkbox> SATURDAY, NOV 9TH</Checkbox>      
                    <Checkbox>SUNDAY, NOV 10TH</Checkbox>      
                    <Checkbox >MONDAY, NOV 11TH</Checkbox>    </VStack>
                </RadioGroup> 
{/* <CheckboxGroup colorScheme='green' defaultValue={['naruto', 'kakashi']}>
  <Stack spacing={[1, 5]} direction={['column', 'row']}>
    <Checkbox value='naruto'>Naruto</Checkbox>
    <Checkbox value='sasuke'>Sasuke</Checkbox>
    <Checkbox value='kakashi'>Kakashi</Checkbox>
  </Stack>
</CheckboxGroup> */}
          </AccordionPanel>
  </AccordionItem>
  <AccordionItem borderRadius={"4px"} border={"none"} background={"#F2F1EA"}>
    <h2>
      <AccordionButton>
        <Box as='span' flex='1' textAlign='left' fontWeight={700} fontFamily={"mono"} color={"#04A46E"}>
        <Box as='span' fontFamily={"mono"} color={"#04A46E"}>
          Filter by: <Box as='span' color={"#000"}>Stage</Box>
          </Box>
        </Box>
        <ArrowIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem borderRadius={"4px"} border={"none"} background={"#F2F1EA"}>
    <h2>
      <AccordionButton>
        <Box as='span' flex='1' textAlign='left' fontWeight={700} fontFamily={"mono"} color={"#04A46E"}>
        <Box as='span' fontFamily={"mono"} color={"#04A46E"}>
          Filter by: <Box as='span' color={"#000"}>Tags</Box>
          </Box>
        </Box>
        <ArrowIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
        )}
        <Heading>Agenda</Heading>
        <Link to="/">Home</Link>
      </VStack>
    </Box>
  );
}
