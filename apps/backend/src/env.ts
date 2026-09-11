function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} must be defined in environment variables`);
    }
    return value;
}

export const env = {
    JWT_SECRET_WORD: requireEnv("JWT_SECRET_WORD"),
    DATABASE_URL: requireEnv("DATABASE_URL"),
};
