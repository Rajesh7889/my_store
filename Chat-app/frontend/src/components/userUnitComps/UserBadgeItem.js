import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={() => handleFunction(user._id)}
      cursor="pointer"
      px={2}
      py={1}
      mb={2}
      m={1}
      variant="solid"
      fontSize={12}
      backgroundColor={"purple"}
      color={"white"}
      borderRadius="lg"
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
