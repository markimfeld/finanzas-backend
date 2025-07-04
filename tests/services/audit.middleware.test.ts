jest.mock('../../src/utils/email.util', () => ({
    sendEmailVerification: jest.fn(),
    sendResetPasswordEmail: jest.fn()
}));
import request from 'supertest';
import app from '../../src/app';
import { UserModel } from '../../src/models/user.model';
import { AuditLogModel } from '../../src/models/auditLog.model';
import { getAuthToken } from '../helpers/test.helpers';
import { setupMemoryMongoDB, teardownMemoryMongoDB } from '../setup';

jest.setTimeout(15000);

beforeAll(async () => {
    await setupMemoryMongoDB();
});

afterAll(async () => {
    await UserModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await teardownMemoryMongoDB();
});

describe('Audit Middleware', () => {
    let access_token: string;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await AuditLogModel.deleteMany({});
        // await createTestUser({ email: 'test@example.com' });
        access_token = await getAuthToken('audit_user@example.com', 'StrongPass123!');
    });

    it('Should log an audit entry for a protected route', async () => {
        const res = await request(app)
            .get('/api/users') // esta ruta debe tener auditMiddleware
            .set('Authorization', `Bearer ${access_token}`);

        expect(res.status).toBe(200);

        const audits = await AuditLogModel.find({});
        expect(audits.length).toBeGreaterThanOrEqual(2);
    });

    it('Should not log audit if no token provided', async () => {
        const res = await request(app)
            .get('/api/users'); // misma ruta protegida

        expect(res.status).toBe(401); // sin token → acceso denegado

        const audits = await AuditLogModel.find({});
        expect(audits.length).toBe(1);
    });
});
