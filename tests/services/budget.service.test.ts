jest.mock('../../src/utils/email.util', () => ({
    sendEmailVerification: jest.fn(),
    sendResetPasswordEmail: jest.fn()
}));
import request from 'supertest';
import app from '../../src/app';
import { UserModel } from '../../src/models/user.model';
import { AuditLogModel } from '../../src/models/auditLog.model';
import { CategoryModel } from '../../src/models/category.model';
import { getAuthToken } from '../helpers/test.helpers';
import { setupMemoryMongoDB, teardownMemoryMongoDB } from '../setup';
import { BudgetModel } from '../../src/models/budget.model';
import { MESSAGES } from '../../src/constants/messages';

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

describe('Budget: create budget', () => {
    let access_token: string;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await AuditLogModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await BudgetModel.deleteMany({});
        access_token = await getAuthToken('category@example.com', 'StrongPass123!');
    });


    it('Should create a budget', async () => {

        const categoryResponse = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Category budget create"
            })


        const res = await request(app)
            .post('/api/budgets')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                category: categoryResponse.body.data._id,
                amount: 300000,
                startDate: "2025-07-01",
                endDate: "2025-07-31"
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.category).toBe(categoryResponse.body.data._id);
        expect(res.body.data.amount).toBe(300000);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe(MESSAGES.SUCCESS.BUDGET.CREATED);
    });

    it('Should not create a budget without access token', async () => {
        const categoryResponse = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Category budget create without token"
            })
        const res = await request(app)
            .post('/api/budgets')
            .send({
                category: categoryResponse.body.data._id,
                amount: 300000,
                startDate: "2025-07-01",
                endDate: "2025-07-31"
            });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('errors');
    });

    it('Should throw 400 error when startDate is bigger than endDate', async () => {

        const categoryResponse = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Category budget create"
            })


        const res = await request(app)
            .post('/api/budgets')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                category: categoryResponse.body.data._id,
                amount: 300000,
                startDate: "2025-08-01",
                endDate: "2025-07-31"
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0].message).toBe(MESSAGES.VALIDATION.BUDGET.START_DATE_MUST_BE_BEFORE_END_DATE);
    });

    it('Should throw 409 error when a budget already exists with the category and range dange provided', async () => {

        const categoryResponse = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Category budget create"
            })


        await request(app)
            .post('/api/budgets')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                category: categoryResponse.body.data._id,
                amount: 300000,
                startDate: "2025-01-01",
                endDate: "2025-07-31"
            });

        const res = await request(app)
            .post('/api/budgets')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                category: categoryResponse.body.data._id,
                amount: 300000,
                startDate: "2025-01-01",
                endDate: "2025-07-31"
            });



        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0].message).toBe(MESSAGES.VALIDATION.BUDGET.BUDGET_ALREADY_EXISTS);
    });
});
