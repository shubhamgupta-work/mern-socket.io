import { IUser } from "../Context/ChatProvider";

export const getSender = (loggedUser: IUser, users: IUser[]): string => {
  return users[0]?._id === loggedUser._id ? users[1].name : users[0]?.name;
};

export const getSenderFull = (loggedUser: IUser, users: IUser[]): IUser => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
