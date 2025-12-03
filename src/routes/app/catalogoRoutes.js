import {Router} from "express";
import {appAuth} from "../../utils/is-auth";
import getInfo from "../../utils/get-info";

const router = Router()

router.get('/general/tipoeventos', appAuth, function (request, response, next) {
    const i = getInfo(request)
    return response.render('catalogos/general/tiposeventos', i);
})

router.get('/general/tipoeventos/:id', appAuth, function (request, response, next) {
    const i = getInfo(request)
    i.data = {id: request.params.id}
    return response.render('catalogos/general/tipoeventosbyid', i);
})

router.get('/general/tema', appAuth, function (request, response, next) {
    const i = getInfo(request)
    return response.render('catalogos/general/temas', i);
})

router.get('/general/tema/:id', appAuth, function (request, response, next) {
    const i = getInfo(request)
    i.data = {id: request.params.id}
    return response.render('catalogos/general/temasbyid', i);
})

router.get('/general/cadenavalor', appAuth, function (request, response, next) {
    const i = getInfo(request)
    return response.render('catalogos/general/cadenavalor', i);
})

router.get('/general/cadenavalor/:id', appAuth, function (request, response) {
    const i = getInfo(request)
    i.data = {id: request.params.id}
    return response.render('catalogos/general/cadenavalorbyid', i);
})

router.get('/general/categoriacdv/:id', appAuth, function (request, response, next) {
    const i = getInfo(request)
    i.data = {id: request.params.id}
    i.me = '/catalogo/general/cadenavalor'
    return response.render('catalogos/general/categoriacdvbyid', i);
})

router.get('/general/producto/:id', appAuth, function (request, response, next) {
    const i = getInfo(request)
    i.data = {id: request.params.id}
    i.me = '/catalogo/general/cadenavalor'
    return response.render('catalogos/general/productobyid', i);
})

router.get('/poa/poa', appAuth, function (request, response, next) {
    const i = getInfo(request)
    return response.render('catalogos/poa/poa', i);
})

router.get('/poa/socio', appAuth, function(request, response){
    const i = getInfo(request)
    return response.render('catalogos/poa/socio', i)
})

router.get('/general/comunidadlinguistica', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/comunidadlinguistica.ejs', i)
})

router.get('/organizaciones/tipoorganizacion', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/tipoorganizacion.ejs', i)
})

router.get('/general/unidadmedida', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/unidadmedida.ejs', i)
})


router.get('/general/usosuelo', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/usosuelo.ejs', i)
})

router.get('/general/certificacion', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/certificacion.ejs', i)
})

router.get('/poa/estrategias', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/estrategias.ejs', i)
})

router.get('/general/donante', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/donante.ejs', i)
})

router.get('/general/proyecto', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/general/proyecto.ejs', i)
})

router.get('/geografica/geografica', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/geografica/geografica.ejs', i)
})

router.get('/usuarios/usuarios', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/usuarios/usuarios.ejs', i)
})
router.get('/usuarios/roles', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/usuarios/roles.ejs', i)
})
router.get('/usuarios/permisos', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/usuarios/permisos.ejs', i)
})

router.get('/deportados/niveleducativo', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/niveleducativo.ejs', i)
})

router.get('/deportados/rubroscapacitacion', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/rubroscapacitacion.ejs', i)
})
router.get('/deportados/vulnerabilidades', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/vulnerabilidades.ejs', i)
})

router.get('/deportados/intereses', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/intereses.ejs', i)
})

router.get('/deportados/evaluacionperfil', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/evaluacionperfil.ejs', i)
})

router.get('/deportados/tipoapoyo', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/tipoapoyo.ejs', i)
})

router.get('/deportados/oficiogt', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/oficiogt.ejs', i)
})

router.get('/deportados/necesidademprender', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/necesidademprender.ejs', i)
})

router.get('/deportados/rubroemprendimiento', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/rubroemprendimiento.ejs', i)
})

router.get('/deportados/actividadeconomicaextranjero', appAuth,  function(request, response, next){
    const i = getInfo(request)
    return response.render('catalogos/deportados/actividadeconomicaextranj.ejs', i)
})

export default router