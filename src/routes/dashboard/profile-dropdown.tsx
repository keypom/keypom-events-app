import {
  Box,
  Flex,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";

const ProfileDropdown = ({ profile, handleLogout }) => {
  return (
    profile && (
      <Menu>
        <MenuButton
          as={Flex}
          alignItems="center"
          cursor="pointer"
          bg="brand.400"
          px={3}
          borderRadius="md"
          py={2}
          boxShadow="sm"
          _hover={{ bg: "brand.600" }}
          transition="background-color 0.3s ease"
        >
          <HStack>
            <Avatar
              size="md"
              name={profile.name}
              src={profile.picture}
              borderColor="bg.primary"
              borderWidth="2px"
            />
            <Box ml={3} textAlign="left">
              <Text color="bg.primary" fontSize="md" noOfLines={1}>
                {profile.name}
              </Text>
              <Text color="bg.primary" fontSize="sm" noOfLines={1}>
                {profile.email}
              </Text>
            </Box>
            <IconButton
              icon={<FiChevronDown />}
              aria-label="Profile Menu"
              bg="transparent"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              _focus={{ boxShadow: "none" }}
              ml={3}
              color="bg.primary"
              fontSize="20px"
            />
          </HStack>
        </MenuButton>
        <MenuList
          bg="brand.400 !important"
          borderColor="brand.600 !important"
          borderRadius="md"
          w="full"
          py={2}
          mt={2}
          boxShadow="lg"
        >
          <MenuItem
            onClick={handleLogout}
            icon={<FiLogOut />}
            color="bg.primary"
            bg="brand.400"
            _hover={{ bg: "brand.600 !important", color: "bg.primary" }}
            _focus={{ bg: "brand.400 " }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    )
  );
};

export default ProfileDropdown;
