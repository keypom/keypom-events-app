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
import eventHelperInstance, { ExtDropData, ScavengerHunt } from "@/lib/event";

import { TokenDeleteModal } from "@/components/modals/token-delete";
import { useTokenDeleteModalStore } from "@/stores/token-delete-modal";
import { TokenCreateModal } from "@/components/modals/token-create";
import { useTokenCreateModalStore } from "@/stores/token-create-modal";
import { QRCodeModal } from "@/components/modals/qr-modal";
import { useQRModalStore } from "@/stores/qr-modal";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";

export type GetTicketDataFn = (
  data: ExtDropData[],
  handleDelete: (pubKey: string) => Promise<void>,
) => DataItem[];

const eventTableColumns: ColumnItem[] = [
  {
    id: "dropName",
    title: "Name",
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
    title: "Scavenger Pieces",
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

interface DropManagerProps {
  accountId: string;
  secretKey: string;
  setIsErr: (isErr: boolean) => void;
  setActiveView?: (view: string) => void;
}

export function DropManager({
  accountId,
  secretKey,
  setActiveView,
  setIsErr,
}: DropManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tokensAvailable, setTokensAvailable] = useState<string>();
  const [dropsCreated, setDropsCreated] = useState<ExtDropData[]>([]);
  const toast = useToast();
  const [qrCodeUrls, setQrCodeUrls] = useState<string[]>([]);

  const getAccountInformation = useCallback(async () => {
    try {
      const tokens = await eventHelperInstance.viewCall({
        methodName: "ft_balance_of",
        args: { account_id: accountId },
      });
      setTokensAvailable(eventHelperInstance.yoctoToNearWith2Decimals(tokens));

      const drops: ExtDropData[] = await eventHelperInstance.viewCall({
        methodName: "get_drops_created_by_account",
        args: { account_id: accountId },
      });
      console.log("drops: ", drops);
      setDropsCreated(drops);
    } catch (e) {
      console.error(e);
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, setIsErr, setIsLoading, setTokensAvailable, setDropsCreated]);

  useEffect(() => {
    if (!accountId) return;
    getAccountInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);
  const { onOpen: openDeleteModal, setDeletionArgs: setDeleteArgs } =
    useTokenDeleteModalStore();

  const handleDeleteClick = async (dropId) => {
    if (!secretKey) {
      console.error("SK is undefined, unable to delete.");
      return;
    }

    const deletionArgs = {
      secretKey,
      dropId,
      getAccountInformation,
    };

    openDeleteModal();
    setDeleteArgs(deletionArgs);
  };

  const { onOpen: onQRModalOpen } = useQRModalStore();

  const getTableRows: GetTicketDataFn = (data, handleDeleteClick) => {
    if (!data) return [];

    return data.map((item) => {
      const dropImageCid =
        item.type === "nft" ? item.nft_metadata!.media : item.image!;

      return {
        id: item.drop_id,
        name: (
          <HStack spacing={4}>
            <Image
              alt={`Event image for ${item.drop_id}`}
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
              >
                {truncateAddress(`${item.name}`, "end", 16)}
              </Heading>
            </VStack>
          </HStack>
        ),
        type: item.type === "token" ? "Token" : "NFT",
        numClaimed: item.num_claimed,
        numPieces: item.scavenger_hunt ? item.scavenger_hunt.length : "None",
        reward:
          item.type === "token" ? (
            eventHelperInstance.yoctoToNearWith2Decimals(item.amount!)
          ) : (
            <Image
              alt={`Event image for ${item.drop_id}`}
              borderRadius="12px"
              boxSize="48px"
              objectFit="contain"
              src={getIpfsImageSrcUrl(dropImageCid)}
            />
          ),
        action: (
          <HStack justify="right" spacing={8} w="100%">
            <Button
              size="md"
              variant="primary"
              maxWidth={"max-content"}
              onClick={(e) => {
                e.stopPropagation();
                generateQRCode(item.drop_id, item.type, item.scavenger_hunt);
                onQRModalOpen();
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
                handleDeleteClick(item.drop_id);
              }}
            >
              <DeleteIcon color="white" />
            </Button>
          </HStack>
        ),
      };
    });
  };

  const generateQRCode = useCallback(
    async (
      dropId: string,
      type: "nft" | "token",
      scavengerHunt?: ScavengerHunt[],
    ) => {
      try {
        if (scavengerHunt && scavengerHunt.length > 0) {
          const qrCodes = await Promise.all(
            scavengerHunt.map(({ piece }) =>
              QRCode.toDataURL(`${type}%%${piece}%%${dropId}`),
            ),
          );
          setQrCodeUrls(qrCodes);
        } else {
          const url = await QRCode.toDataURL(`${type}%%${dropId}`);
          setQrCodeUrls([url]);
        }
        onQRModalOpen();
      } catch (err) {
        console.error(err);
      }
    },
    [onQRModalOpen],
  );

  const handleDownloadQrCode = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllQrCodes = (urls: string[]) => {
    urls.forEach((url, index) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const data = useMemo(
    () => getTableRows(dropsCreated, handleDeleteClick),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dropsCreated],
  );

  const { onClose: handleModalClose } = useTokenCreateModalStore();
  const { onClose: handleQRModalClose } = useQRModalStore();

  const handleCreateDropClose = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dropCreated: any,
      isScavengerHunt: boolean,
      scavengerHunt: Array<{ piece: string; description: string }>,
      setIsModalLoading: (loading: boolean) => void,
    ) => {
      if (dropCreated) {
        setIsModalLoading(true);
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { dropId, completeScavengerHunt }: any =
            await eventHelperInstance.createConferenceDrop({
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
          await getAccountInformation(); // Refresh the drop list
          const type = dropCreated.nftData === undefined ? "token" : "nft";
          if (isScavengerHunt) {
            generateQRCode(dropId, type, completeScavengerHunt);
          } else {
            generateQRCode(dropId, type);
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
      handleModalClose,
      onQRModalOpen,
      secretKey,
      getAccountInformation,
      generateQRCode,
      handleQRModalClose,
    ],
  );

  const {
    setHandleClose,
    onOpen: setShowTokenCreateModal,
    setTokenType,
  } = useTokenCreateModalStore();

  useEffect(() => {
    setHandleClose(handleCreateDropClose);
  }, [setHandleClose, handleCreateDropClose]);

  const {
    setOnDownload,
    setOnDownloadAll,
    setQrCodeUrls: setModalQRCodeUrls,
  } = useQRModalStore();

  useEffect(() => {
    setOnDownload(handleDownloadQrCode);
    setOnDownloadAll(handleDownloadAllQrCodes);
    setModalQRCodeUrls(qrCodeUrls);
  }, [setOnDownload, setOnDownloadAll, setModalQRCodeUrls, qrCodeUrls]);

  return (
    <Box p={8}>
      <>
        <Flex alignItems="center" mb={4}>
          <Heading fontFamily="mono" color="white">
            Drop Manager
          </Heading>
          <Spacer />
          {setActiveView && (
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => setActiveView("main")}
            >
              Back
            </Button>
          )}
        </Flex>
        <TokenDeleteModal />
        <TokenCreateModal />
        <QRCodeModal />
        {isLoading ? (
          <Skeleton height="200px" />
        ) : (
          <DropActionsSection
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
          excludeMobileColumns={[]}
          loading={isLoading}
          showColumns={true}
          showMobileTitles={["price", "numTickets"]}
          type="conference-drops"
        />
      </>
    </Box>
  );
}

const DropActionsSection = ({ tokensAvailable, onCreateDrop, setDropType }) => (
  <>
    <HStack justify="space-between" py={8}>
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
            fontFamily={"mono"}
          >
            Tokens Available
          </Text>
          <Heading fontWeight={"400"}>
            {formatTokensAvailable(tokensAvailable)}
          </Heading>
        </HStack>
      </Box>
      <Menu>
        <MenuButton
          as={Button}
          variant="primary"
          maxWidth={"max-content"}
          minWidth={"max-content"}
        >
          Create Drop
        </MenuButton>
        <MenuList
          background={"black"}
          borderRadius={"md"}
          border={"1px solid var(--chakra-colors-brand-400)"}
          fontFamily={"mono"}
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
    </HStack>
  </>
);
