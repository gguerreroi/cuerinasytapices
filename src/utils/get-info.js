function getInfo(request){
    const ip = request.header('x-forwarded-for') || request.connection.remoteAddress;
    //console.log('original2', request.originalUrl)

    return {
        UserInfo: request.session.passport.user,
        me: request.originalUrl,
        ip: ip
    }
}

export default getInfo