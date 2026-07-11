import { db } from "../config/database.js";
import { users } from "../models/user.model.js";

export const getAllUsersService = async () => {
  return await db.select().from(users);
};