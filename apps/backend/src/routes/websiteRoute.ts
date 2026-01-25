import { Router , type Router as RouterType} from "express";
import { verify } from '../middleware/verify';
import { createWebsite, getWebsite } from "../controllers/websiteController";

const router : RouterType = Router();


router.get("/website/status/:websiteId",verify,getWebsite);

router.post("/website",verify,createWebsite);


export default router;