import 'dotenv/config';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import prisma from "@repo/db/client";
import { authSchema } from "@repo/common/types";

const secret = process.env.JWT_SECRET_WORD;
if (!secret) {
    throw new Error("JWT_SECRET not found");
}

interface AuthBody {
    username: string;
    password: string;
}

export const signin = async (
    req: Request<{}, {}, AuthBody>,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log(parsedData.error);
            res.json({
                message: "Incorrect inputs"
            })
            return;
        }

        const { username , password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { userID: user.id, username: user.username },
            secret,
            { expiresIn: "4h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (err) {
        next(err);
    }
};

export const signup = async (
    req: Request<{}, {}, AuthBody>,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log(parsedData.error);
            res.json({
                message: "Incorrect inputs"
            })
            return;
        }

        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(409).json({ message: "use different username." });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hash,
            },
        });

        const token = jwt.sign(
            { userID: newUser.id, username: newUser.username },
            secret,
            { expiresIn: "4h" }
        );

        return res.status(201).json({
            message: "User created successfully",
            token,
        });
    } catch (err) {
        next(err);
    }
};