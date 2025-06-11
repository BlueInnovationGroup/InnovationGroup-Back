const knexConfig = require("../../knexfile").development;
const AppError = require("../utils/AppError");
const knex = require("knex")(knexConfig);

class CourseController {
    async addCourse(request, response) {
     const { curso_id, status, name, category } = request.body;
     const  user_id  = request.user.id;

     if (!curso_id || !status || !name) throw new AppError("Informações necessárias não informadas");

     const Curso = await knex('cursos')
                        .where({ id: curso_id })
                        
     if (!Curso) throw new AppError("Curso não encontrado")

     const ContageExist = await knex('usercursos').where({ curso_id, user_id, status, name })

     if(ContageExist.length) {
        return response.json();
     }

     await knex('usercursos').insert({
        curso_id,
        user_id,
        status,
        name,
        category
     });

     return response.json();
    };//finalizado

    async updateCourse(request, response) {
     const { id, status } = request.body;
     const  user_id  = request.user.id;

     const Contage = await knex('usercursos')
                          .where({ id, user_id })
                          .first();

     if (!Contage) throw new AppError("Curso não encontrado");

     await knex('usercursos')
          .where({ id, user_id })
          .update({ status });

     return response.json();
    };//finalizado

    async showCourses(request, response) {
     const  user_id  = request.user.id;

     const courseFinalizado = await knex('usercursos')
                                   .where({ user_id, status: 'finalizado' });

     const courseCadastrado = await knex('usercursos')
                                   .where({ user_id, status: 'cadastrado' });

                    
                         
     return response.json({ courseFinalizado: courseFinalizado || [], courseCadastrado: courseCadastrado || [] });
    };

    async addVideo(request, response) {
    const { video_id } = request.body;
    const  user_id  = request.user.id;

    if (!video_id) throw new AppError("Informações necessárias não informadas");

    const Video = await knex('videos').where({ id: video_id }).first();

    if (!Video) throw new AppError("Aula não encontrado");

    const ContageExist = await knex('cursocontagem')
                              .where({ curso_id: Video.curso_id, video_id, user_id})
    
    if (ContageExist.length) {
      return response.json();
    }

    await knex('cursocontagem').insert({
      curso_id: Video.curso_id,
      video_id,
      user_id,
    });

    return response.json();
    };

    async showVideos(request, response) {
      const curso_id  = request.params.id;

     const  user_id  = request.user.id;

     if (!curso_id) throw new AppError("Informações necessárias não informadas");

     const Curso = await knex('cursos')
                        .where({ id: curso_id })
                        .first();

     if (!Curso) throw new AppError("Curso não encontrado");

     const Videos = await knex('cursocontagem')
                         .where({ curso_id, user_id });


     return response.json(Videos || []);
    };

};

module.exports = CourseController;