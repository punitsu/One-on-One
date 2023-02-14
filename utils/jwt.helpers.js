import jwt from 'jsonwebtoken';

function jwtTokens({username,first_name, last_name,email}){
    const user = {username, first_name, last_name, email};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'60m'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'60m'});
    return ({accessToken, refreshToken})
}

export {jwtTokens}