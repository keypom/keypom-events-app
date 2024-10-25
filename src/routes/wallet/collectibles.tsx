import { Flex, Grid, GridItem, HStack } from "@chakra-ui/react";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { CollectibleCard } from "@/components/wallet/collectibles/card";
import { useAccountData } from "@/hooks/useAccountData";
import { ExtClaimedDrop, DropData } from "@/lib/event";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";
import { getChainNameFromChainId } from "@/lib/helpers/multichain";
import { CollectibleTabButton } from "@/components/wallet/collectibles/tab-button";
import { useState } from "react";
import { Pagination } from "@/components/wallet/collectibles/pagination";

const Divider = () => {
  return (
    <hr
      style={{
        border: "1px solid var(--chakra-colors-brand-400)",
        width: "100%",
        maxWidth: "450px",
        marginTop: "8px",
        marginBottom: "2px",
      }}
    />
  );
};

const CollectiblesGrid = ({
  items,
  currentPage,
  setPage,
  totalItems,
  isFound,
}: {
  items: ExtClaimedDrop[] | DropData[];
  currentPage: number;
  setPage: (page: number) => void;
  totalItems: number;
  isFound: boolean;
}) => {
  const itemsPerPage = 4;

  return (
    <Flex
      direction="column"
      alignItems="center"
      mt={4}
      justifyContent="space-between"
      flexGrow={1} // Allow the grid to grow and fill available space
    >
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
        }}
        gap={4}
        alignItems="start"
        maxWidth="450px"
        width="100%"
        flexGrow={1} // Allow the grid to grow
        templateRows="repeat(2, 1fr)" // Ensure the grid has 2 rows (since 4 items max, 2 columns)
      >
        {items.map((collectible, index) => (
          <GridItem key={index} p={2} pb={4}>
            <CollectibleCard
              id={collectible.id || collectible.drop_id}
              title={collectible.nft_metadata?.title || ""}
              description={collectible.nft_metadata?.description || ""}
              assetType="POAP"
              imageSrc={getIpfsImageSrcUrl(
                collectible.nft_metadata?.media || "",
              )}
              isFound={isFound}
              chain={
                collectible.mc_metadata !== undefined
                  ? getChainNameFromChainId(collectible.mc_metadata.chain_id)
                  : "NEAR"
              }
              disabled={!isFound}
            />
          </GridItem>
        ))}
        {/* Add invisible GridItems to fill up the space when there are fewer items */}
        {Array.from({ length: itemsPerPage - items.length }).map((_, index) => (
          <GridItem key={`empty-${index}`} p={2} pb={4} visibility="hidden">
            <CollectibleCard
              id={`empty-${index}`}
              title="Opening Ceremoy POAP"
              description=""
              assetType="POAP"
              isFound={false}
              imageSrc=""
              chain="NEAR"
              disabled
            />
          </GridItem>
        ))}
      </Grid>
      <Divider />
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        setPage={setPage}
      />
    </Flex>
  );
};

export default function Collectibles() {
  const { data, isLoading, isError, error } = useAccountData();

  const unlockedItems =
    !data || isLoading || isError ? [] : data.ownedCollectibles;
  const lockedItems =
    !data || isLoading || isError ? [] : data.unownedCollectibles;

  const [curTab, setCurTab] = useState<"found" | "explore">("explore");

  // Pagination states for both tabs
  const [foundPage, setFoundPage] = useState(1);
  const [explorePage, setExplorePage] = useState(1);
  const itemsPerPage = 4;

  // Get the items to show on the current tab
  const itemsToShow =
    curTab === "found"
      ? unlockedItems.slice(
          (foundPage - 1) * itemsPerPage,
          foundPage * itemsPerPage,
        )
      : lockedItems.slice(
          (explorePage - 1) * itemsPerPage,
          explorePage * itemsPerPage,
        );

  return (
    <Flex direction="column" p={4}>
      <PageHeading
        title="Collectibles"
        titleSize="24px"
        description={`${unlockedItems.length}/${lockedItems.length + unlockedItems.length} found`}
        showBackButton
      />
      {isLoading && <LoadingBox />}
      <HStack w="100%" spacing="0" mt={2}>
        <CollectibleTabButton
          active={curTab === "found"}
          type={"found"}
          numItems={unlockedItems.length}
          onClick={() => {
            setCurTab("found");
            setFoundPage(1); // Reset to first page when switching tabs
          }}
        />
        <CollectibleTabButton
          active={curTab === "explore"}
          type={"explore"}
          numItems={lockedItems.length}
          onClick={() => {
            setCurTab("explore");
            setExplorePage(1); // Reset to first page when switching tabs
          }}
        />
      </HStack>
      <Flex direction="column" flex="1">
        {itemsToShow.length > 0 ? (
          <CollectiblesGrid
            items={itemsToShow}
            currentPage={curTab === "found" ? foundPage : explorePage}
            setPage={curTab === "found" ? setFoundPage : setExplorePage}
            totalItems={
              curTab === "found" ? unlockedItems.length : lockedItems.length
            }
            isFound={curTab === "found"}
          />
        ) : (
          <ErrorBox message="No collectibles to display." />
        )}
      </Flex>
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </Flex>
  );
}
