"use strict";

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function enviosDetalle(request, response) {
    const { Username, Database, Password } = get_credentials(request);
    const { id } = request.params;
    const {
        codsecuencia, // Identificador para actualizar/inserción
        codorganizacion,
        codproducto,
        codtipocertificacion,
        fltvolumencantidad,
        codunidadmedida,
        fltpreciounitario,
        codmonedaventa,
        codpaisdestino
    } = request.body;

    let Connection = null;

    try {
        // Establecer la conexión a la base de datos
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

        const stmt = await Connection.request();

        // Establecer parámetros de entrada
        stmt.input("codsecuencia", mssql.Int, codsecuencia || 0); // Si no hay ID, asumir inserción
        stmt.input("codventa", mssql.Int, id);
        stmt.input("codorganizacion", mssql.Int, codorganizacion);
        stmt.input("codtipocertificacion", mssql.Int, codtipocertificacion);
        stmt.input("codproducto", mssql.Int, codproducto);
        stmt.input("fltvolumencantidad", mssql.Decimal(13, 5), fltvolumencantidad);
        stmt.input("fltpreciounitario", mssql.Decimal(13, 5), fltpreciounitario);
        stmt.input("codunidadmedida", mssql.Int, codunidadmedida);
        stmt.input("codmonedaventa", mssql.Int, codmonedaventa);
        stmt.input("codpaisdestino", mssql.Int, codpaisdestino);

        // Establecer parámetros de salida
        stmt.output("spCodeMessage", mssql.Bit);
        stmt.output("spStrMessage", mssql.VarChar(400));

        // Ejecutar el procedimiento almacenado
        await stmt.execute("ventas.sp_detalle", function (err, result) {
            if (err) {
                response.status(500).send(outApi("500", err.message, err));
            } else {
                let codstatus = 200;
                if (result.output.spCodeMessage === false) codstatus = 500;
                response
                    .status(codstatus)
                    .send(
                        outApi(
                            result.output.spCodeMessage,
                            `${result.output.spStrMessage}`,
                            result.recordset
                        )
                    );
            }
        });
    } catch (err) {
        response
            .status(500)
            .send(outApi("500", "Error [sp_detalle]" + err.message, err));
    }
}

export default enviosDetalle;