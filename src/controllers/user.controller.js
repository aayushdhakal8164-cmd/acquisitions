import { getAllUsersService } from "../services/user.service.js";
import { successResponse } from "../utils/apiResponse.js";
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();

return successResponse(
  res,
  200,
  "Users fetched successfully",
  users
);
  } catch (error) {
    return next(error);
  }
};
export const getUserById = async (req, res) => {
  return res.json({
    message: `Get user ${req.params.id}`,
  });
};

export const updateUser = async (req, res) => {
  return res.json({
    message: `Update user ${req.params.id}`,
  });
};

export const deleteUser = async (req, res) => {
  return res.json({
    message: `Delete user ${req.params.id}`,
  });
};