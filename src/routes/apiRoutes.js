import {Router} from "express";
import {apiAuth} from "../utils/is-auth";
import {auth, logout} from "./api/authRoutes";
import getAllFromTable from "../controllers/system/getAllFromTable";
import getOneFromTable from "../controllers/system/getOneFromTable";
import getSelect2 from "../controllers/system/getSelect2";
import deleteTableById from "../controllers/system/deleteTableById";
import tipoEventos from "../controllers/api/catalogos/tiposEventosController";
import temas from "../controllers/api/catalogos/temasController";
import {categoriacdv, cadenavalor, producto} from "../controllers/api/catalogos/cadenaValorController"
import poa from "../controllers/api/catalogos/actividadPoaController"
import socio from "../controllers/api/catalogos/socioController"
import comunidadLinguistica from "../controllers/api/catalogos/comunidadLinguisticaController"
import tipoorganizacion from "../controllers/api/catalogos/tipoorganizacionControllers";
import unidadmedida from "../controllers/api/catalogos/unidadmedidaController";
import usosuelo from "../controllers/api/catalogos/usosueloControllers";
import certificacion from "../controllers/api/catalogos/certificacionController";
import persona from "../controllers/api/eventos/personaControllers"
import organizaciones from "../controllers/api/eventos/organizacionesControllers";
import {estrategias, resultados, indicadores} from "../controllers/api/catalogos/estrategiasController";
import eventos from "../controllers/api/eventos/eventosController"
import updateTableById from "../controllers/system/updateTableById";
import donante from "../controllers/api/catalogos/donanteController";
import proyecto from "../controllers/api/catalogos/proyectoController"
import region from "../controllers/api/catalogos/regionControllers"
import pais from "../controllers/api/catalogos/paisController"
import moneda from "../controllers/api/catalogos/monedaController"
import departamento from "../controllers/api/catalogos/departamentoController"
import municipio from "../controllers/api/catalogos/municipioController"
import tipocambio from "../controllers/api/veh/tipocambioController";
import trimestre from "../controllers/api/veh/trimestreController";
import ventas from "../controllers/api/veh/ventasController"
import ventasDetalle from "../controllers/api/veh/ventasDetalleController";
import empleos from "../controllers/api/veh/empleosController"
import empleosDetalle from "../controllers/api/veh/empleosDetalleController"
import hectareas from "../controllers/api/veh/hectareasController";
import hectareasDetalle from "../controllers/api/veh/hectareasDetalleController";
import usuarios from "../controllers/api/usuarios/usuariosController";
import niveleducativo from "../controllers/api/catalogos/niveleducativoController";
import rubroscapacitacion from "../controllers/api/catalogos/rubroscapacitacionControlller";
import vulnerabilidades from "../controllers/api/catalogos/vulnerabilidadesController";
import intereses from "../controllers/api/catalogos/interesesController";
import evaluacionperfil from "../controllers/api/catalogos/evaluacionperfilController";
import tipoapoyo from "../controllers/api/catalogos/tipoapoyoController";
import oficiogt from "../controllers/api/catalogos/oficiogtController";
import necesidademprender from "../controllers/api/catalogos/necesidademprenderController";
import rubroemprendimiento from "../controllers/api/catalogos/rubroemprendimientoController";
import deportados from "../controllers/api/deportados/deportadosController";
import evaluacionPerfil from "../controllers/api/deportados/evaluacionPerfilController";
import migracionCore from "../controllers/api/riesgo/migracionCoreController";
import evaluacionRiesgo from "../controllers/api/riesgo/evaluacionRiesgoController";

const router = Router();

router.post('/auth', auth)
router.get('/auth/logout', logout)

router.get('/catalogo/view/:view', apiAuth, getAllFromTable)
router.get('/catalogo/view/:view/:column/:id', getOneFromTable)
router.get('/catalogo/select2/:view/:cod/:str', getSelect2)
router.delete('/catalogo/:table/:column/:id', deleteTableById)
router.patch('/catalogo/:table/:column/:id', updateTableById)

