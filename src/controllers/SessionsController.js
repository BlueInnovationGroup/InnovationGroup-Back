const authConfig = require("../configs/auth");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

const { verify, sign } = require("jsonwebtoken");
const { compare } = require("bcryptjs");

class SessionsController {
    async create(request, response){
     const { nick, email, password } = request.body;

     let user

     if (!email) {
       user = await knex('users').where({ nick }).first();
     } else {
       user = await knex('users').where({ email }).first();
     } 

    //  const user = await knex("users")
    //                    .where({email})
    //                    .first();

     if(!user){
        throw new AppError("E-mail e/ou senha incorreta", 401)
     }

     const passwordMatched = await compare(password, user.password)

     if(!passwordMatched){
        throw new AppError("E-mail e/ou senha incorreta", 401)
     }

     const { secret, expiresIn } = authConfig.jwt;

     const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
     })

     const refreshToken = sign({}, authConfig.jwt.refreshSecret, {
      subject: String(user.id),
      expiresIn: authConfig.jwt.refreshExpiresIn
     });

     return response.json({user, token, refreshToken})
    };

    async refreshToken(request, response){
      const { refreshToken } = request.body;

      if (!refreshToken) {
          throw new AppError("Refresh token não informado.", 400);
      }
  
      try {
       
          const { sub: userId } = verify(refreshToken, authConfig.jwt.refreshSecret);
  
          const user = await knex("users")
                            .where({ id: userId })
                            .first();

          if (!user) {
              throw new AppError("Usuário não encontrado.", 404);
          }
  
          
          const newAccessToken = sign({}, authConfig.jwt.secret, {
              subject: String(user.id),
              expiresIn: authConfig.jwt.expiresIn
          });
  
          
          const newRefreshToken = sign({}, authConfig.jwt.refreshSecret, {
              subject: String(user.id),
              expiresIn: authConfig.jwt.refreshExpiresIn
          });
  
          return response.json({
              token: newAccessToken,
              refreshToken: newRefreshToken 
          });
  
      } catch (error) {
          return response.status(401).json({ message: "Token inválido ou expirado." });
      }
    };
}

module.exports = SessionsController