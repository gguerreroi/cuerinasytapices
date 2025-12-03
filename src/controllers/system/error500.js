function error500 ( err, req, res, next) {
    console.log(err.message)
    res.status(500).render('./system/error-500', {
        me: req.path,
        err: err,
        UserInfo: 'Error general'
    })
}

export default error500