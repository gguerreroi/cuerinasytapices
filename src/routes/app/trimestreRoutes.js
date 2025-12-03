import { Router } from "express"
const router = Router()

import {appAuth } from "../../utils/is-auth"
import getInfo from "../../utils/get-info";

router.get("/registro", appAuth, function(request, response){
	const i = getInfo(request)
	response.render("veh/trimestre", i)
})


export default router