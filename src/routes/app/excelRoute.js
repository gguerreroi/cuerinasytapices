import {Router} from "express";
import {appAuth} from "../../utils/is-auth";
import exportExcel from "../../controllers/app/excel/exportExcelController"

const router = Router()

router.get('/:view', exportExcel)

export default router