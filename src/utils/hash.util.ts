import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export default class Hasher {
    private static instance: Hasher;

    // Constructor privado para evitar instanciación directa
    private constructor() { }

    // Método para obtener la única instancia
    public static getInstance(): Hasher {
        if (!Hasher.instance) {
            Hasher.instance = new Hasher();
        }
        return Hasher.instance;
    }

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}