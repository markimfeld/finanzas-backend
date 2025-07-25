jest.mock("../../src/utils/email.util", () => ({
  sendEmailVerification: jest.fn(),
  sendResetPasswordEmail: jest.fn(),
}));
import request from "supertest";
import app from "../../src/app";
import { UserModel } from "../../src/models/user.model";
import { AuditLogModel } from "../../src/models/auditLog.model";
import { CategoryModel, ICategory } from "../../src/models/category.model";
import { getAuthToken, getOne, getOneBudget } from "../helpers/test.helpers";
import { setupMemoryMongoDB, teardownMemoryMongoDB } from "../setup";
import { BudgetModel, IBudget } from "../../src/models/budget.model";
import { MESSAGES } from "../../src/constants/messages";
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
  await teardownMemoryMongoDB();
});

describe("Budget: create budget", () => {
  let access_token: string;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    access_token = await getAuthToken("category@example.com", "StrongPass123!");
  });

  it("Should create a budget", async () => {
    const categoryResponse = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Category budget create",
      });

    const res = await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category: categoryResponse.body.data._id,
        amount: 300000,
        startDate: "2025-07-01",
        endDate: "2025-07-31",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.category).toBe(categoryResponse.body.data._id);
    expect(res.body.data.amount).toBe(300000);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(MESSAGES.SUCCESS.BUDGET.CREATED);
  });

  it("Should not create a budget without access token", async () => {
    const categoryResponse = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Category budget create without token",
      });
    const res = await request(app).post("/api/budgets").send({
      category: categoryResponse.body.data._id,
      amount: 300000,
      startDate: "2025-07-01",
      endDate: "2025-07-31",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should throw 400 error when startDate is bigger than endDate", async () => {
    const categoryResponse = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Category budget create",
      });

    const res = await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category: categoryResponse.body.data._id,
        amount: 300000,
        startDate: "2025-08-01",
        endDate: "2025-07-31",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe(
      MESSAGES.VALIDATION.BUDGET.START_DATE_MUST_BE_BEFORE_END_DATE
    );
  });

  it("Should throw 409 error when a budget already exists with the category and range dange provided", async () => {
    const categoryResponse = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Category budget create",
      });

    await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category: categoryResponse.body.data._id,
        amount: 300000,
        startDate: "2025-01-01",
        endDate: "2025-07-31",
      });

    const res = await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category: categoryResponse.body.data._id,
        amount: 300000,
        startDate: "2025-01-01",
        endDate: "2025-07-31",
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe(
      MESSAGES.VALIDATION.BUDGET.BUDGET_ALREADY_EXISTS
    );
  });
});

