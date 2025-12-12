import { Router } from "express";
const router = Router()
import { appAuth } from "../../utils/is-auth";
import getInfo from "../../utils/get-info";
import getDatabyId from "../../controllers/system/getDatabyId";
import path from "path";
import puppeteer from "puppeteer";

router.get('/registro', appAuth, function(request, response, next){
    const i = getInfo(request)
    response.render('veh/envios', i);
    })

router.get("/registro/:id", appAuth, function(request, response){
	const i = getInfo(request)
	i.id = request.params.id
	const envios = getDatabyId(request, 'envios.vw_envios', 'codenvio', request.params.id)
	const detalle = getDatabyId(request, 'envios.detalle', 'codenvio', request.params.id)

	Promise.all([envios, detalle])
		.then(function(values){
			i.encabezado = values[0].recordset[0] || {};
			i.detalle = values[1].recordset || {};

			// Procesar las fechas en el encabezado
			if (i.encabezado.datfecha)
				i.encabezado.datfecha = new Date(i.encabezado.datfecha).toISOString().split('T')[0]  // Formato: DD/MM/YYYY

			response.render("veh/enviosbyid", i)
		}).catch(function(err){
		console.log(err);
		response.render("system/error-500", err)
	})

})

router.get("/reporte/:id", appAuth, function(request, response){
	const i = getInfo(request)
	i.id = request.params.id
	const ventas = getDatabyId(request, 'ventas.vw_ventas', 'codventa', request.params.id)
	const poa = getDatabyId(request, 'ventas.vw_rel_core_poa', 'codventa', request.params.id)
	const detalle = getDatabyId(request, 'ventas.vw_detalle', 'codventa', request.params.id)

	Promise.all([ventas, poa, detalle])
		.then(function(values){
			i.encabezado = values[0].recordset[0] || {};
			i.poa = values[1].recordset || {};
			i.detalle = values[2].recordset || {};

			// Procesar las fechas en el encabezado
			if (i.encabezado.datfchventa)
				i.encabezado.datfchventa = new Date(i.encabezado.datfchventa).toISOString().split('T')[0]  // Formato: DD/MM/YYYY

			response.render("veh/ventasReporte", i)
		}).catch(function(err){
		console.log(err);
		response.render("system/error-500", err)
	})

})

