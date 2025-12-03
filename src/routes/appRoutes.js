import { Router } from "express"
import root from "./app/rootRoutes"
import capacitaciones from "./app/capacitacionesRoutes"

import excel from "./app/excelRoute"

const app = Router();

app.use(root)
app.use("/cyt/envios", capacitaciones)

app.use("/excel",excel)

export default app