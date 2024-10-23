import React from "react";
import {
  VStack,
  HStack,
  Textarea,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  FormControl as ChakraFormControl,
  Image,
  Text,
} from "@chakra-ui/react";
import { FormControl } from "@/components/dashboard/form-control";
import { ImageInput } from "./image-input";
import { MULTICHAIN_NETWORKS } from "@/constants/common";

interface NFTInformationProps {
  createdDrop: any;
  setCreatedDrop: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  isAdmin: Boolean;
}

export const NFTInformation: React.FC<NFTInformationProps> = ({
  createdDrop,
  setCreatedDrop,
  errors,
  isAdmin,
}) => {
  const onNFTDataChange = (key: string, value: string) => {
    setCreatedDrop({
      ...createdDrop,
      nftData: { ...createdDrop.nftData, [key]: value },
    });
  };

  const onChainSelect = (chainId: string) => {
    setCreatedDrop({
      ...createdDrop,
      chain: chainId,
    });
  };

  const selectedChainInfo =
    MULTICHAIN_NETWORKS.find((c) => c.id === createdDrop.chain) ||
    MULTICHAIN_NETWORKS.find((c) => c.id === "near")!; // Default to NEAR

  return (
    <>
      <VStack spacing={4} w="100%">
        <HStack spacing={6} w="100%">
          {/* NFT Title */}
          <FormControl
            label="NFT Title"
            required={true}
            errorText={errors.nft?.title}
            my="1"
          >
            <Textarea
              borderRadius={"md"}
              height="35px"
              maxLength={500}
              background={"#F2F1EA"}
              color={"black"}
              fontFamily={"mono"}
              fontWeight={"700"}
              size="sm"
              placeholder="Coolest NFT ever"
              sx={{
                "::placeholder": {
                  color: "gray.500",
                  fontSize: { base: "xs", md: "sm" },
                  fontFamily: "mono",
                },
              }}
              value={createdDrop.nftData?.title || ""}
              onChange={(e) => onNFTDataChange("title", e.target.value)}
              isInvalid={!!errors.nft?.title}
            />
          </FormControl>
          {/* NFT Description */}
          <FormControl
            label="NFT Description"
            required={true}
            errorText={errors.nft?.description}
          >
            <Textarea
              borderRadius={"md"}
              height="35px"
              maxLength={500}
              background={"#F2F1EA"}
              color={"black"}
              fontFamily={"mono"}
              fontWeight={"700"}
              size="sm"
              placeholder="One of a kind proof of touch"
              sx={{
                "::placeholder": {
                  color: "gray.500",
                  fontSize: { base: "xs", md: "sm" },
                  fontFamily: "mono",
                },
              }}
              value={createdDrop.nftData?.description || ""}
              onChange={(e) => onNFTDataChange("description", e.target.value)}
              isInvalid={!!errors.nft?.description}
            />
          </FormControl>
        </HStack>
        {/* Chain Selector */}
        <FormControl
          label="Select Chain"
          required={true}
          errorText={errors.chain}
          my="1"
        >
          <ChakraFormControl>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                width="full"
                textAlign="left"
              >
                <HStack w="100%">
                  <Image src={selectedChainInfo.icon} boxSize="16px" />
                  <Text>{selectedChainInfo.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList
                background={"black"}
                borderRadius={"md"}
                border={"1px solid var(--chakra-colors-brand-400)"}
                fontFamily={"mono"}
              >
                {MULTICHAIN_NETWORKS.filter(
                  (chain) => !(!isAdmin && chain.id === "eth"),
                ).map((chain) => (
                  <MenuItem
                    key={chain.id}
                    onClick={() => onChainSelect(chain.id)}
                    background="black"
                    color="white"
                    _hover={{
                      background: "black",
                      color: "brand.400",
                    }}
                  >
                    <HStack>
                      <Image src={chain.icon} boxSize="16px" />
                      <Text>{chain.name}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </ChakraFormControl>
        </FormControl>
        {/* Image Input */}
        <ImageInput
          createdDrop={createdDrop}
          setCreatedDrop={setCreatedDrop}
          errors={errors}
        />
      </VStack>
    </>
  );
};
