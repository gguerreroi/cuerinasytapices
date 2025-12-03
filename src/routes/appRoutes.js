import { Router } from "express"
import root from "./app/rootRoutes"
import capacitaciones from "./app/capacitacionesRoutes"
import ventas from "./app/ventasRoutes"
import hectareas from "./app/hectareasRoutes"
import empleos from "./app/empleosRoutes"
import trimestre from "./app/trimestreRoutes"
import retornados from "./app/retornadosRoutes";
import riesgo from "./app/riesgoRoutes";
import catalogo from "./app/catalogoRoutes"
import excel from "./app/excelRoute"

const app = Router();

app.use(root)
app.use("/mye/capacitaciones", capacitaciones)
app.use("/mye/ventas", ventas)
app.use("/mye/hectareas", hectareas)
app.use("/mye/empleos", empleos)
app.use("/mye/trimestre", trimestre)
app.use("/mye/deportados", retornados)
app.use("/mye/riesgo", riesgo)
app.use("/catalogo", catalogo)
app.use("/excel",excel)

export default app