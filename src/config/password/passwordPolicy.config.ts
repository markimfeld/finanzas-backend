export const passwordPolicyConfig = {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
    requireNumber: process.env.PASSWORD_REQUIRE_NUMBER === 'true',
    requireSpecialChar: process.env.PASSWORD_REQUIRE_SPECIAL === 'true',
};
