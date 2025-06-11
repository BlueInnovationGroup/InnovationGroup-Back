module.exports = {
  jwt: {
    secret: process.env.AUTH_SECRET || "default", 
    expiresIn: "5m",  
    refreshSecret: process.env.REFRESH_SECRET || "default_refresh",  
    refreshExpiresIn: "30d",  
  }
}