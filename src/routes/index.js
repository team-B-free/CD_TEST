import { Router } from 'express';
const router = Router();
import userRouter from './user/user-router.js';
import bossRaidRouter from './bossraid/bossraid-router.js';

router.use('/user', userRouter);
router.use('/bossRaid', bossRaidRouter);

export default router;