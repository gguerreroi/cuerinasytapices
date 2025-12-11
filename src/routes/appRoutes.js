import { Router } from "express"
import root from "./app/rootRoutes"
import envios from "./app/enviosRoutes"

import excel from "./app/excelRoute"

const app = Router();

app.use(root)
app.use("/cyt/envios", envios)

app.use("/excel",excel)

export default app