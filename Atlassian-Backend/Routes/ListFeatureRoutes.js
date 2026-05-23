import express from 'express'
import { newList,getAllList,upDateList,deleteList } from '../controller/ListController.js'
const router = express.Router()

router.get("/getList",getAllList);
router.post("/NewList",newList);
router.put("/:id",upDateList)
router.delete("/:id",deleteList);

export default router;
