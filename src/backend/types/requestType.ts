import { Request } from "express";
import { IUser } from "../models/userModel";

export interface ReqWithUser extends Request {
  user: IUser;
}
