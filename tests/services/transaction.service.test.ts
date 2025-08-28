jest.mock("../../src/utils/email.util", () => ({
  sendEmailVerification: jest.fn(),
  sendResetPasswordEmail: jest.fn(),
}));
import request from "supertest";
import app from "../../src/app";
import { UserModel } from "../../src/models/user.model";
import { AuditLogModel } from "../../src/models/auditLog.model";
import { CategoryModel, ICategory } from "../../src/models/category.model";
import { getAuthToken, getOne } from "../helpers/test.helpers";
import { setupMemoryMongoDB, teardownMemoryMongoDB } from "../setup";
import { MESSAGES } from "../../src/constants/messages";
import { BudgetModel } from "../../src/models/budget.model";
import { AccountModel, IAccount } from "../../src/models/account.model";
import {
  ITransaction,
  TransactionModel,
} from "../../src/models/transaction.model";
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
  await TransactionModel.deleteMany({});
  await teardownMemoryMongoDB();
});

describe("Transaction: create transaction", () => {
  let access_token: string;
  let category1: ICategory;
  let account1: IAccount;
  let user1: IUser | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
    access_token = await getAuthToken(
      "transaction@example.com",
      "StrongPass123!"
    );
    user1 = await getOne("transaction@example.com");

    category1 = await CategoryModel.create({
      name: "category1",
      userId: user1?._id,
    });

    account1 = await AccountModel.create({
      userId: user1?._id,
      balance: 100000,
      name: "Brubank",
      type: "bank",
    });
  });

  it("Should create a transaction", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category: category1._id,
        account: account1._id,
        amount: 7000,
        type: "expense",
        description: "helado",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(MESSAGES.SUCCESS.TRANSACTION.CREATED);
    expect(res.body.data.description).toBe("helado");
  });

  it("Should not create an account without access token", async () => {
    const res = await request(app).post("/api/transactions").send({
      category: "687403836d64792fb0d472ba",
      account: "6881ac3db871c650320e8fc9",
      amount: 7000,
      type: "expense",
      description: "helado",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
  });
});

