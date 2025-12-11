import outApi from "../../../utils/out-api";
const {DB_USER, DB_PASSWORD, DB_NAME, DB_HOST} = process.env;

async function authController(request, username, password, done){

	try {
		// Validación directa sin base de datos
		if (username === "cuerinas@1" && password === "tapices") {

			// Usuario simulado
			const User = {
				codusuario: 1,
				strusuario: username,
				permission: ["/","/cyt/envios","/cyt/envios/registro", "/cyt/envios/pdf"], // Puedes modificar esto si deseas permisos reales
				username,
				password,
				database: null
			};

			User.username = DB_USER
			User.password = DB_PASSWORD
			User.database = DB_NAME

			return done(null, User);
		}

		// Si no coincide usuario o clave
		return done(null, false, outApi(
			401,
			"Usuario o contraseña incorrectos",
			null
		));

	} catch (e) {
		console.log(e, "error authController");
		return done(null, false, outApi(
			500,
			`${e.message}`,
			e
		));
	}
}

export default authController;