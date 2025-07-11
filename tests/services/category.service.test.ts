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
import { MESSAGES } from '../../src/constants/messages';
import { BudgetModel } from '../../src/models/budget.model';

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

describe('Category: create category', () => {
    let access_token: string;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await AuditLogModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await BudgetModel.deleteMany({});
        access_token = await getAuthToken('category@example.com', 'StrongPass123!');
    });

    it('Should create a category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Category test"
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe(MESSAGES.SUCCESS.CATEGORY.CREATED);
        expect(res.body.data.name).toBe("Category test");
    });

    it('Should not create a category without access token', async () => {
        const res = await request(app)
            .post('/api/categories')
            .send({
                name: "Category test"
            });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('errors');
    });
});