describe("Transaction: get transactions.", () => {
  let access_token: string;
  let another_access_token: string;
  let another2_access_token: string;
  let anAccount: IAccount | null;
  let anAccount2: IAccount | null;
  let anAccount3: IAccount | null;
  let user: IUser | null;
  let anotherUser: IUser | null;
  let transaction1: ITransaction | null;
  let transaction2: ITransaction | null;
  let transaction3: ITransaction | null;
  let category1: ICategory | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});

    access_token = await getAuthToken(
      "get_transactions_paginate@example.com",
      "StrongPass123!"
    );

    another_access_token = await getAuthToken(
      "get_transactions2_paginate@example.com",
      "StrongPass1234!"
    );

    user = await getOne("get_transactions_paginate@example.com");
    anotherUser = await getOne("get_transactions2_paginate@example.com");

    anAccount = await AccountModel.create({
      name: "Brubank",
      type: "bank",
      balance: 100000,
      userId: user?._id,
    });

    category1 = await CategoryModel.create({
      name: "Categoriaa 1",
      userId: user?._id,
    });

    transaction1 = await TransactionModel.create({
      userId: user?._id,
      category: category1?._id,
      account: anAccount?._id,
      amount: 200,
      type: "expense",
      description: "test expense",
    });

    transaction2 = await TransactionModel.create({
      userId: user?._id,
      category: category1?._id,
      account: anAccount?._id,
      amount: 300,
      type: "expense",
      description: "test expense 2",
    });

    transaction3 = await TransactionModel.create({
      userId: anotherUser?._id,
      category: category1?._id,
      account: anAccount?._id,
      amount: 500,
      type: "expense",
      description: "test expense 3",
    });
  });

  it("should get all transactions.", async () => {
    const res = await request(app)
      .get(`/api/transactions`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should get transactions limiting 1 and page 1.", async () => {
    const res = await request(app)
      .get(`/api/transactions?limit=1&page=1`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body).toHaveProperty("pagination");
    expect(res.body.pagination).toHaveProperty("pages");
    expect(res.body.pagination).toHaveProperty("total");
    expect(res.body.pagination).toHaveProperty("page");
    expect(res.body.pagination).toHaveProperty("limit");
    expect(res.body.pagination.pages).toBe(2);
    expect(res.body.pagination.total).toBe(2);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(1);
  });

  it("should return 401 if access token is not provided.", async () => {
    const res = await request(app).get(`/api/transactions`);

    expect(res.status).toBe(401);
  });

  it("should get only transactions belong to the user logged in.", async () => {
    const res = await request(app)
      .get(`/api/transactions`)
      .set("Authorization", `Bearer ${another_access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe("Transaction: update transaction.", () => {
  let access_token: string;
  let other_access_token: string;
  let anAccount: IAccount | null;
  let user: IUser | null;
  let transaction1: ITransaction | null;
  let category1: ICategory | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
    access_token = await getAuthToken(
      "update_transaction@example.com",
      "StrongPass123!"
    );
    other_access_token = await getAuthToken(
      "other_update_account@example.com",
      "StrongPass123!"
    );
    user = await getOne("update_transaction@example.com");

    anAccount = await AccountModel.create({
      name: "Brubank",
      type: "bank",
      balance: 100000,
      userId: user?._id,
    });

    category1 = await CategoryModel.create({
      name: "Categoriaa 1",
      userId: user?._id,
    });

    transaction1 = await TransactionModel.create({
      userId: user?._id,
      category: category1?._id,
      account: anAccount?._id,
      amount: 200,
      type: "expense",
      description: "test expense",
    });
  });

  it("Should update a transaction", async () => {
    expect(transaction1?.amount).toBe(200);

    const res = await request(app)
      .put(`/api/transactions/${transaction1?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        amount: 500,
        description: "exp s",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("amount");
    expect(res.body.data.amount).toBe(500);
    expect(res.body.data.description).toBe("exp s");
  });

  it("should return 403 if transaction doenst belong to the authenticated user.", async () => {
    const res = await request(app)
      .put(`/api/transactions/${transaction1?._id}`)
      .set("Authorization", `Bearer ${other_access_token}`)
      .send({
        amount: 150000,
      });

    expect(res.status).toBe(403);
  });

  it("Should return 401 if access token is not provided.", async () => {
    const res = await request(app)
      .put(`/api/transactions/${transaction1?._id}`)
      .send({
        amount: 150000,
      });

    expect(res.status).toBe(401);
  });
});

describe("Transaction: delete transaction.", () => {
  let access_token: string;
  let other_access_token: string;
  let anAccount: IAccount | null;
  let user: IUser | null;
  let transaction1: ITransaction | null;
  let transaction2: ITransaction | null;
  let category1: ICategory | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
    access_token = await getAuthToken(
      "delete_transaction@example.com",
      "StrongPass123!"
    );
    other_access_token = await getAuthToken(
      "other_update_account@example.com",
      "StrongPass123!"
    );
    user = await getOne("delete_transaction@example.com");

    anAccount = await AccountModel.create({
      name: "Brubank",
      type: "bank",
      balance: 100000,
      userId: user?._id,
    });

    category1 = await CategoryModel.create({
      name: "Categoriaa 1",
      userId: user?._id,
    });

    transaction1 = await TransactionModel.create({
      userId: user?._id,
      category: category1?._id,
      account: anAccount?._id,
      amount: 200,
      type: "expense",
      description: "test expense",
    });

    transaction2 = await TransactionModel.create({
      userId: user?._id,
      category: category1?._id,
      account: anAccount?._id,
      amount: 200,
      type: "expense",
      description: "test expense 2",
    });
  });

  it("Should delete a transaction", async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transaction1?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(MESSAGES.SUCCESS.TRANSACTION.DELETED);
  });

  it("should return 401 if access token is not provided.", async () => {
    const res = await request(app).delete(
      `/api/transactions/${transaction1?._id}`
    );

    expect(res.status).toBe(401);
  });

  it("should delete an user own transaction.", async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transaction1?._id}`)
      .set("Authorization", `Bearer ${other_access_token}`);

    expect(res.status).toBe(404);
  });

  it("should return 404 if the user is trying to delete an account already deleted.", async () => {
    await request(app)
      .delete(`/api/transactions/${transaction2?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    const res = await request(app)
      .delete(`/api/transactions/${transaction2?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(404);
  });
});
