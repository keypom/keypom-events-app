import {
  Box,
  Button,
  Heading,
  Flex,
  Spacer,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import QRCode from "qrcode";

import { DeleteIcon, LinkIcon, NFTIcon } from "@/components/dashboard/icons";
import {
  type ColumnItem,
  type DataItem,
} from "@/components/dashboard/table/types";
import { DataTable } from "@/components/dashboard/table";

import { truncateAddress } from "@/utils/truncateAddress";
import { formatTokensAvailable } from "@/utils/formatTokensAvailable";
import eventHelperInstance, { DropData } from "@/lib/event";

import { TokenDeleteModal } from "@/components/modals/token-delete";
import { useTokenDeleteModalStore } from "@/stores/token-delete-modal";
import { TokenCreateModal } from "@/components/modals/token-create";
import { useTokenCreateModalStore } from "@/stores/token-create-modal";
import { QRCodeModal } from "@/components/modals/qr-modal";
import { useQRModalStore } from "@/stores/qr-modal";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";
import { deriveKey } from "@/lib/helpers/crypto";

export type GetTicketDataFn = (
  data: DropData[],
  handleDelete: (pubKey: string) => Promise<void>,
) => DataItem[];

const eventTableColumns: ColumnItem[] = [
  {
    id: "dropName",
    title: "Title",
    selector: (row) => row.name,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: "dropType",
    title: "Type",
    selector: (row) => row.type,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: "numClaimed",
    title: "Claims",
    selector: (row) => row.numClaimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: "rewards",
    title: "Reward",
    selector: (row) => row.reward,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: "scavengers",
    title: "Journey Steps",
    selector: (row) => row.numPieces,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: "action",
    title: "",
    selector: (row) => row.action,
    loadingElement: <Skeleton height="30px" />,
  },
];

interface DropWithKeys extends DropData {
  dropSecretKey: string;
  scavengerSecretKeys?: Array<{
    id: number;
    description: string;
    secretKey: string;
  }>;
}

interface DropManagerProps {
  accountId: string;
  secretKey: string;
  isAdmin?: boolean;
  setIsErr?: (isErr: boolean) => void;
}

export function DropManager({
  accountId,
  secretKey,
  setIsErr,
  isAdmin = false,
}: DropManagerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokensAvailable, setTokensAvailable] = useState<string>();
  const [dropsCreated, setDropsCreated] = useState<DropData[]>([]);
  const [qrCodeUrls, setQrCodeUrls] = useState<string[]>([]);
  const [qrCodeDescriptions, setQrCodeDescriptions] = useState<string[]>([]);
  const [dropName, setDropName] = useState<string>("");
  const toast = useToast();

  const getAccountInformation = useCallback(async () => {
    try {
      const tokens: string = await eventHelperInstance.viewCall({
        methodName: "ft_balance_of",
        args: { account_id: accountId },
      });
      setTokensAvailable(eventHelperInstance.yoctoToNearWith2Decimals(tokens));

      const drops: DropData[] = await eventHelperInstance.viewCall({
        methodName: "get_drops_created_by_account",
        args: { account_id: accountId },
      });
      setDropsCreated(drops);
      return drops; // Return the fetched drops
    } catch (e) {
      console.error(e);
      if (!setIsErr) return;
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, setIsErr]);

  useEffect(() => {
    if (!accountId) return;
    getAccountInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);
  const { onOpen: openDeleteModal, setDeletionArgs: setDeleteArgs } =
    useTokenDeleteModalStore();

  const handleDeleteClick = async (dropId: string) => {
    if (!secretKey) {
      console.error("SK is undefined, unable to delete.");
      return;
    }

    const deletionArgs: {
      secretKey: string;
      dropId: string;
      getAccountInformation: () => Promise<DropData[] | undefined>;
    } = {
      secretKey,
      dropId,
      getAccountInformation,
    };

    openDeleteModal();
    setDeleteArgs(deletionArgs);
  };

  const {
    setOnDownload,
    setOnDownloadAll,
    setQrCodeUrls: setModalQRCodeUrls,
    setQrCodeDescriptions: setModalQRCodeDescriptions,
    setDropName: setModalDropName,
    onOpen: onQRModalOpen,
    onClose: handleQRModalClose,
  } = useQRModalStore();

  const getTableRows: GetTicketDataFn = (
    data: DropData[],
    handleDeleteClick: (dropId: string) => Promise<void>,
  ) => {
    if (!data) return [];

    return data.map((item) => {
      const dropImageCid =
        item.type === "Nft" ? item.nft_metadata!.media : item.image!;

      return {
        id: item.id,
        name: (
          <HStack spacing={4} h="100%">
            <Image
              alt={`Event image for ${item.id}`}
              borderRadius="12px"
              boxSize="48px"
              objectFit="contain"
              src={getIpfsImageSrcUrl(dropImageCid)}
            />
            <VStack align="left">
              <Heading
                fontFamily="body"
                fontSize={{ md: "lg" }}
                fontWeight="bold"
                paddingRight={8}
              >
                {truncateAddress(`${item.name}`, "end", 16)}
              </Heading>
            </VStack>
          </HStack>
        ),
        type: item.type === "Token" ? "Token" : "NFT",
        numClaimed: item.num_claimed,
        numPieces: item.scavenger_hunt ? item.scavenger_hunt.length : "None",
        reward:
          item.type === "Token" ? (
            eventHelperInstance.yoctoToNearWith2Decimals(item.token_amount!)
          ) : (
            <>NFT</>
          ),
        action: (
          <HStack justify="left" spacing={8} w="100%" h="100%">
            <Button
              size="md"
              variant="primary"
              height={"48px"}
              maxWidth={"max-content"}
              onClick={(e) => {
                e.stopPropagation();
                generateQRCode(item);
              }}
            >
              Get QR Code
            </Button>
            <Button
              variant="icon"
              background={"red.400"}
              height={"48px"}
              width={"48px"}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(item.id);
              }}
            >
              <DeleteIcon color="white" />
            </Button>
          </HStack>
        ),
      };
    });
  };

  const regenerateKeysForDrops = useCallback(
    (drops: DropData[]): DropWithKeys[] => {
      return drops.map((drop) => {
        console.log("drop: ", drop);
        const dropKeyPair = deriveKey(secretKey, drop.name);
        const dropSecretKey = dropKeyPair.secretKey;

        let scavengerSecretKeys: Array<{
          id: number;
          description: string;
          secretKey: string;
        }> = [];

        if (drop.scavenger_hunt) {
          scavengerSecretKeys = drop.scavenger_hunt.map((piece) => {
            const keyPair = deriveKey(
              secretKey,
              drop.name,
              piece.id.toString(),
            );
            return {
              id: piece.id,
              description: piece.description,
              secretKey: keyPair.secretKey,
            };
          });
        }

        return {
          ...drop,
          dropSecretKey,
          scavengerSecretKeys,
        };
      });
    },
    [secretKey],
  );

  const generateQRCode = useCallback(
    async (drop: DropData) => {
      try {
        const { dropSecretKey, scavengerSecretKeys } = regenerateKeysForDrops([
          drop,
        ])[0];
        const type = drop.type === "Nft" ? "nft" : "token";

        // Set the drop name in the QR modal store
        setDropName(drop.name);

        if (scavengerSecretKeys && scavengerSecretKeys.length > 0) {
          const qrCodes = await Promise.all(
            scavengerSecretKeys.map(({ secretKey }) =>
              QRCode.toDataURL(`${type}%%piece%%${secretKey}%%${drop.id}`),
            ),
          );
          setQrCodeUrls(qrCodes);
          setQrCodeDescriptions(
            scavengerSecretKeys.map(({ description }) => description),
          );
        } else {
          const url = await QRCode.toDataURL(
            `${type}%%${dropSecretKey}%%${drop.id}`,
          );
          setQrCodeUrls([url]);
          setQrCodeDescriptions([drop.name]);
        }
        onQRModalOpen();
      } catch (err) {
        console.error(err);
      }
    },
    [onQRModalOpen, regenerateKeysForDrops, setDropName],
  );
  const handleDownloadQrCode = useCallback((url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleDownloadAllQrCodes = useCallback(
    (urls: string[], filenames: string[]) => {
      urls.forEach((url, index) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filenames[index];
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    [],
  );

  const data = useMemo(
    () => getTableRows(dropsCreated, handleDeleteClick),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dropsCreated],
  );

  const {
    setHandleClose,
    onOpen: setShowTokenCreateModal,
    setTokenType,
    onClose: handleModalClose,
  } = useTokenCreateModalStore();

  const handleCreateDropClose = useCallback(
    async (dropCreated, isScavengerHunt, scavengerHunt, setIsModalLoading) => {
      if (dropCreated) {
        setIsModalLoading(true);
        try {
          const { dropId } = await eventHelperInstance.createConferenceDrop({
            secretKey,
            createdDrop: dropCreated,
            isScavengerHunt,
            scavengerHunt,
          });
          toast({
            title: "Drop created successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          const drops = await getAccountInformation(); // Refresh and get the updated drops

          if (!drops) {
            window.location.reload();
            throw new Error("Drops not found in getAccountInformation");
          }

          // Find the newly created drop using the dropId
          const newDrop = drops.find((drop) => drop.id === dropId);

          if (!newDrop) {
            window.location.reload();
            throw new Error("Newly created drop not found in dropsCreated");
          }

          const type = newDrop.type === "Nft" ? "nft" : "token";

          // Generate dropSecretKey
          const dropKeyPair = deriveKey(secretKey, newDrop.name);
          const dropSecretKey = dropKeyPair.secretKey;

          // Set the drop name
          setDropName(newDrop.name);

          if (isScavengerHunt) {
            // Use regenerateKeysForDrops to ensure consistency
            const { scavengerSecretKeys } = regenerateKeysForDrops([
              newDrop,
            ])[0];

            if (!scavengerSecretKeys) {
              throw new Error(
                "Scavenger secret keys not found in regenerateKeysForDrops",
              );
            }

            const qrCodes = await Promise.all(
              scavengerSecretKeys.map(({ secretKey }) =>
                QRCode.toDataURL(`${type}%%piece%%${secretKey}%%${dropId}`),
              ),
            );
            setQrCodeUrls(qrCodes);
            setQrCodeDescriptions(
              scavengerSecretKeys.map(({ description }) => description),
            );
          } else {
            const url = await QRCode.toDataURL(
              `${type}%%${dropSecretKey}%%${dropId}`,
            );
            setQrCodeUrls([url]);
            setQrCodeDescriptions([newDrop.name]);
          }

          handleModalClose();
          onQRModalOpen();
        } catch (e) {
          console.error("Error creating drop:", e);
          toast({
            title: "Drop creation unsuccessful. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          handleModalClose();
          handleQRModalClose();
        }
        setIsModalLoading(false);
      } else {
        handleModalClose();
      }
    },
    [
      secretKey,
      getAccountInformation,
      regenerateKeysForDrops,
      onQRModalOpen,
      handleModalClose,
      handleQRModalClose,
      toast,
      setDropName,
    ],
  );

  useEffect(() => {
    setHandleClose(handleCreateDropClose);
  }, [setHandleClose, handleCreateDropClose]);

  useEffect(() => {
    setOnDownload(handleDownloadQrCode);
    setOnDownloadAll(handleDownloadAllQrCodes);
    setModalQRCodeUrls(qrCodeUrls);
    setModalQRCodeDescriptions(qrCodeDescriptions);
    setModalDropName(dropName);
  }, [
    handleDownloadQrCode,
    handleDownloadAllQrCodes,
    setOnDownload,
    setOnDownloadAll,
    setModalQRCodeUrls,
    setModalQRCodeDescriptions,
    setModalDropName,
    qrCodeUrls,
    qrCodeDescriptions,
    dropName,
  ]);

  // Extract existing drop names
  const existingDropNames = dropsCreated.map((drop) => drop.name);

  return (
    <Box p={8}>
      <>
        <Flex alignItems="center" mb={{ base: 4, lg: 8 }}>
          <Heading
            fontFamily="mono"
            color="white"
            fontSize={{ base: "3xl", lg: "4xl" }}
          >
            Drop Manager
          </Heading>
          <Spacer />
        </Flex>
        <TokenDeleteModal />
        <TokenCreateModal
          existingDropNames={existingDropNames}
          isAdmin={isAdmin}
        />
        <QRCodeModal />
        {isLoading ? (
          <Skeleton height="200px" />
        ) : (
          <DropActionsSection
            isAdmin={isAdmin}
            tokensAvailable={tokensAvailable}
            setDropType={setTokenType}
            onCreateDrop={() => {
              setShowTokenCreateModal();
            }}
          />
        )}
        <DataTable
          columns={eventTableColumns}
          data={data}
          stackedActionCols={["action"]}
          excludedMobileCols={["dropType"]}
          loading={isLoading}
          showColumns={true}
          type="conference-drops"
        />
      </>
    </Box>
  );
}

const DropActionsSection = ({
  tokensAvailable,
  onCreateDrop,
  setDropType,
  isAdmin,
}) => (
  <Flex
    py={{ base: 2, lg: 8 }}
    justify="space-between"
    flexDirection={{ base: "column", lg: "row" }} // stack on mobile, row on larger screens
    gap={{ base: 6, lg: 8 }} // spacing between items when stacked
  >
    <Box
      bg="border.box"
      border="2px solid transparent"
      borderRadius="12"
      borderWidth="2px"
      w="100%"
    >
      <HStack align="center" spacing={4}>
        <Text
          color="brand.400"
          fontSize="lg"
          fontWeight="medium"
          fontFamily="mono"
        >
          Tokens Available
        </Text>
        <Heading fontWeight="400" fontSize="2xl" fontFamily="mono">
          {isAdmin ? "∞" : formatTokensAvailable(tokensAvailable)}
        </Heading>
      </HStack>
    </Box>
    <Menu>
      <MenuButton
        as={Button}
        variant="primary"
        mb={{ base: 3, lg: 0 }}
        maxWidth="max-content"
        minWidth="max-content"
      >
        Create Drop
      </MenuButton>
      <MenuList
        background="black"
        borderRadius="md"
        border="1px solid var(--chakra-colors-brand-400)"
        fontFamily="mono"
      >
        <MenuItem
          background="black"
          color="white"
          _hover={{
            background: "black",
            color: "brand.400",
          }}
          key="token"
          icon={<LinkIcon h="4" w="4" />}
          onClick={() => {
            setDropType("token");
            onCreateDrop();
          }}
        >
          Token Drop
        </MenuItem>
        <MenuItem
          background="black"
          color="white"
          _hover={{
            background: "black",
            color: "brand.400",
          }}
          key="nft"
          icon={<NFTIcon h="4" w="4" />}
          onClick={() => {
            setDropType("nft");
            onCreateDrop();
          }}
        >
          NFT Drop
        </MenuItem>
      </MenuList>
    </Menu>
  </Flex>
);
