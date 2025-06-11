const knexConfig = require("../../knexfile").development;
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const knex = require("knex")(knexConfig);

class VideoController {
    async createVideo(request, response) {
      const { name, description, ep } = request.body;
      const user_id = request.user.id;
      const curso_id  = request.params; // Desestruturar curso_id corretamente
  
      if (!name || !description || !ep) {
          throw new AppError("Nome, descrição ou episódio não informado");
      }
  
      if (!curso_id) {
          throw new AppError("ID (identificador) do curso não informado");
      }

      const EpExist = await knex("videos")
                           .where({ curso_id: curso_id.id, ep })
                         
  
      if (EpExist.length) throw new AppError("Esse episódio já existe!");
  
      const user = await knex('users')
          .where({ id: user_id })
          .first();
  
      if (!user || !user.isadmin) {
          throw new AppError("Acesso negado");
      }
  
      if (!request.file || !request.file.filename) {
          throw new AppError("Arquivo de vídeo não fornecido.");
      }
  
      const videoFilename = request.file.filename;
  
      const diskStorage = new DiskStorage();
      const filename = await diskStorage.saveFile(videoFilename);

      const course = await knex('cursos')
                          .where({ id: curso_id.id })
                          .first();

      await knex('cursos').update({
        quantity: course.quantity + 1
      }).where({ id: curso_id.id });
  
      await knex('videos').insert({
          curso_id: curso_id.id, // Inserir diretamente o curso_id
          name,
          ep,
          description,
          video: filename,
      });
  
      return response.status(201).json({ message: "Vídeo criado com sucesso!" });
    };//finalizado

    async showVideo(request, response) {
     const { id } = request.params;

     const video = await knex('videos').where({ id }).first();

     if (!video) {
       throw new AppError("Nenhum vídeo adicionado ainda")
     };
                         
     return response.json(video);
    };//finalizado

    async deleteVideo(request, response) {
     const  user_id  = request.user.id;
     const { id } = request.params;

     if (!id) {
      throw new AppError("ID(identificador) do vídeo não informado")
     }

     const user = await knex('users')
                       .where({ id: user_id })
                       .first();
     
     if (!user.isadmin) {
        throw new AppError("Acesso negado")
     }

     const video = await knex("videos")
                         .where({ id })
                         .first();
     if (!video) {
      throw new AppError("Vídeo não encontrado")
     }

     const diskStorage = new DiskStorage(); 

     await diskStorage.deleteFile(video.video);

     const course = await knex('cursos')
     .where({ id: video.curso_id })
     .first();

    await knex('cursos').update({
     quantity: course.quantity - 1
    }).where({ id: video.curso_id});

     await knex("videos")
          .where({ id })
          .delete();

     return response.json({})
    };//finalizado
};

module.exports = VideoController;