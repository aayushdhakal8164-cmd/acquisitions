import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
import { db } from "../config/database.js";
import { users } from "../models/user.model.js";
import { eq } from "drizzle-orm";

// ========================
// SIGN UP
// ========================
export const signupService = async ({ name, email, password, role }) => {
  console.log("🔥 signupService is running");

  // Check if email already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Development logs
  console.log("\n========== USER CREATED ==========");
  console.log("Name     :", name);
  console.log("Email    :", email);
  console.log("Role     :", role);
  console.log("Password :", password);
  console.log("Hash     :", hashedPassword);
  console.log("==================================\n");

  // Insert user
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  // Show database record
  const [savedUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, newUser.id));

  console.log("\n========== DATABASE RECORD ==========");
  console.dir(savedUser, { depth: null });
  console.log("=====================================\n");

  return newUser;
};

// ========================
// SIGN IN
// ========================
export const signinService = async ({ email, password }) => {
  console.log("🔥 signinService is running");
  console.log("\n========== ALL USERS ==========");

  const allUsers = await db.select().from(users);

  console.dir(allUsers, { depth: null });

  console.log("================================\n");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  console.log("\n========== LOGIN DEBUG ==========");
  console.log("Input Email    :", email);
  console.log("Input Password :", password);
  console.log("User Found     :", !!user);

  if (user) {
    console.log("DB Email       :", user.email);
    console.log("DB Hash        :", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match :", passwordMatch);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    console.log("JWT Created Successfully ✅");
    console.log("===============================\n");

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  console.log("===============================\n");

  throw new Error("Invalid email or password");
};

export const getAllUsersService = async () => {
  const usersList = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    createdAt: users.created_at,
    updatedAt: users.updated_at,
  }).from(users);

  return usersList;
};