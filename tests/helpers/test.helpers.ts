import { UserModel } from '../../src/models/user.model';
import Hasher from '../../src/utils/hash.util';

const hasher = Hasher.getInstance();

export async function createTestUser(overrides: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    emailVerified: boolean;
}> = {}) {
    const password = overrides.password || 'StrongPass123!';
    const hashedPassword = await hasher.hash(password);

    const user = new UserModel({
        name: overrides.name || 'Test User',
        email: overrides.email || 'test@example.com',
        passwordHash: hashedPassword,
        role: overrides.role || 'admin',
        emailVerified: overrides.emailVerified ?? true,
    }).save();

    return { user, plainPassword: password }
}
