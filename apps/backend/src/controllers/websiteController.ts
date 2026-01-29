import { prisma } from "@repo/db/client";
import { Request, Response, NextFunction } from "express";
import { createWebsiteSchema, getWebsiteParamsSchema } from "@repo/common/types";

interface CreateWebsiteBody {
    url: string;
    userID: string;
}

interface GetWebsiteParams {
    websiteId: string;
    [key: string]: string;
}

interface AuthenticatedBody {
    userID: string;
}

export const createWebsite = async (
    req: Request<{}, {}, CreateWebsiteBody>,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const parsedData = createWebsiteSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: parsedData.error.issues
            });
            return;
        }

        const { url } = parsedData.data;
        const { userID } = req.body;

        const website = await prisma.website.create({
            data: {
                url,
                userId: userID
            }
        });

        res.status(201).json({
            id: website.id,
            message: "Website created successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const getWebsite = async (
    req: Request<GetWebsiteParams, {}, AuthenticatedBody>,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const parsedParams = getWebsiteParamsSchema.safeParse(req.params);
        if (!parsedParams.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: parsedParams.error.issues
            });
            return;
        }

        const { websiteId } = parsedParams.data;
        const { userID } = req.body;

        const website = await prisma.website.findFirst({
            where: {
                userId: userID,
                id: websiteId,
            },
            include: {
                ticks: {
                    orderBy: [{
                        createdAt: 'desc',
                    }],
                    take: 1
                }
            }
        });

        if (!website) {
            res.status(404).json({
                message: "Website not found"
            });
            return;
        }

        res.json({
            url: website.url,
            id: website.id,
            user_id: website.userId
        });
    } catch (err) {
        next(err);
    }
};

export const getWebsites = async (
    req: Request<{}, {}, AuthenticatedBody>,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { userID } = req.body;

        const websites = await prisma.website.findMany({
            where: {
                userId: userID,
            },
            include: {
                ticks: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 30,
                    include: {
                        region: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            websites: websites.map(w => ({
                id: w.id,
                url: w.url,
                createdAt: w.createdAt,
                ticks: w.ticks.map(t => ({
                    id: t.id.toString(),
                    status: t.status,
                    responseTimeMs: t.responseTimeMs,
                    createdAt: t.createdAt,
                    region: t.region.name
                }))
            }))
        });
    } catch (err) {
        next(err);
    }
};

export const deleteWebsite = async (
    req: Request<GetWebsiteParams, {}, AuthenticatedBody>,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const parsedParams = getWebsiteParamsSchema.safeParse(req.params);
        if (!parsedParams.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: parsedParams.error.issues
            });
            return;
        }

        const { websiteId } = parsedParams.data;
        const { userID } = req.body;

        const website = await prisma.website.findFirst({
            where: {
                id: websiteId,
                userId: userID
            }
        });

        if (!website) {
            res.status(404).json({ message: "Website not found" });
            return;
        }

        await prisma.websiteTick.deleteMany({
            where: { websiteId }
        });

        await prisma.website.delete({
            where: { id: websiteId }
        });

        res.json({ message: "Website deleted successfully" });
    } catch (err) {
        next(err);
    }
};

export const getWebsiteById = async (
    req: Request<GetWebsiteParams, {}, AuthenticatedBody>,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const parsedParams = getWebsiteParamsSchema.safeParse(req.params);
        if (!parsedParams.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: parsedParams.error.issues
            });
            return;
        }

        const { websiteId } = parsedParams.data;
        const { userID } = req.body;

        const website = await prisma.website.findFirst({
            where: {
                id: websiteId,
                userId: userID
            },
            include: {
                ticks: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 30,
                    include: {
                        region: true
                    }
                }
            }
        });

        if (!website) {
            res.status(404).json({ message: "Website not found" });
            return;
        }

        res.json({
            website: {
                id: website.id,
                url: website.url,
                createdAt: website.createdAt,
                ticks: website.ticks.map(t => ({
                    id: t.id.toString(),
                    status: t.status,
                    responseTimeMs: t.responseTimeMs,
                    createdAt: t.createdAt,
                    region: t.region.name
                }))
            }
        });
    } catch (err) {
        next(err);
    }
};