router.get("/pdf/:id", appAuth, async function(request, response){
	const i = getInfo(request)
	i.id = request.params.id
	const ventas = getDatabyId(request, 'ventas.vw_ventas', 'codventa', request.params.id)
	const detalle = getDatabyId(request, 'ventas.vw_detalle', 'codventa', request.params.id)

	Promise.all([ventas, poa, detalle])
		.then(async function(values){
			i.encabezado = values[0].recordset[0] || {};
			i.poa = values[1].recordset || {};
			i.detalle = values[2].recordset || {};
			const {encabezado, poa, detalle} = i
			const path_file_pdf = path.join(__dirname, "../../../public/pdf/", `ventas-${i.id}.pdf`)
			if (encabezado.datfchventa)
				encabezado.datfchventa = new Date(encabezado.datfchventa).toISOString().split('T')[0]

			const browser = await puppeteer.launch({
				args: ['--no-sandbox', '--disable-setuid-sandbox']
			});
			const page = await browser.newPage();

			let str = "";
			str += `<html>`
			str += `<head><title>Reporte de Ventas</title></head>`
			str += `<body>`

			str += `<style>
			.bg-darkgray {
		background-color: silver;
	}
			
	.bolder {
		font-weight: bolder;
	}		
	.fw-light {
		font-weight: lighter;
	}
	.thead {
	border: 1px solid darkgray; 
	padding: 8px
	}
	.tbody {
	border: 1px solid darkgray; 
	padding: 8px
	}
	.footer-msg {
    position: fixed;
    bottom: 60px; /* ajustá según el pie de página */
    left: 0;
    right: 0;
    text-align: center;
    font-size: 10px;
    color: #555;
  }
	</style>`
			str += `
<table width="100%">
<tr>
	<td><span class="bolder">Socio que reporta:&nbsp</span><span class="fw-light">${encabezado.strsocio}</span></td>
	<td><span class="bolder">Fecha:&nbsp</span><span class="fw-light">${encabezado.datfchventa}</span></td>
	<td><span class="bolder">Año Fiscal:&nbsp</span><span class="fw-light">${encabezado.strtrimestre_usaid.split('-')[1]}</span></td>
</tr>
<tr>
	<td><span class="bolder">No. Actividad del POA:&nbsp</span><span class="fw-light">${poa[0].strcodigoactividad}</span></td>	
	<td><span class="bolder">Estrategia:&nbsp</span><span class="fw-light">${poa[0].strestrategia}</span></td>	
	<td><span class="bolder">Trimestre:&nbsp</span><span class="fw-light">${encabezado.strtrimestre_usaid.split('-')[0]}</span></td>	
</tr>
<tr>
	<td><span class="bolder">Tipo de cambio:&nbsp</span><span class="fw-light">${formatNumber(encabezado.flttipocambio)}</span></td>
	<td><span class="bolder">Total ML:&nbsp</span><span class="fw-light">${formatNumber(encabezado.totventas_ml)}</span></td>
	<td><span class="bolder">Total USD:&nbsp</span><span class="fw-light">${formatNumber(encabezado.totventas_usd)}</span></td>
</tr>
</table><br>
`
			str += `
<table style="border-collapse: collapse; border: 1px solid darkgray">
<thead style="background-color: darkgray; font-weight: bold; text-align: center">
<tr>
	<th class="thead">Organización</th>
	<th class="thead">Categoría</th>
	<th class="thead">Cadena de Valor</th>
	<th class="thead">Producto</th>
	<th class="thead">Certificación</th>
	<th class="thead">Volumen</th>
	<th class="thead">Precio</th>
	<th class="thead">Unidad</th>
	<th class="thead">Total en Q</th>
	<th class="thead">Total en $</th>
</tr>
</thead>`
			str += `<tbody>`
			detalle.forEach(function(item){
				str += `<tr>`
				str += `<td class="tbody">${item.strorganizacion}</td>`
				str += `<td class="tbody">${item.strcategoria}</td>`
				str += `<td class="tbody">${item.strcadenavalor}</td>`
				str += `<td class="tbody">${item.strproducto}</td>`
				str += `<td class="tbody">${item.strtipocertificacion}</td>`
				str += `<td class="tbody">${item.fltvolumencantidad}</td>`
				str += `<td class="tbody">${item.fltpreciounitario}</td>`
				str += `<td class="tbody">${item.strunidadmedida}</td>`
				str += `<td class="tbody">${formatNumber(item.totalmoneda)}</td>`
				str += `<td class="tbody">${formatNumber(item.total_usd)}</td>`
				str += `</tr>`
			})
			str += `</tbody></table><br><br><br><br><br><br>`
			str += `<table width="100%">`
			str += `<tr>`
			str += `<td ><center><span style="width:100%; font-size: 18px; font-weight: bold; text-align: center; border-top: 2px solid black; padding-top: 5px;">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Nombre, Puesto &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span></center></td>`
			str += `<td ><center><span style="width:100%; font-size: 18px; font-weight: bold; text-align: center; border-top: 2px solid black; padding-top: 5px;">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Nombre, Puesto &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span></center></td>`
			str += `</tr>`
			str += `<tr>`
			str += `<td>Firma y sello de autoridad de PYME que garantiza la veracidad de la información.</td>`
			str += `<td>Firma y sello de personal de proyecto que garantiza la veracidad de la información.</td>`
			str += `</tr>`
			str += `</table>`
			str += `</body>`
			str += `</html>`

			await page.emulateMediaType("print");
			await page.setContent(`${str}`);
			await page.setCacheEnabled(false);

			const pdf = await page.pdf({
				path: `${path_file_pdf}`,
				format: "legal",
				landscape: true,
				displayHeaderFooter: true,
				printBackground: true,
				headerTemplate: pdfHeader(i.encabezado),
				footerTemplate: `
            <footer style="font-size:11px; margin-left: 30px; margin-top: 10px; width: 100%">
            <div class="text-muted footer-msg" style="text-align: left">
            <strong>Importante:</strong> 
            Toda documentación de respaldo como facturas de compra/venta, documentación contable, envíos, etc. se encuentra respaldada en la organización que provee y detalla el informe de ventas. 
            </div>            
            <div style="text-align: center; font-size: 10px; color: darkgray; margin-top: 5px; width: 100%"> 
                Página <span class="pageNumber"></span> de <span class="totalPages"></span>
			</div>
            </footer>`,
				margin: {
					top: "100px",
					bottom: "50px",
					left: "20px",
					right: "20px",
				},
			});

			await browser.close();

			response.sendFile(`${path_file_pdf}`, function(err){
				if (err){
					console.error('Error al enviar el archivo:', err);
					response.status(500).send('Error al cargar el archivo.');
				}
			})
		}).catch(function(err){
		console.log(err);
		response.render("system/error-500", err)
	})
})

function pdfHeader(encabezado) {
	return `
<table width="100%">
<tr>
	<td>
	<img src="${logo}" alt="Rainforest Alliance Logo" style="height: 60px; margin-right: 15px; margin-left: 15px;"/>
	</td>
	<td>
	<h2 style="margin: 0; font-size: 18px; text-align: center;">
	Registro Trimestral de Ventas por Pyme
	<br>
	<span style="font-weight: normal; color: darkgray; text-align: center">${encabezado.strproyectos}</span>
	</h2>
	</td>
	<td>
		<span style="font-size: 18px; color: red; font-weight: bold; text-align: right">ID Plataforma: <span style="border-bottom: 1px solid red; padding-bottom: 5px;">&nbsp&nbsp${encabezado.codventa}&nbsp&nbsp</span></span>
	</td>
</tr>
</table>
`
}

function formatNumber(number, decimals=2){
	if (isNaN(number))
		return number
	return number.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
}


export default router