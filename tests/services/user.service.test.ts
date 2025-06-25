
import request from 'supertest';
import app from '../../src/app';
import { connectToDatabase, disconnectToDatabase } from '../../src/config/database';
import { UserModel } from '../../src/models/user.model';
import { createTestUser, getAuthToken, getOne } from '../helpers/test.helpers';
import { MESSAGES } from '../../src/constants/messages';
import { IUser } from '../../src/interfaces/repositories/user.repository.interface';

jest.setTimeout(15000);

beforeAll(async () => {
    await connectToDatabase();
});

afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectToDatabase();
});

describe('User: Login', () => {
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

describe('User: Register', () => {
    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    it('Should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: 'New User',
                email: 'sebastianimfeld@gmail.com',
                passwordHash: 'StrongPass123!',
                role: 'user',
            });

        expect(res.status).toBe(201); // o 200 según tu implementación
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.email).toBe('sebastianimfeld@gmail.com');
        expect(res.body.data).toHaveProperty('emailVerified', false);
    });

    it('Should fail if email already exists', async () => {
        const access_token = await getAuthToken('sebastianimfeld@gmail.com');

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: 'User Dup',
                email: 'sebastianimfeld@gmail.com',
                passwordHash: 'StrongPass123!',
                role: 'user',
            });

        expect(res.status).toBe(409); // Conflict
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.USER.ALREADY_EXISTS);
    });

    it('Should fail if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({}); // vacío

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    });
});

describe('User: Change Password', () => {
    let access_token: string;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        access_token = await getAuthToken('sebastianimfeld@gmail.com'); // test@example.com por default
    });

    it('Should change password successfully', async () => {
        const res = await request(app)
            .post('/api/auth/change-password')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                currentPassword: 'StrongPass123!',
                newPassword: 'NewPass456!',
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);

        // Intentar login con nueva contraseña
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'sebastianimfeld@gmail.com',
                password: 'NewPass456!',
            });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty('success');
        expect(loginRes.body).toHaveProperty('data');
        expect(loginRes.body.data).toHaveProperty('access_token');
    });

    it('Should fail if current password is incorrect', async () => {
        const res = await request(app)
            .post('/api/auth/change-password')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                currentPassword: 'WrongPassword!',
                newPassword: 'NewPass456!',
            });

        expect(res.status).toBe(401);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTH.INCORRECT_CURRENT_PASSWORD);
    });

    it('Should fail if no token is provided', async () => {
        const res = await request(app)
            .post('/api/auth/change-password')
            .send({
                currentPassword: 'StrongPass123!',
                newPassword: 'NewPass456!',
            });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('errors');
    });
});

describe('User: Logout', () => {
    let access_token: string;
    let user: IUser | null;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        access_token = await getAuthToken('sebastianimfeld@gmail.com'); // test@example.com por default
        user = await getOne('sebastianimfeld@gmail.com');
    });


    it('Should logout successfully', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                refreshToken: user?.refreshToken
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.message).toBe(MESSAGES.SUCCESS.USER.LOGGED_OUT);

        user = await getOne('sebastianimfeld@gmail.com');
        expect(user?.refreshToken).toBe('');
    });
});

describe('User: Refresh token', () => {
    let access_token: string;
    let user: IUser | null;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        access_token = await getAuthToken('sebastianimfeld@gmail.com'); // test@example.com por default
        user = await getOne('sebastianimfeld@gmail.com');
    });


    it('Should refresh token successfully', async () => {
        const res = await request(app)
            .post('/api/auth/refresh-token')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                refreshToken: user?.refreshToken
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('access_token');
        expect(res.body.message).toBe(MESSAGES.SUCCESS.USER.TOKEN_REFRESHED);
    });
});

describe('User: Verify email', () => {

    let user: any;

    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    it('Should verify email successfully', async () => {

        await request(app)
            .post('/api/users')
            .send({
                name: 'New User',
                email: 'sebastianimfeld@gmail.com',
                passwordHash: 'StrongPass123!',
                role: 'user',
            });

        user = await getOne('sebastianimfeld@gmail.com');

        expect(user?.emailVerified).toBe(false);
        expect(user?.emailVerificationToken).not.toBe('');

        const res = await request(app)
            .get(`/api/auth/verify-email/${user.emailVerificationToken}`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.message).toBe(MESSAGES.SUCCESS.AUTH.EMAIL_VERIFIED);

        let userUpdated = await getOne('sebastianimfeld@gmail.com');
        expect(userUpdated?.emailVerified).toBe(true);
        expect(userUpdated?.emailVerificationToken).toBe('');
    });
});

describe('User: Resend verification email', () => {

    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    it('Should resend verification email successfully', async () => {

        await request(app)
            .post('/api/users')
            .send({
                name: 'New User',
                email: 'sebastianimfeld@gmail.com',
                passwordHash: 'StrongPass123!',
                role: 'user',
            });

        const res = await request(app)
            .post(`/api/auth/resend-verification`)
            .send({
                email: 'sebastianimfeld@gmail.com'
            })

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(MESSAGES.SUCCESS.AUTH.VERIFICATION_EMAIL_RESENT);
    });
});

describe('User: Update user', () => {
    let adminToken: string;
    let userToken: string;
    let userToUpdate: IUser | null;

    beforeEach(async () => {
        await UserModel.deleteMany({});

        adminToken = await getAuthToken('admin@example.com', 'StrongPass123!');
        userToken = await getAuthToken('user@example.com', 'StrongPass123!', 'user');

        userToUpdate = await getOne('user@example.com');
    });

    it('Should allow admin to update another user', async () => {
        const res = await request(app)
            .put(`/api/users/${userToUpdate?._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Name', role: 'admin' });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Updated Name');
        expect(res.body.data.role).toBe('admin');
    });

    it('Should allow user to update their own profile (but not role)', async () => {
        const res = await request(app)
            .put(`/api/users/${userToUpdate?._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Self Updated', role: 'admin' }); // el role debería ser ignorado o rechazado

        expect(res.status).toBe(403);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTHORIZATION.CANNOT_CHANGE_ROLE);
    });

    it('Should fail if user tries to update another user', async () => {
        // Creamos un segundo usuario
        await createTestUser({
            email: 'user2@example.com',
            password: 'StrongPass123!',
            role: 'user',
            emailVerified: true,
        });

        const user2 = await getOne('user2@example.com');

        const res = await request(app)
            .put(`/api/users/${user2?._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Nope' });

        expect(res.status).toBe(403);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    });

    it('Should fail if no token is provided', async () => {
        const res = await request(app)
            .put(`/api/users/${userToUpdate?._id}`)
            .send({ name: 'Anonymous Update' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('errors');
    });

    it('Should fail if user does not exist', async () => {
        const fakeId = '507f1f77bcf86cd799439011'; // MongoID válido pero no existente

        const res = await request(app)
            .put(`/api/users/${fakeId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Ghost' });

        expect(res.status).toBe(404);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.USER.NOT_FOUND);
    });
});