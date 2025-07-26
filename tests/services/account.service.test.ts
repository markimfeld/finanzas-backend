jest.mock("../../src/utils/email.util", () => ({
  sendEmailVerification: jest.fn(),
  sendResetPasswordEmail: jest.fn(),
}));
import request from "supertest";
import app from "../../src/app";
import { UserModel } from "../../src/models/user.model";
import { AuditLogModel } from "../../src/models/auditLog.model";
import { CategoryModel } from "../../src/models/category.model";
import { getAuthToken, getOne } from "../helpers/test.helpers";
import { setupMemoryMongoDB, teardownMemoryMongoDB } from "../setup";
import { MESSAGES } from "../../src/constants/messages";
import { BudgetModel } from "../../src/models/budget.model";
import { AccountModel, IAccount } from "../../src/models/account.model";
import { IUser } from "../../src/interfaces/repositories/user.repository.interface";

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

describe("Account: update account.", () => {
  let access_token: string;
  let other_access_token: string;
  let anAccount: IAccount | null;
  let user: IUser | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    access_token = await getAuthToken(
      "update_account@example.com",
      "StrongPass123!"
    );
    other_access_token = await getAuthToken(
      "other_update_account@example.com",
      "StrongPass123!"
    );
    user = await getOne("update_account@example.com");

    anAccount = await AccountModel.create({
      name: "Brubank",
      type: "bank",
      balance: 100000,
      userId: user?._id,
    });
  });

  it("Should update an account", async () => {
    expect(anAccount?.balance).toBe(100000);

    const res = await request(app)
      .put(`/api/accounts/${anAccount?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        balance: 150000,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("balance");
    expect(res.body.data.balance).toBe(150000);
  });

  it("should return 403 if account doenst belong to the authenticated user.", async () => {
    const res = await request(app)
      .put(`/api/accounts/${anAccount?._id}`)
      .set("Authorization", `Bearer ${other_access_token}`)
      .send({
        balance: 150000,
      });

    expect(res.status).toBe(403);
  });

  it("Should return 401 if access token is not provided.", async () => {
    expect(anAccount?.balance).toBe(100000);

    const res = await request(app).put(`/api/accounts/${anAccount?._id}`).send({
      balance: 150000,
    });

    expect(res.status).toBe(401);
  });
});
