import { z } from 'zod';
import { MESSAGES } from '../constants/messages';
import { passwordPolicyConfig } from '../config/password/passwordPolicy.config';

export function getStrongPasswordSchema() {
    const {
        minLength,
        requireUppercase,
        requireLowercase,
        requireNumber,
        requireSpecialChar,
    } = passwordPolicyConfig;

    let regexString = '^';

    if (requireLowercase) regexString += '(?=.*[a-z])';
    if (requireUppercase) regexString += '(?=.*[A-Z])';
    if (requireNumber) regexString += '(?=.*\\d)';
    if (requireSpecialChar) regexString += '(?=.*[@$!%*?&_\\-])';

    regexString += `[A-Za-z\\d@$!%*?&_\\-]{${minLength},}$`;

    const regex = new RegExp(regexString);

    return z
        .string()
        .min(minLength, { message: MESSAGES.VALIDATION.USER.PASSWORD_TOO_SHORT(minLength) })
        .refine(
            (val) => {
                // Si no cumple con la longitud mínima, no evaluamos fortaleza
                if (val.length < minLength) return true;
                return regex.test(val);
            },
            { message: MESSAGES.VALIDATION.USER.PASSWORD_WEAK }
        );
}
