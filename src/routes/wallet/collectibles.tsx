import { Flex, Grid, GridItem, HStack } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { CollectibleCard } from "@/components/wallet/collectibles/card";
import { useAccountData } from "@/hooks/useAccountData";
import { ExtClaimedDrop, DropData } from "@/lib/event";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";
import { getChainNameFromChainId } from "@/lib/helpers/multichain";
import { CollectibleTabButton } from "@/components/wallet/collectibles/tab-button";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/wallet/collectibles/pagination";

export const Divider = () => {
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
      flexGrow={1}
    >
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
        }}
        gap={4}
        alignItems="start"
        maxWidth="450px"
        width="100%"
        flexGrow={1}
        templateRows="repeat(2, 1fr)"
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
        {Array.from({ length: itemsPerPage - items.length }).map((_, index) => (
          <GridItem key={`empty-${index}`} p={2} pb={4} visibility="hidden">
            <CollectibleCard
              id={`empty-${index}`}
              title="Opening Ceremony POAP"
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
  const [searchParams, setSearchParams] = useSearchParams();

  const unlockedItems =
    !data || isLoading || isError ? [] : data.ownedCollectibles;
  const lockedItems =
    !data || isLoading || isError ? [] : data.unownedCollectibles;

  // Read `tab` and `page` from URL query parameters
  const queryTab = searchParams.get("tab");
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // Initialize `curTab` based on URL parameter or default logic
  const [curTab, setCurTab] = useState<"found" | "explore">(() => {
    if (queryTab === "found" || queryTab === "explore") {
      return queryTab as "found" | "explore";
    } else {
      return "explore"; // Default to 'explore' initially
    }
  });

  const [foundPage, setFoundPage] = useState(() => {
    return queryTab === "found" ? initialPage : 1;
  });

  const [explorePage, setExplorePage] = useState(() => {
    return queryTab === "explore" ? initialPage : 1;
  });

  useEffect(() => {
    if (!isLoading && data) {
      if (
        (!queryTab || (queryTab !== "found" && queryTab !== "explore")) &&
        lockedItems.length === 0 &&
        curTab !== "found"
      ) {
        setCurTab("found");
        setFoundPage(1);
        setSearchParams({ tab: "found", page: "1" }, { replace: true });
      }
    }
  }, [isLoading, data, queryTab, lockedItems.length, curTab, setSearchParams]);

  const itemsPerPage = 4;

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

  const handleTabChange = (newTab: "found" | "explore") => {
    setCurTab(newTab);
    setSearchParams({ tab: newTab, page: "1" }, { replace: true });
    if (newTab === "found") setFoundPage(1);
    else setExplorePage(1);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(
      { tab: curTab, page: newPage.toString() },
      { replace: true },
    );
    if (curTab === "found") setFoundPage(newPage);
    else setExplorePage(newPage);
  };

  useEffect(() => {
    // Sync the `page` and `tab` state with the URL parameters when they change
    const page = curTab === "found" ? foundPage : explorePage;
    setSearchParams({ tab: curTab, page: page.toString() }, { replace: true });
  }, [curTab, foundPage, explorePage, setSearchParams]);

  return (
    <Flex direction="column" p={4}>
      <PageHeading
        title="Collectibles"
        titleSize="24px"
        description={`${unlockedItems.length}/${
          lockedItems.length + unlockedItems.length
        } found`}
        showBackButton
      />
      {isLoading && <LoadingBox />}
      <HStack w="100%" spacing="0" mt={2}>
        <CollectibleTabButton
          active={curTab === "found"}
          type={"found"}
          numItems={unlockedItems.length}
          onClick={() => handleTabChange("found")}
        />
        <CollectibleTabButton
          active={curTab === "explore"}
          type={"explore"}
          numItems={lockedItems.length}
          onClick={() => handleTabChange("explore")}
        />
      </HStack>
      <Flex direction="column" flex="1">
        {itemsToShow.length > 0 ? (
          <CollectiblesGrid
            items={itemsToShow}
            currentPage={curTab === "found" ? foundPage : explorePage}
            setPage={handlePageChange}
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
