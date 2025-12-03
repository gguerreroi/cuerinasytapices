function error404(Request, Response, Next) {
    const [a, b] = Request.path.split("/");
    if (b == 'api'){
        Response.status(404).json({code: '404', message: "Not Found"});
    }else {
        Response.status(404).render('./system/error-404');
    }
}

export default error404