
import request from 'supertest';
import app from '../../../src/app';
import { connectToDatabase, disconnectToDatabase } from '../../../src/config/database';
import { UserModel } from '../../../src/models/user.model';
import Hasher from '../../../src/utils/hash.util';
import { createTestUser } from '../../helpers/test.helpers';
import { MESSAGES } from '../../../src/constants/messages';

const hasher = Hasher.getInstance();

beforeAll(async () => {
    await connectToDatabase();
});

afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectToDatabase();
});

describe('Auth: Login', () => {
    const userData = {
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'StrongPass123!',
        role: 'admin',
        emailVerified: true,
    };

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await createTestUser();
        await createTestUser({ email: 'test2@example.com', emailVerified: false });
    });

    it('Should login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.passwordHash });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('access_token');
        expect(res.body.data.user.email).toBe(userData.email);
        expect(res.body.data.access_token).toMatch(/^eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/);
    });

    it('Should failed with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: 'WrongPass123!' });

        expect(res.status).toBe(400);
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
    });

    it('Should failed if email not exist', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'notFound@example.com', password: userData.passwordHash });

        expect(res.status).toBe(400);
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.USER.NOT_FOUND);
    });

    it('Should failed if email is not verify', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test2@example.com', password: userData.passwordHash });

        expect(res.status).toBe(401);
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toHaveProperty('message');
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTH.EMAIL_NOT_VERIFIED);
    });
});
