jest.mock("../../src/utils/email.util", () => ({
  sendEmailVerification: jest.fn(),
  sendResetPasswordEmail: jest.fn(),
}));
import request from "supertest";
import app from "../../src/app";
import { UserModel } from "../../src/models/user.model";
import { AuditLogModel } from "../../src/models/auditLog.model";
import { getAuthToken, getOne } from "../helpers/test.helpers";
import { setupMemoryMongoDB, teardownMemoryMongoDB } from "../setup";
import { MESSAGES } from "../../src/constants/messages";
import { BudgetModel } from "../../src/models/budget.model";
import { TransactionModel } from "../../src/models/transaction.model";
import { IUser } from "../../src/interfaces/repositories/user.repository.interface";
import {
  IInvestment,
  InvestmentModel,
} from "../../src/models/investment.model";
import { CategoryModel } from "../../src/models/category.model";
import { AccountModel } from "../../src/models/account.model";
import {
  IInvestmentTransaction,
  InvestmentTransactionModel,
} from "../../src/models/investmentTransaction.model";

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
  await InvestmentModel.deleteMany({});
  await teardownMemoryMongoDB();
});

describe("Investment transaction: create investment transaction.", () => {
  let access_token: string;
  let user1: IUser | null;
  let investment: IInvestment | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    await InvestmentTransactionModel.deleteMany({});
    access_token = await getAuthToken(
      "investment_transaction@example.com",
      "StrongPass123!"
    );
    user1 = await getOne("investment_transaction@example.com");

    investment = await InvestmentModel.create({
      userId: user1?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });
  });

  it("Should create a investment transaction", async () => {
    const res = await request(app)
      .post("/api/investmentTransactions")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        investmentId: investment?._id,
        operationDate: "2025-09-04",
        type: "buy",
        quantity: 1,
        price: 38000,
        amount: 38000,
        currency: "ARS",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
  });

  it("Should not create an investment transaction without access token", async () => {
    const res = await request(app).post("/api/investmentTransactions").send({
      investmentId: investment?._id,
      operationDate: "2025-09-04",
      type: "buy",
      quantity: 1,
      price: 38000,
      amount: 38000,
      currency: "ARS",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
  });
});

