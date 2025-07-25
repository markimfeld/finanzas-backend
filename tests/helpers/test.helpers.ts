import { UserModel } from "../../src/models/user.model";
import Hasher from "../../src/utils/hash.util";

import request from "supertest";
import app from "../../src/app";
import { IUser } from "../../src/interfaces/repositories/user.repository.interface";
import { BudgetModel, IBudget } from "../../src/models/budget.model";

const hasher = Hasher.getInstance();

export async function createTestUser(
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    emailVerified: boolean;
    isActive: boolean;
  }> = {}
) {
  const password = overrides.password || "StrongPass123!";
  const hashedPassword = await hasher.hash(password);

  const user = new UserModel({
    name: overrides.name || "Test User",
    email: overrides.email || "test@example.com",
    passwordHash: hashedPassword,
    role: overrides.role || "admin",
    emailVerified: overrides.emailVerified ?? true,
    isActive: overrides.isActive ?? true,
  });

  await user.save();

  return { user, plainPassword: password };
}

export async function getAuthToken(
  email = "test@example.com",
  password = "StrongPass123!",
  role = "admin",
  isActive = true
) {
  // Asegurate de que exista el usuario
  await createTestUser({
    email,
    password: password,
    emailVerified: true,
    role,
    isActive,
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  if (res.status !== 200 || !res.body.data?.access_token) {
    throw new Error(`No se pudo obtener el token. Status: ${res.status}`);
  }

  return res.body.data.access_token;
}

export async function getOne(email = "test@example.com") {
  return await UserModel.findOne({ email }).lean<IUser>().exec();
}

export async function getOneBudget(amount: number) {
  return await BudgetModel.findOne({ amount }).lean<IBudget>().exec();
}
