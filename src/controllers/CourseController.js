const knexConfig = require("../../knexfile").development;
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const knex = require("knex")(knexConfig);

class CourseController {
    async createCourse(request, response) {
     const { name, description, category } = request.body;
     const  user_id  = request.user.id;

     const user = await knex('users')
                       .where({ id: user_id })
                       .first();
     
     if (!user.isadmin) {
        throw new AppError("Acesso negado")
     }

     await knex('cursos').insert({
        name,
        description,
        category,
     });

     return response.json();
    };//finalizado

    async index(request, response) {
     const { name } = request.query;

     const courses = await knex('cursos')
                          .orderBy("created_at");

     let result = []

     if (name){
      result = await knex("cursos")
                    .where("name", "like", `%${name}%`);
     };

     return response.json({ cursos: courses || [], resultados: result || [] });
    };

    async showCourse(request, response) {
     const { id } = request.params;

     const course = await knex('cursos')
                         .where({ id })
                         .first();

     if (!course) throw new AppError("Nenhum curso criado ainda");

     const videos = await knex("videos")
                         .where({ curso_id: id})
                         .orderBy("ep");
                         
     return response.json({ course, videos: videos || []});
    };//finalizado

    async deleteCourse(request, response) {
     const { id } = request.params;
     const  user_id  = request.user.id;


     if (!id) {
      throw new AppError("ID(identificador) do curso não informado")
     }

     const user = await knex('users')
                       .where({ id: user_id })
                       .first();
     
     if (!user.isadmin) {
        throw new AppError("Acesso negado")
     }

     const course = await knex("cursos")
                         .where({ id })
                         .first();
     if (!course) {
      throw new AppError("Curso não encontrado")
     }

     await knex("cursos")
          .where({ id })
          .first()
          .delete();

     return response.json({})
    };//finalizado
};

module.exports = CourseController;