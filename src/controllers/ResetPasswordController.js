const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const nodemailer = require("nodemailer");
const { hash } = require("bcryptjs");
const crypto = require("crypto");

class ForgotPasswordController {
  async sendCode(request, response) {
    const { email } = request.body;
    // Verificar se o e-mail está associado a um usuário
    const user = await knex("users").where({ email }).first();
    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    // Gerar código de 5 dígitos
    const code = crypto.randomInt(10000, 99999);

    // Definir validade do código (ex.: 15 minutos)
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 15);

    // Salvar o código e validade no banco
    await knex("password_resets").insert({
      user_id: user.id,
      code,
      expires_at: expiresIn,
    });

    // Configurar transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail", // ou outro serviço de e-mail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Enviar o e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Redefinição de Senha",
      html: `
<p>Seu código para redefinir a senha é:</p> 
<strong>${code}</strong>.
<p>Ele expira em 15 minutos.</p>  
    `,
    });
    console.log(process.env.EMAIL_USER);
    return response.status(200).json({ message: "Código enviado com sucesso." });
  };

  async reset(request, response) {
    const { code, email, newPassword } = request.body;

    // Verificar se o e-mail existe
    const user = await knex("users").where({ email }).first();
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Validar o código
    const resetRequest = await knex("password_resets")
      .where({ user_id: user.id, code })
      .first();

    if (!resetRequest) {
      throw new AppError("Código inválido.", 400);
    }

    // Verificar validade do código
    const now = new Date();
    if (new Date(resetRequest.expires_at) < now) {
      throw new AppError("Código expirado.", 400);
    }

    // Atualizar a senha do usuário
    const hashedPassword = await hash(newPassword, 8);
    await knex("users").where({ id: user.id }).update({
      password: hashedPassword,
    });

    // Remover o código após uso
    await knex("password_resets").where({ user_id: user.id }).delete();

    return response.json({});
  };
}

module.exports = ForgotPasswordController;
