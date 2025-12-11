import {Router} from "express";
import {apiAuth} from "../utils/is-auth";
import {auth, logout} from "./api/authRoutes";
import getAllFromTable from "../controllers/system/getAllFromTable";
import getOneFromTable from "../controllers/system/getOneFromTable";
import getSelect2 from "../controllers/system/getSelect2";
import deleteTableById from "../controllers/system/deleteTableById";
import updateTableById from "../controllers/system/updateTableById";

import envios from "../controllers/api/veh/enviosController"
import enviosDetalle from "../controllers/api/veh/enviosDetalleController";

const router = Router();

router.post('/auth', auth)
router.get('/auth/logout', logout)

router.get('/catalogo/view/:view', apiAuth, getAllFromTable)
router.get('/catalogo/view/:view/:column/:id', getOneFromTable)
router.get('/catalogo/select2/:view/:cod/:str', getSelect2)
router.delete('/catalogo/:table/:column/:id', deleteTableById)
router.patch('/catalogo/:table/:column/:id', updateTableById)



router.post('/cyt/envios/registro/:id', envios)
router.put('/cyt/envios/registro/:id', envios)
router.post('/cyt/envios/detalle/:id', enviosDetalle)
router.put('/cyt/envios/detalle/:id', enviosDetalle)


export default router