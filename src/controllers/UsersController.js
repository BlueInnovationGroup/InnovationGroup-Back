const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { firstname, lastname, nick, email, password } = request.body;

    const checkUserExists1 = await knex('users').where({ nick }).first();
    const checkUserExists2 = await knex('users').where({ email }).first();

    if (checkUserExists1) {
      throw new AppError("Este nome de usuário já está em uso");
    };

    if (checkUserExists2) {
      throw new AppError("Este email já está em uso");
    };


    const hashedPassword = await hash(password, 8);

    await knex('users').insert({
      firstname,
      lastname,
      nick,
      email,
      password: hashedPassword
    });

    return response.status(201).json();
  };//finalizada

  async update(request, response) {
    const { 
      firstname,
      lastname,
      nick, 
      email, 
      phone, 
      country, 
      states, 
      city, 
      postal, 
      address1, 
      address2,
      enterprise,
      iva
    } = request.body;
    const id = request.user.id

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError("Usuário não existe.");
    }

    const userWithUpdateNick = await knex('users').where({ nick }).first();
    const userWithUpdateEmail = await knex('users').where({ email }).first();

    if (userWithUpdateEmail && userWithUpdateEmail.id != user.id) {
      throw new AppError("Este email já está em uso.");
    }

    if (userWithUpdateNick && userWithUpdateNick.id != user.id) {
      throw new AppError("Este nome de usuário já está em uso.");
    }


    const updatedUser = {
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
      nick: nick || user.nick,
      email: email || user.email,
      phone: phone || user.phone, 
      country: country || user.country, 
      states: states || user.states, 
      city: city || user.city, 
      postal: postal || user.postal, 
      address1: address1 || user.address1, 
      address2: address2 || user.address2,
      enterprise: enterprise || user.enterprise,
      iva: iva || user.iva
    };

    await knex('users').where({ id }).update(updatedUser);

    return response.json();
  };//finalizado

  async setPassword(request, response) {
    const { nick, email, password, old_password} = request.body;

    if (!nick && !email) {
      throw new AppError("Email ou nome de usuário não informado");
    }

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga");
    }

    if (!password) {
      return
    }
  
    let user

    if (!email) {
      user = await knex('users').where({ nick }).first();
    } else {
      user = await knex('users').where({ email }).first();
    } 

    if (!user) {
      throw new AppError("Usuário não existe.");
    }



    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password);

      if (!checkPassword) {
        throw new AppError("Senha antiga não condiz");
      }

      user.password = await hash(password, 8);
      const hashedPassword = await hash(password, 8);
      
      await knex('users').where({ id: user.id }).update({ password: hashedPassword});

      return response.json();
    }

  };//finalizado

  async show(request, response) {
    const id = request.user.id

    const user = await knex("users")
                      .where({id})
                      .first();

    const courses = await knex("usercursos").where({ user_id: id });


    if(!user){
      return response.json("usuário não existe")
    }

    return response.json({ user, cursos: courses || [] })
  };
 
  async updateAdmin(request, response) {
    const { adminPassword, email } = request.body;
    const id = request.user.id;

    if (!email) throw new AppError("Email não informado")

    if (!adminPassword) throw new AppError("Senha de ADM não informada");

    if (adminPassword != process.env.ADM) throw new AppError("Senha de ADM incorreta!");

    const user = await knex("users")
                      .where({ id })
                      .first();

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    await knex("users")
         .where({ email })
         .update({ isadmin: 1 });

    return response.json({})
  };//finalizado
}

module.exports = UsersController;
