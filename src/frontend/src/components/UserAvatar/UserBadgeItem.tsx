import { Badge } from "@chakra-ui/react";
import { FC } from "react";
import { IUser } from "../../Context/ChatProvider";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem: FC<{ user: IUser; handleFunction: () => void; admin?: string }> = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
