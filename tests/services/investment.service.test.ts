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

describe("Investment: create investment", () => {
  let access_token: string;
  let user1: IUser | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
    access_token = await getAuthToken(
      "investment@example.com",
      "StrongPass123!"
    );
    user1 = await getOne("investment@example.com");
  });

  it("Should create a investment", async () => {
    const res = await request(app)
      .post("/api/investments")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        userId: user1?._id,
        type: "etf",
        symbol: "SPY",
        description: "Compra de sp500",
        ratio: 20,
        fxRateSource: "CCL",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
  });

  it("Should not create an investment without access token", async () => {
    const res = await request(app).post("/api/investments").send({
      userId: user1?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
  });
});

describe("Investment: get investments.", () => {
  let access_token: string;
  let another_access_token: string;
  let user: IUser | null;
  let anotherUser: IUser | null;
  let investment: IInvestment | null;
  let investment2: IInvestment | null;
  let investment3: IInvestment | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});

    access_token = await getAuthToken(
      "get_investments@example.com",
      "StrongPass123!"
    );

    another_access_token = await getAuthToken(
      "get_investments2@example.com",
      "StrongPass1234!"
    );

    user = await getOne("get_investments@example.com");
    anotherUser = await getOne("get_investments2@example.com");

    investment = await InvestmentModel.create({
      userId: user?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });

    investment2 = await InvestmentModel.create({
      userId: user?._id,
      type: "stock",
      symbol: "SPY",
      description: "Compra mensual de apple",
      ratio: 20,
      fxRateSource: "CCL",
    });

    investment3 = await InvestmentModel.create({
      userId: anotherUser?._id,
      type: "stock",
      symbol: "SPY",
      description: "Compra mensual de apple",
      ratio: 20,
      fxRateSource: "CCL",
    });
  });

  it("should get all investments.", async () => {
    const res = await request(app)
      .get(`/api/investments`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should get investments limiting 1 and page 1.", async () => {
    const res = await request(app)
      .get(`/api/investments?limit=1&page=1`)
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
    const res = await request(app).get(`/api/investments`);

    expect(res.status).toBe(401);
  });

  it("should get only investments belong to the user logged in.", async () => {
    const res = await request(app)
      .get(`/api/investments`)
      .set("Authorization", `Bearer ${another_access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe("Investment: update investment.", () => {
  let access_token: string;
  let user1: IUser | null;
  let anInvestment: IInvestment | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    access_token = await getAuthToken(
      "investment@example.com",
      "StrongPass123!"
    );
    user1 = await getOne("investment@example.com");

    anInvestment = await InvestmentModel.create({
      userId: user1?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });
  });

  it("Should update a investment", async () => {
    expect(anInvestment?.description).toBe("Compra de sp500");

    const res = await request(app)
      .put(`/api/investments/${anInvestment?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        description: "Compras del sp500",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("description");
    expect(res.body.data.description).toBe("Compras del sp500");
  });

  it("Should return 401 if access token is not provided.", async () => {
    expect(anInvestment?.description).toBe("Compra de sp500");

    const res = await request(app)
      .put(`/api/investments/${anInvestment?._id}`)
      .send({
        description: "Compra de sp500",
      });

    expect(res.status).toBe(401);
  });
});

describe("Investment: delete investment.", () => {
  let access_token: string;
  let access_token2: string;
  let user1: IUser | null;
  let user2: IUser | null;
  let anInvestment: IInvestment | null;
  let anInvestment2: IInvestment | null;
  let anInvestment3: IInvestment | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await BudgetModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    access_token = await getAuthToken(
      "investment_delete@example.com",
      "StrongPass123!"
    );
    access_token2 = await getAuthToken(
      "investment_delete_2@example.com",
      "StrongPass123!"
    );

    user1 = await getOne("investment_delete@example.com");
    user2 = await getOne("investment_delete_2@example.com");

    anInvestment = await InvestmentModel.create({
      userId: user1?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });

    anInvestment2 = await InvestmentModel.create({
      userId: user2?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });

    anInvestment3 = await InvestmentModel.create({
      userId: user1?._id,
      type: "etf",
      symbol: "SPY",
      description: "Compra de sp500",
      ratio: 20,
      fxRateSource: "CCL",
    });
  });

  it("Should delete an investment", async () => {
    const res = await request(app)
      .delete(`/api/investments/${anInvestment?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    const resArr = await request(app)
      .get("/api/investments")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(MESSAGES.SUCCESS.INVESTMENT.DELETED);
    expect(resArr.body.data.length).toBe(1);
  });

  it("should return 401 if access token is not provided.", async () => {
    const res = await request(app).delete(
      `/api/investments/${anInvestment?._id}`
    );

    expect(res.status).toBe(401);
  });

  it("should delete an user own investment.", async () => {
    const res = await request(app)
      .delete(`/api/investments/${anInvestment2?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(404);
  });

  it("should return 404 if the user is trying to delete an investment already deleted.", async () => {
    await request(app)
      .delete(`/api/investments/${anInvestment3?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    const res = await request(app)
      .delete(`/api/investments/${anInvestment3?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(404);
  });
});
