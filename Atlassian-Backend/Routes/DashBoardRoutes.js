import express from 'express'
import DashboardController from '../controller/DashboardController';

const router =express.Router();

router.get('/dashboard',DashboardController)


export default router;