describe("Budget: get budgets", () => {
  let access_token: string;
  let another_access_token: string;
  let user: IUser | null;
  let category_1: ICategory;
  let category_2: ICategory;
  let anotherUser: IUser | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    access_token = await getAuthToken(
      "get_budgets@example.com",
      "StrongPass123!"
    );
    another_access_token = await getAuthToken(
      "another_user_budget@example.com",
      "StrongPass123!"
    );
    user = await getOne("get_budgets@example.com");
    anotherUser = await getOne("another_user_budget@example.com");

    category_1 = await CategoryModel.create({
      name: "Category 1",
      userId: user?._id,
    });
    category_2 = await CategoryModel.create({
      name: "Category 2",
      userId: user?._id,
    });
  });

  it("should return empty array when no budgets exist.", async () => {
    const res = await request(app)
      .get("/api/budgets?page=1&limit=10")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });

  it("should return budgets with pagination.", async () => {
    await BudgetModel.create([
      {
        name: "Budget 1",
        amount: 100,
        userId: user?._id,
        category: category_1._id,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
      },
      {
        name: "Budget 2",
        amount: 200,
        userId: user?._id,
        category: category_2._id,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-31"),
      },
    ]);

    const res = await request(app)
      .get("/api/budgets?page=1&limit=1")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.total).toBe(2);
    expect(res.body.pagination.pages).toBe(2);
  });

  it("should return the budgets of a specific range date when startDate and endDate were provided.", async () => {
    await BudgetModel.create([
      {
        amount: 100,
        userId: user?._id,
        category: category_1._id,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
      },
      {
        amount: 200,
        userId: user?._id,
        category: category_2._id,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-31"),
      },
    ]);

    const res = await request(app)
      .get(
        "/api/budgets?page=1&limit=10&startDate=2025-01-01&endDate=2025-01-31"
      )
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.total).toBe(1);
    expect(res.body.pagination.pages).toBe(1);
    expect(res.body.data[0].amount).toBe(100);
    expect(res.body.data[0].category).toBe(category_1._id.toString());
    expect(res.body.data[0].startDate).toBe(
      new Date("2025-01-01").toISOString()
    );
    expect(res.body.data[0].endDate).toBe(new Date("2025-01-31").toISOString());
  });

  it("should return the budgets of the logged-in user.", async () => {
    await BudgetModel.create([
      {
        amount: 100,
        userId: anotherUser?._id,
        category: category_1._id,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
      },
      {
        amount: 200,
        userId: user?._id,
        category: category_2._id,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-31"),
      },
    ]);

    const res = await request(app)
      .get("/api/budgets?page=1&limit=10")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.total).toBe(1);
    expect(res.body.pagination.pages).toBe(1);
    expect(res.body.data[0].amount).toBe(200);
    expect(res.body.data[0].category).toBe(category_2._id.toString());
  });

  it("should return 401 if no token is provided.", async () => {
    const res = await request(app).get("/api/budgets?page=1&limit=10");
    expect(res.status).toBe(401);
  });

  it("should return a budget by id.", async () => {
    await BudgetModel.create([
      {
        amount: 100,
        userId: user?._id,
        category: category_1._id,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
      },
      {
        amount: 200,
        userId: user?._id,
        category: category_2._id,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-31"),
      },
    ]);

    const budget = await getOneBudget(100);

    const res = await request(app)
      .get(`/api/budgets/${budget?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("amount");
    expect(res.body.data.amount).toBe(100);
    expect(res.body.data.category).toBe(category_1._id.toString());
  });

  it("should not return a budget if it doesnt belong to the user.", async () => {
    await BudgetModel.create([
      {
        amount: 100,
        userId: user?._id,
        category: category_1._id,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
      },
      {
        amount: 200,
        userId: user?._id,
        category: category_2._id,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-31"),
      },
    ]);

    const budget = await getOneBudget(100);

    const res = await request(app)
      .get(`/api/budgets/${budget?._id}`)
      .set("Authorization", `Bearer ${another_access_token}`);

    expect(res.status).toBe(403);
  });
});

describe("Budget: update budget", () => {
  let access_token: string;
  let another_access_token: string;
  let user: IUser | null;
  let anotherUser: IUser | null;
  let category_1: ICategory | null;
  let category_2: ICategory | null;
  let budgetToUpdate: IBudget | null;
  let anotherBudgetToUpdate: IBudget | null;
  let budgetToUpdateOtherUser: IBudget | null;
  let budgetStartDateWrong: IBudget | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    access_token = await getAuthToken(
      "update_budget@example.com",
      "StrongPass123!"
    );
    another_access_token = await getAuthToken(
      "another_user_budget@example.com",
      "StrongPass123!"
    );
    user = await getOne("update_budget@example.com");
    anotherUser = await getOne("another_user_budget@example.com");

    category_1 = await CategoryModel.create({
      name: "Category 1",
      userId: user?._id,
    });
    category_2 = await CategoryModel.create({
      name: "Category 2",
      userId: anotherUser?._id,
    });
    budgetToUpdate = await BudgetModel.create({
      amount: 50,
      userId: user?._id,
      category: category_1._id,
      startDate: "2025-07-01",
      endDate: "2025-07-31",
    });
    anotherBudgetToUpdate = await BudgetModel.create({
      amount: 50,
      userId: user?._id,
      category: "6873c347d12cb481cc4de0f6",
      startDate: "2025-07-01",
      endDate: "2025-07-31",
    });
    budgetToUpdateOtherUser = await BudgetModel.create({
      amount: 50,
      userId: anotherUser?._id,
      category: category_2._id,
      startDate: "2025-07-01",
      endDate: "2025-07-31",
    });
    budgetStartDateWrong = await BudgetModel.create({
      amount: 50,
      userId: user?._id,
      category: category_1._id,
      startDate: "2025-07-01",
      endDate: "2025-07-31",
    });
  });

  it("should update a budget by id.", async () => {
    const res = await request(app)
      .put(`/api/budgets/${budgetToUpdate?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        amount: 100,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("amount");
    expect(res.body.data.amount).toBe(100);
  });

  it("should return 401 if access_token is not provided.", async () => {
    const res = await request(app)
      .put(`/api/budgets/${budgetToUpdate?._id}`)
      .send({
        amount: 100,
      });

    expect(res.status).toBe(401);
  });

  it("should return 404 if category is not found", async () => {
    const res = await request(app)
      .put(`/api/budgets/${anotherBudgetToUpdate?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        amount: 100,
        category: "6873c347d12cb481cc4de0f5",
        startDate: "2025-08-01",
        endDate: "2025-07-31",
      });

    expect(res.status).toBe(404);
  });

  it("should return 403 if category doenst belong to the authenticated user.", async () => {
    const res = await request(app)
      .put(`/api/budgets/${budgetToUpdate?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        amount: 100,
        category: category_2?._id,
        startDate: "2025-07-01",
        endDate: "2025-07-31",
      });

    expect(res.status).toBe(403);
  });

  it("should return 403 if budget to update doesnt belong to the authenticated user.", async () => {
    const res = await request(app)
      .put(`/api/budgets/${budgetToUpdateOtherUser?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        amount: 100,
      });

    expect(res.status).toBe(403);
  });

  it("should return 400 if stardDate is greater than endDate.", async () => {
    const res = await request(app)
      .put(`/api/budgets/${budgetStartDateWrong?._id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category: category_1?._id,
        startDate: "2025-08-01",
        endDate: "2025-07-31",
      });

    expect(res.status).toBe(400);
  });
});

