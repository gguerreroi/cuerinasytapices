import {Router} from "express";
import {appAuth} from "../../utils/is-auth";
import getInfo from "../../utils/get-info";
const router = Router();

router.get('/', appAuth, function(request, response, next){
    const a= getInfo(request)
    response.render('index', a)
})

export default router