
jest.mock('../../src/utils/email.util', () => ({
    sendEmailVerification: jest.fn(),
    sendResetPasswordEmail: jest.fn()
}));
import request from 'supertest';
import app from '../../src/app';
import { connectToDatabase, disconnectToDatabase } from '../../src/config/database';
import { UserModel } from '../../src/models/user.model';
import { createTestUser, getAuthToken, getOne } from '../helpers/test.helpers';
import { MESSAGES } from '../../src/constants/messages';
import { IUser } from '../../src/interfaces/repositories/user.repository.interface';
import Hasher from '../../src/utils/hash.util';

jest.setTimeout(15000);

const hasher = Hasher.getInstance();

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

    it('should not allow login if user is inactive', async () => {
        const inactiveUser = await createTestUser({
            email: 'inactive@example.com',
            isActive: false,
            emailVerified: true,
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: inactiveUser.user.email,
                password: 'StrongPass123!',
            });

        expect(res.status).toBe(401);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.USER.NOT_FOUND);
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
                email: 'anEmail@example.com',
                passwordHash: 'StrongPass123!',
                role: 'user',
            });

        expect(res.status).toBe(201); // o 200 según tu implementación
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.email).toBe('anEmail@example.com');
        expect(res.body.data).toHaveProperty('emailVerified', false);
    });

    it('Should fail if email already exists', async () => {
        const access_token = await getAuthToken('anEmail@example.com');

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: 'User Dup',
                email: 'anEmail@example.com',
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

    it('Should fail if it is given weak password', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: 'User Dup',
                email: 'anEmail@example.com',
                passwordHash: 'StrongPa',
                role: 'user',
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
        expect(res.body.errors[0].message).toBe(MESSAGES.VALIDATION.USER.PASSWORD_WEAK);
    });
});

describe('User: Change Password', () => {
    let access_token: string;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        access_token = await getAuthToken('change_password@example.com'); // test@example.com por default
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
                email: 'change_password@example.com',
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
        access_token = await getAuthToken('logout_user@example.com'); // test@example.com por default
        user = await getOne('logout_user@example.com');
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

        user = await getOne('logout_user@example.com');
        expect(user?.refreshToken).toBe('');
    });
});

