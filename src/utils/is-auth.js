import getInfo from "./get-info";

function appAuth(request, response, next, me = "") {
    if (request.isAuthenticated()) {
        let uri = "";
        const {permission} = request.session.passport.user;

        const path = request.originalUrl.split('/')
        let i=0;
        path.map(function(value, index, array){
            i++;
            if (i<=4)
                uri += `/${value}`
        })

        uri = uri.replaceAll('//','/')

        if (permission.includes(`${uri}`)){
            next()
        }else {
            const a = getInfo(request)
            response.status(403).render('system/error-403',a)
        }
    }else {
        response.render('auth')
    }
}

function loginAuth(request, response, next) {
    if (request.isAuthenticated())
        return response.redirect('/')

    return next()
}

function apiAuth(request, response, next) {
    if (request.isAuthenticated()){
        next()
    }else {

        if (request.headers.authorization){
                next()
        } else {
            response.status(401).json({
                state: {
                    Code: 401,
                    Message: 'Unauthorized'
                }
            })
        }
    }
}

export {appAuth, loginAuth, apiAuth}