/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, HStack, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { FormControlComponent } from "@/components/dashboard/FormControl";

interface DropTokenAmountSelectorProps {
  errors: any;
  currentDrop: any;
  setCurrentDrop: (drop: any) => void;
}

export default function DropTokenAmountSelector({
  errors,
  currentDrop,
  setCurrentDrop,
}: DropTokenAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState("");
  console.log("Incoming drop: ", currentDrop);
  const presetAmounts = [1, 5, 10, 50];

  const handleCustomAmountSubmit = () => {
    let amount = customAmount;
    try {
      if (parseFloat(amount) < 0.1 || isNaN(parseFloat(amount))) {
        amount = "0.1";
        setCustomAmount("0.1");
      }
    } catch (e) {
      amount = "";
      setCustomAmount("");
      console.log("Error parsing float: ", e);
    }
    setCurrentDrop({ ...currentDrop, amount: amount });
  };

  const handlePresetAmountClick = (amount: number) => {
    setCustomAmount("");
    setCurrentDrop({ ...currentDrop, amount: String(amount) });
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setCustomAmount(newAmount);
  };

  return (
    <FormControlComponent
      errorText={errors.amount}
      label="Token amount"
      required={true}
      labelProps={{ fontSize: { base: "xs", md: "md" } }}
      fontFamily={"mono"}
      marginY="2"
    >
      <VStack alignItems="flex-start">
        <HStack justifyContent="space-between" width="100%">
          <HStack width="75%">
            {presetAmounts.map((amount) => (
              <Box
                key={amount}
                alignItems="center"
                border="2px solid"
                borderRadius="md"
                color={
                  currentDrop.amount === String(amount) ? "black" : "brand.400"
                }
                display="flex"
                fontSize={{ base: "xs", md: "sm" }}
                height="30px"
                justifyContent="center"
                sx={{
                  bg:
                    currentDrop.amount === String(amount)
                      ? "brand.400"
                      : "black",
                  cursor: "pointer",
                  borderColor:
                    currentDrop.amount === String(amount)
                      ? "white"
                      : "brand.400",
                  ":hover": {
                    background: "brand.400",
                    color: "black",
                  },
                }}
                width="20%"
                onClick={() => {
                  handlePresetAmountClick(amount);
                }}
              >
                {amount}
              </Box>
            ))}
          </HStack>
          <Input
            key="custom"
            border="2px solid"
            borderColor={"brand.400"}
            borderRadius="md"
            fontFamily={"mono"}
            fontWeight={"700"}
            color={
              presetAmounts.includes(Number(currentDrop.amount))
                ? "black"
                : "black"
            }
            _placeholder={{
              color: "black",
              fontSize: { base: "xs", md: "sm" },
              fontFamily: "mono",
            }}
            height="30px"
            id="customAmountInput"
            placeholder="Custom"
            size={{ base: "xs", md: "sm" }}
            sx={{
              bg: !presetAmounts.includes(Number(currentDrop.amount))
                ? "tertiary"
                : "tertiary",
            }}
            textAlign="center"
            type="number"
            value={customAmount}
            width="30%"
            onBlur={handleCustomAmountSubmit}
            onChange={handleCustomAmountChange}
          />
        </HStack>
      </VStack>
    </FormControlComponent>
  );
}
