// utils/token.util.ts
import jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces/auth/jwtPayload.interface";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "2m" });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