router.put('/catalogo/general/tipoeventos/:id', tipoEventos)
router.post('/catalogo/general/tipoeventos/:id', tipoEventos)
router.put('/catalogo/general/tema/:id', temas)
router.post('/catalogo/general/tema/:id', temas)
router.put('/catalogo/general/categoriacdv/:id', categoriacdv)
router.post('/catalogo/general/categoriacdv/:id', categoriacdv)
router.put('/catalogo/general/cadenavalor/:id', cadenavalor)
router.post('/catalogo/general/cadenavalor/:id', cadenavalor)
router.put('/catalogo/general/producto/:id', producto)
router.post('/catalogo/general/producto/:id', producto)
router.put('/catalogo/poa/poa/:id', poa)
router.post('/catalogo/poa/poa/:id', poa)
router.put('/catalogo/poa/socio/:id', socio)
router.post('/catalogo/poa/socio/:id', socio)
router.put('/catalogo/general/comunidadlinguistica/:id', comunidadLinguistica)
router.post('/catalogo/general/comunidadlinguistica/:id', comunidadLinguistica)
router.put('/catalogo/general/tipoorganizacion/:id', tipoorganizacion)
router.post('/catalogo/general/tipoorganizacion/:id', tipoorganizacion)
router.put('/catalogo/general/unidadmedida/:id', unidadmedida)
router.post('/catalogo/general/unidadmedida/:id', unidadmedida)
router.put('/catalogo/general/usosuelo/:id', usosuelo)
router.post('/catalogo/general/usosuelo/:id', usosuelo)
router.put('/catalogo/general/certificacion/:id', certificacion)
router.post('/catalogo/general/certificacion/:id', certificacion)
router.put('/catalogo/general/estrategias/:id', estrategias)
router.post('/catalogo/general/estrategias/:id', estrategias)
router.put('/catalogo/general/resultados/:id', resultados)
router.post('/catalogo/general/resultados/:id', resultados)
router.put('/catalogo/general/indicadores/:id', indicadores)
router.post('/catalogo/general/indicadores/:id', indicadores)
router.post('/catalogo/general/donante/:id', donante)
router.put('/catalogo/general/donante/:id', donante)
router.post('/catalogo/general/proyecto/:id', proyecto)
router.put('/catalogo/general/proyecto/:id', proyecto)
router.post('/catalogo/general/region/:id', region)
router.put('/catalogo/general/region/:id', region)
router.post('/catalogo/general/pais/:id', pais)
router.put('/catalogo/general/pais/:id', pais)
router.post('/catalogo/general/moneda/:id', moneda)
router.put('/catalogo/general/moneda/:id', moneda)
router.post('/catalogo/general/departamento/:id', departamento)
router.put('/catalogo/general/departamento/:id', departamento)
router.post('/catalogo/general/municipio/:id', municipio)
router.put('/catalogo/general/municipio/:id', municipio)
router.post('/catalogo/usuarios/:id', usuarios)
router.put('/catalogo/usuarios/:id', usuarios)
router.post('/catalogo/deportados/niveleducativo/:id', niveleducativo)
router.put('/catalogo/deportados/niveleducativo/:id', niveleducativo)
router.post('/catalogo/deportados/rubroscapacitacion/:id', rubroscapacitacion)
router.put('/catalogo/deportados/rubroscapacitacion/:id', rubroscapacitacion)
router.post('/catalogo/deportados/vulnerabilidades/:id', vulnerabilidades)
router.put('/catalogo/deportados/vulnerabilidades/:id', vulnerabilidades)
router.post('/catalogo/deportados/intereses/:id', intereses)
router.put('/catalogo/deportados/intereses/:id', intereses)
router.post('/catalogo/deportados/evaluacionperfil/:id', evaluacionperfil)
router.put('/catalogo/deportados/evaluacionperfil/:id', evaluacionperfil)
router.post('/catalogo/deportados/tipoapoyo/:id', tipoapoyo)
router.put('/catalogo/deportados/tipoapoyo/:id', tipoapoyo)
router.post('/catalogo/deportados/oficiogt/:id', oficiogt)
router.put('/catalogo/deportados/oficiogt/:id', oficiogt)
router.post('/catalogo/deportados/necesidademprender/:id', necesidademprender)
router.put('/catalogo/deportados/necesidademprender/:id', necesidademprender)
router.post('/catalogo/deportados/rubroemprendimiento/:id', rubroemprendimiento)
router.put('/catalogo/deportados/rubroemprendimiento/:id', rubroemprendimiento)

router.post('/mye/capacitaciones/personas/:id', persona)
router.put('/mye/capacitaciones/personas/:id', persona)
router.post('/mye/capacitaciones/organizaciones/:id', organizaciones)
router.put('/mye/capacitaciones/organizaciones/:id', organizaciones)
router.post('/mye/capacitaciones/eventos', eventos)
router.put('/mye/capacitaciones/eventos', eventos)


router.post('/mye/ventas/registro/:id', ventas)
router.put('/mye/ventas/registro/:id', ventas)
router.post('/mye/ventas/detalle/:id', ventasDetalle)
router.put('/mye/ventas/detalle/:id', ventasDetalle)

router.post('/mye/empleos/registro/:id', empleos)
router.put('/mye/empleos/registro/:id', empleos)
router.post('/mye/empleos/detalle/:id', empleosDetalle)
router.put('/mye/empleos/detalle/:id', empleosDetalle)

router.post('/mye/hectareas/registro/:id', hectareas)
router.put('/mye/hectareas/registro/:id', hectareas)
router.post('/mye/hectareas/detalle/:id', hectareasDetalle)
router.put('/mye/hectareas/detalle/:id', hectareasDetalle)

router.post('/mye/trimestre/tipocambio', tipocambio)
router.put('/mye/trimestre/tipocambio', tipocambio)
router.post('/mye/trimestre/trimestre', trimestre)
router.put('/mye/trimestre/trimestre', trimestre)

router.post('/mye/deportados/:id', deportados)
router.put('/mye/deportados/:id', deportados)
router.patch('/mye/deportados/:id', evaluacionPerfil)

router.post('/mye/riesgo/:id', migracionCore)
router.put('/mye/riesgo/:id', migracionCore)
router.patch('/mye/riesgo/:id', evaluacionRiesgo)

export default router