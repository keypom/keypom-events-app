import { Grid, GridItem, VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { CollectibleCard } from "@/components/wallet/collectibles/card";

const Divider = () => {
  return (
    <hr
      style={{
        border: "2px solid var(--chakra-colors-brand-400)",
        width: "100%",
        maxWidth: "450px",
        margin: "24px 0",
      }}
    />
  );
};

export function Collectibles() {
  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Collectibles"
        titleSize="24px"
        description="2/8 found"
        showBackButton
        backUrl="/wallet"
      />
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
        }}
        width={"100%"}
        maxWidth="450px"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <GridItem key={index} p={2} pb={4}>
            <CollectibleCard id={index.toString()} />
          </GridItem>
        ))}
      </Grid>
      <Divider />
      {/* Locked */}
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
        }}
        width={"100%"}
        maxWidth="450px"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <GridItem key={index} p={2} pb={4}>
            <CollectibleCard id={index.toString()} disabled />
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
}
