import { CollectiblesIcon, JourneysIcon, WalletIcon } from "@/components/icons";
import { useAccountData } from "@/hooks/useAccountData";
import { useConferenceData } from "@/hooks/useConferenceData";
import eventHelperInstance from "@/lib/event";
import { HStack, Text, VStack } from "@chakra-ui/react";

// Reusable component for displaying an activity summary row
const ActivityItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => {
  return (
    <VStack spacing={0}>
      <HStack spacing={4}>
        <Icon color={"var(--chakra-colors-brand-400)"} width={20} height={20} />
        <Text
          fontFamily={"mono"}
          fontSize={"3xl"}
          fontWeight={700}
          textAlign={"center"}
          color={"white"}
        >
          {value}
        </Text>
      </HStack>
      <Text
        fontFamily={"mono"}
        fontSize={"xs"}
        fontWeight={700}
        textAlign={"center"}
        color={"brand.400"}
      >
        {label}
      </Text>
    </VStack>
  );
};

export function ActivitySummary() {
  const { data, isLoading, isError } = useAccountData();
  const { data: conferenceData } = useConferenceData();

  const tokensCollected =
    isLoading || isError
      ? "-----"
      : eventHelperInstance.yoctoToNearWith2Decimals(data!.tokensCollected);
  const itemsCollected =
    isLoading || isError ? "-----" : data!.ownedCollectibles.length.toString();

  const journeysCompleted =
    isLoading || isError
      ? "-----"
      : data!.journeys.filter((j) => j.completed).length.toString();

  const symbol = conferenceData?.tokenInfo.symbol || "---";

  // Activity data for dynamic rendering
  const activities = [
    {
      icon: WalletIcon,
      label: `${symbol} Acquired`,
      value: tokensCollected,
    },
    {
      icon: CollectiblesIcon,
      label: `Items Collected`,
      value: itemsCollected,
    },
    {
      icon: JourneysIcon,
      label: `Journeys Completed`,
      value: journeysCompleted,
    },
  ];

  return (
    <VStack spacing={4} width={"100%"}>
      <Text
        my={{ base: 2, iphone13: 2, iphone14ProMax: 4 }}
        fontFamily={"mono"}
        fontSize={"lg"}
        fontWeight={700}
        textAlign={"center"}
        color={"brand.400"}
      >
        SUMMARY OF ACTIVITY
      </Text>
      <VStack spacing={6}>
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            icon={activity.icon}
            label={activity.label}
            value={activity.value}
          />
        ))}
      </VStack>
    </VStack>
  );
}
