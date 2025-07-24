jest.mock("../../src/utils/email.util", () => ({
  sendEmailVerification: jest.fn(),
  sendResetPasswordEmail: jest.fn(),
}));
import request from "supertest";
import app from "../../src/app";
import { UserModel } from "../../src/models/user.model";
import { AuditLogModel } from "../../src/models/auditLog.model";
import { CategoryModel } from "../../src/models/category.model";
import { getAuthToken } from "../helpers/test.helpers";
import { setupMemoryMongoDB, teardownMemoryMongoDB } from "../setup";
import { MESSAGES } from "../../src/constants/messages";
import { BudgetModel } from "../../src/models/budget.model";
import { AccountModel } from "../../src/models/account.model";

jest.setTimeout(15000);

beforeAll(async () => {
  await setupMemoryMongoDB();
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await AuditLogModel.deleteMany({});
  await CategoryModel.deleteMany({});
  await BudgetModel.deleteMany({});
  await AccountModel.deleteMany({});
  await teardownMemoryMongoDB();
});

describe("Account: create account", () => {
  let access_token: string;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    access_token = await getAuthToken("account@example.com", "StrongPass123!");
  });

  it("Should create an account", async () => {
    const res = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Brubank",
        type: "bank",
        balance: 200000,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(MESSAGES.SUCCESS.ACCOUNT.CREATED);
    expect(res.body.data.name).toBe("Brubank");
  });

  it("Should not create an account without access token", async () => {
    const res = await request(app).post("/api/accounts").send({
      name: "Brubank",
      type: "bank",
      balance: 200000,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
  });
});