describe("Investment transactions: get investments transactions.", () => {
  let access_token: string;
  let another_access_token: string;
  let user: IUser | null;
  let anotherUser: IUser | null;
  let investmentTransaction: IInvestmentTransaction | null;
  let investmentTransaction2: IInvestmentTransaction | null;
  let investmentTransaction3: IInvestmentTransaction | null;
  let investment: IInvestment | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    await InvestmentTransactionModel.deleteMany({});

    access_token = await getAuthToken(
      "get_investment_transactions@example.com",
      "StrongPass123!"
    );

    another_access_token = await getAuthToken(
      "get_investment_transactions2@example.com",
      "StrongPass1234!"
    );

    user = await getOne("get_investment_transactions@example.com");
    anotherUser = await getOne("get_investment_transactions2@example.com");

    investment = await InvestmentModel.create({
      userId: user?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });

    investmentTransaction = await InvestmentTransactionModel.create({
      userId: user?._id,
      investmentId: investment?._id,
      operationDate: "2025-09-04",
      type: "buy",
      quantity: 1,
      price: 38000,
      amount: 38000,
      currency: "ARS",
    });

    investmentTransaction2 = await InvestmentTransactionModel.create({
      userId: user?._id,
      investmentId: investment?._id,
      operationDate: "2025-09-04",
      type: "buy",
      quantity: 1,
      price: 38000,
      amount: 38000,
      currency: "ARS",
    });

    investmentTransaction3 = await InvestmentTransactionModel.create({
      userId: user?._id,
      investmentId: investment?._id,
      operationDate: "2025-09-04",
      type: "buy",
      quantity: 1,
      price: 38000,
      amount: 38000,
      currency: "ARS",
    });
  });

  it("should get all investments transactions.", async () => {
    const res = await request(app)
      .get(`/api/investmentTransactions`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should get investments transactions limiting 1 and page 1.", async () => {
    const res = await request(app)
      .get(`/api/investmentTransactions?limit=1&page=1`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body).toHaveProperty("pagination");
    expect(res.body.pagination).toHaveProperty("pages");
    expect(res.body.pagination).toHaveProperty("total");
    expect(res.body.pagination).toHaveProperty("page");
    expect(res.body.pagination).toHaveProperty("limit");
    expect(res.body.pagination.pages).toBe(3);
    expect(res.body.pagination.total).toBe(3);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(1);
  });

  it("should return 401 if access token is not provided.", async () => {
    const res = await request(app).get(`/api/investmentTransactions`);

    expect(res.status).toBe(401);
  });

  it("should get only investments transactions belong to the user logged in.", async () => {
    const res = await request(app)
      .get(`/api/investmentTransactions`)
      .set("Authorization", `Bearer ${another_access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});

describe("Investment transaction: update investment transaction.", () => {
  let access_token: string;
  let user1: IUser | null;
  let anInvestment: IInvestment | null;
  let investmentTransaction: IInvestmentTransaction | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    await InvestmentTransactionModel.deleteMany({});

    access_token = await getAuthToken(
      "investment_transaction@example.com",
      "StrongPass123!"
    );
    user1 = await getOne("investment_transaction@example.com");

    anInvestment = await InvestmentModel.create({
      userId: user1?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });

    investmentTransaction = await InvestmentTransactionModel.create({
      userId: user1?._id,
      investmentId: anInvestment?._id,
      operationDate: "2025-09-04",
      type: "buy",
      quantity: 1,
      price: 38000,
      amount: 38000,
      currency: "ARS",
    });
  });

  it("Should update an investment transaction", async () => {
    expect(investmentTransaction?.quantity).toBe(1);
    expect(investmentTransaction?.amount).toBe(38000);

    const res = await request(app)
      .put(`/api/investmentTransactions/${investmentTransaction?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        quantity: 2,
        amount: 76000,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
    expect(res.body.data?.quantity).toBe(2);
    expect(res.body.data?.amount).toBe(76000);
  });

  it("Should return 401 if access token is not provided.", async () => {
    const res = await request(app)
      .put(`/api/investmentTransactions/${investmentTransaction?._id}`)
      .send({
        quantity: 2,
        amount: 38000,
      });

    expect(res.status).toBe(401);
  });
});

describe("Investment transaction: delete investment transaction.", () => {
  let access_token: string;
  let access_token_2: string;
  let user: IUser | null;
  let anInvestment: IInvestment | null;
  let investmentTransaction: IInvestmentTransaction | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    access_token = await getAuthToken(
      "investment_transaction_delete@example.com",
      "StrongPass123!"
    );
    access_token_2 = await getAuthToken(
      "investment_transaction_delete2@example.com",
      "StrongPass123!"
    );

    user = await getOne("investment_transaction_delete@example.com");

    anInvestment = await InvestmentModel.create({
      userId: user?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });

    investmentTransaction = await InvestmentTransactionModel.create({
      userId: user?._id,
      investmentId: anInvestment?._id,
      operationDate: "2025-09-04",
      type: "buy",
      quantity: 1,
      price: 38000,
      amount: 38000,
      currency: "ARS",
    });
  });

  it("Should delete an investment transaction", async () => {
    const res = await request(app)
      .delete(`/api/investmentTransactions/${investmentTransaction?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    const resArr = await request(app)
      .get("/api/investmentTransactions")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      MESSAGES.SUCCESS.INVESTMENT_TRANSACTION.DELETED
    );
    expect(resArr.body.data.length).toBe(0);
  });

  it("should return 401 if access token is not provided.", async () => {
    const res = await request(app).delete(
      `/api/investmentTransactions/${investmentTransaction?._id}`
    );

    expect(res.status).toBe(401);
  });

  it("should delete an user own investment transaction.", async () => {
    const res = await request(app)
      .delete(`/api/investmentTransactions/${investmentTransaction?._id}`)
      .set("Authorization", `Bearer ${access_token_2}`);

    expect(res.status).toBe(404);
  });

  it("should return 404 if the user is trying to delete an investment transaction already deleted.", async () => {
    await request(app)
      .delete(`/api/investmentTransactions/${investmentTransaction?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    const res = await request(app)
      .delete(`/api/investmentTransactions/${investmentTransaction?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(404);
  });
});
