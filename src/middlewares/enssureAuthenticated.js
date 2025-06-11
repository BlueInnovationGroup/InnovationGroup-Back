const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const { verify, sign } = require("jsonwebtoken");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;
  const refreshToken = request.headers['x-refresh-token']; 

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    
    request.user = {
      id: Number(user_id),
    };

    return next();

  } catch (error) {
    
    if (error.name === "TokenExpiredError") {
      console.error("Token JWT expirado:", error);

      
      if (!refreshToken) {
        throw new AppError("Refresh token não informado", 401);
      }

      try {
       
        const { sub: user_id } = verify(refreshToken, authConfig.jwt.refreshSecret);

       
        const newToken = sign({ sub: user_id }, authConfig.jwt.secret, {
          expiresIn: authConfig.jwt.expiresIn,
        });

        
        response.setHeader('x-new-token', newToken);

       
        request.user = {
          id: Number(user_id),
        };

        return next(); 

      } catch (refreshError) {
        console.error("Refresh token expirado ou inválido:", refreshError);
        throw new AppError("Refresh token expirado ou inválido", 401);
      }
    } else {
      
      console.error("Token JWT inválido:", error);
      throw new AppError("JWT token inválido", 401);
    }
  }
}

module.exports = ensureAuthenticated;
