import { Router } from "express";
const router = Router()
import { appAuth } from "../../utils/is-auth";
import getInfo from "../../utils/get-info";

router.get('/registro', appAuth, function(request, response, next){
    const i = getInfo(request)
    response.render('capacitaciones/capacitacion', i);
    })

export default router