describe('User: Refresh token', () => {
    let access_token: string;
    let user: IUser | null;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        access_token = await getAuthToken('refres_token@example.com'); // test@example.com por default
        user = await getOne('refres_token@example.com');
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
                email: 'verify_email@example.com',
                passwordHash: 'StrongPass123!',
                role: 'user',
            });

        user = await getOne('verify_email@example.com');

        expect(user?.emailVerified).toBe(false);
        expect(user?.emailVerificationToken).not.toBe('');

        const res = await request(app)
            .get(`/api/auth/verify-email/${user.emailVerificationToken}`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.message).toBe(MESSAGES.SUCCESS.AUTH.EMAIL_VERIFIED);

        let userUpdated = await getOne('verify_email@example.com');
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
                email: 'resend_verification_email@example.com',
                passwordHash: 'StrongPass123!',
                role: 'user',
            });

        const res = await request(app)
            .post(`/api/auth/resend-verification`)
            .send({
                email: 'resend_verification_email@example.com'
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

describe('User: Forgot Password', () => {
    const email = 'forgot@example.com';

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await createTestUser({ email });
    });

    it('should send 200 even if email does not exist', async () => {
        const res = await request(app).post('/api/auth/forgot-password').send({
            email: 'doesnotexist@example.com',
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.message).toBe(MESSAGES.SUCCESS.AUTH.RESET_EMAIL_SENT);
    });

    it('should send reset email and return 200 if email exists', async () => {
        const res = await request(app).post('/api/auth/forgot-password').send({
            email,
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.message).toBe(MESSAGES.SUCCESS.AUTH.RESET_EMAIL_SENT);

        const user = await UserModel.findOne({ email });

        expect(user?.resetPasswordToken).not.toBe('');
        expect(user?.resetPasswordTokenExpires).not.toBe('');
    });
});

describe('User: Reset Password', () => {
    const email = 'resetpass@example.com';
    let resetToken: string;

    beforeEach(async () => {
        await UserModel.deleteMany({});

        // Crear usuario manualmente con token válido
        resetToken = 'validresettoken123';

        const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

        await UserModel.create({
            name: 'User Reset',
            email,
            passwordHash: 'OldPass123!',
            role: 'user',
            emailVerified: true,
            resetPasswordToken: resetToken,
            resetPasswordTokenExpires: expires,
        });
    });

    it('should reset password with valid token', async () => {
        const res = await request(app)
            .post(`/api/auth/reset-password/${resetToken}`)
            .send({
                newPassword: 'NewPassword456!',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(MESSAGES.SUCCESS.AUTH.PASSWORD_UPDATED);

        const user = await UserModel.findOne({ email });

        expect(user?.resetPasswordToken).toBe('');
        expect(user?.resetPasswordTokenExpires.getTime()).toBeLessThan(Date.now());

        const isMatch = await hasher.compare('NewPassword456!', user!.passwordHash);
        expect(isMatch).toBe(true);

        const stillOld = await hasher.compare('OldPass123!', user!.passwordHash);
        expect(stillOld).toBe(false);
    });

    it('should fail if token is invalid', async () => {
        const res = await request(app)
            .post(`/api/auth/reset-password/invalidtoken`)
            .send({
                newPassword: 'Whatever123!',
            });

        expect(res.status).toBe(400);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTH.INVALID_OR_EXPIRED_TOKEN);
    });

    it('should fail if token is expired', async () => {
        // Expirar manualmente el token
        await UserModel.updateOne({ email }, { resetPasswordTokenExpires: new Date(Date.now() - 1000) });

        const res = await request(app)
            .post(`/api/auth/reset-password/${resetToken}`)
            .send({
                newPassword: 'Whatever123!',
            });

        expect(res.status).toBe(400);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTH.INVALID_OR_EXPIRED_TOKEN);
    });
});

describe('User: Get by ID', () => {
    let adminToken: string;
    let userToken: string;
    let admin: IUser | any;
    let user: IUser | any;

    beforeEach(async () => {
        await UserModel.deleteMany({});

        adminToken = await getAuthToken('admin_getId@example.com', 'StrongPass123!');
        userToken = await getAuthToken('user_getId@example.com', 'StrongPass123!', 'user');

        admin = await getOne('admin_getId@example.com');
        user = await getOne('user_getId@example.com');
    });

    it('should allow admin to get any user', async () => {
        const res = await request(app)
            .get(`/api/users/${user._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(user.email);
    });

    it('should allow user to get themselves', async () => {
        const res = await request(app)
            .get(`/api/users/${user._id}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(user.email);
    });

    it('should forbid user from accessing another user', async () => {
        const res = await request(app)
            .get(`/api/users/${admin._id}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    });

    it('should return 404 if user not found', async () => {
        const nonExistingId = '507f1f77bcf86cd799439011'; // ID válido pero no existe

        const res = await request(app)
            .get(`/api/users/${nonExistingId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.USER.NOT_FOUND);
    });
});

describe('User: Deactivate (soft delete)', () => {
    let adminToken: string;
    let userToken: string;
    let user: IUser | null;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        adminToken = await getAuthToken('admin_getId@example.com', 'StrongPass123!');
        userToken = await getAuthToken('user_getId@example.com', 'StrongPass123!', 'user');

        user = await getOne('user_getId@example.com');
    });

    it('should deactivate user as admin', async () => {
        const userActive = await UserModel.findById(user?._id);
        expect(userActive?.isActive).toBe(true);

        const res = await request(app)
            .patch(`/api/users/${user?._id}/deactivate`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.isActive).toBe(false);
    });

    it('should forbid non-admin from deactivating user', async () => {

        const res = await request(app)
            .patch(`/api/users/${user?._id}/deactivate`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    });

    it('should return 404 if user not found', async () => {
        const fakeId = '507f1f77bcf86cd799439011';

        const res = await request(app)
            .patch(`/api/users/${fakeId}/deactivate`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.USER.NOT_FOUND);
    });
});

describe('User: Activate user', () => {
    let adminToken: string;
    let userToken: string;
    let user: IUser | null;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        adminToken = await getAuthToken('admin_getId@example.com', 'StrongPass123!');
        userToken = await getAuthToken('user_getId@example.com', 'StrongPass123!', 'user');

        user = await getOne('user_getId@example.com');
    });

    it('should activate user as admin', async () => {
        await request(app)
            .patch(`/api/users/${user?._id}/deactivate`)
            .set('Authorization', `Bearer ${adminToken}`);

        const userActive = await UserModel.findById(user?._id);
        expect(userActive?.isActive).toBe(false);

        const res = await request(app)
            .patch(`/api/users/${user?._id}/activate`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.isActive).toBe(true);
    });

    it('should forbid non-admin from activating user', async () => {

        const res = await request(app)
            .patch(`/api/users/${user?._id}/deactivate`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    });

    it('should return 404 if user not found', async () => {
        const fakeId = '507f1f77bcf86cd799439011';

        const res = await request(app)
            .patch(`/api/users/${fakeId}/deactivate`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.errors[0].message).toBe(MESSAGES.ERROR.USER.NOT_FOUND);
    });
});