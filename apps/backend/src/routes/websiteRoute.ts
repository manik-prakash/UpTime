import { Router, type Router as RouterType } from "express";
import { verify } from '../middleware/verify.js';
import { createWebsite, getWebsite, getWebsites, deleteWebsite, getWebsiteById } from "../controllers/websiteController.js";

const router: RouterType = Router();

// Get all websites for authenticated user
router.get("/websites", verify, getWebsites);

// Get single website with full details
router.get("/website/:websiteId", verify, getWebsiteById);

// Get single website status (legacy)
router.get("/website/status/:websiteId", verify, getWebsite);

// Create new website
router.post("/website", verify, createWebsite);

// Delete website
router.delete("/website/:websiteId", verify, deleteWebsite);

export default router;