describe("Budget: delete budget", () => {
  let access_token: string;
  let other_token: string;
  let user: IUser | null;
  let category_1: ICategory | null;
  let budgetToDelete: IBudget | null;
  let budgetDeleted: IBudget | null;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await BudgetModel.deleteMany({});
    access_token = await getAuthToken(
      "delete_budget@example.com",
      "StrongPass123!"
    );
    other_token = await getAuthToken(
      "delete_budget_other@example.com",
      "StrongPass123!"
    );

    user = await getOne("delete_budget@example.com");

    category_1 = await CategoryModel.create({
      name: "Category 1",
      userId: user?._id,
    });

    budgetToDelete = await BudgetModel.create({
      amount: 50,
      userId: user?._id,
      category: category_1._id,
      startDate: "2025-07-01",
      endDate: "2025-07-31",
    });
    budgetDeleted = await BudgetModel.create({
      amount: 50,
      userId: user?._id,
      category: category_1._id,
      startDate: "2025-07-01",
      endDate: "2025-07-31",
      isDeleted: true,
    });
  });

  it("should delete a budget.", async () => {
    const res = await request(app)
      .delete(`/api/budgets/${budgetToDelete?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(MESSAGES.SUCCESS.BUDGET.DELETED);

    const updated = await BudgetModel.findById(budgetToDelete?._id);
    expect(updated?.isDeleted).toBe(true);
  });

  it("should not delete a budget of other user.", async () => {
    const res = await request(app)
      .delete(`/api/budgets/${budgetToDelete?._id}`)
      .set("Authorization", `Bearer ${other_token}`);

    expect(res.status).toBe(404);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.BUDGET.NOT_FOUNTD);
  });

  it("should not delete a budget that is already deleted.", async () => {
    const res = await request(app)
      .delete(`/api/budgets/${budgetDeleted?._id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(404);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.BUDGET.NOT_FOUNTD);
  });
});
