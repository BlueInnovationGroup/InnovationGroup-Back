const nodemailer = require('nodemailer');
require("express-async-errors");
require('dotenv').config();

const uploadConfigs = require("./configs/upload");
const AppError = require("./utils/AppError");
const cors = require("cors");

const express = require('express');
const routes = require("./routes");
const app = express();
app.use(cors());

app.use("/files", express.static(uploadConfigs.UPLOADS_FOLDER));
app.use(express.json());
app.use(routes);

app.post('/send1', async (req, res) => {
    const { text } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: 'comercial@blueinnovation.com.br',
        subject: '🔔 Novo Agendamento Realizado no MyBlue!',
        html: text,
        headers: {
          'X-Priority': '1 (Highest)',
          'X-MSMail-Priority': 'High',
          Importance: 'High'
        }
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.send(info);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.post('/send2', async (req, res) => {
   const { text } = req.body;

   const transporter = nodemailer.createTransport({
       service: 'gmail', 
       auth: {
           user: process.env.EMAIL_USER, 
           pass: process.env.EMAIL_PASS  
       }
   });

   const mailOptions = {
       from: process.env.EMAIL_USER, 
       to: 'comercial@blueinnovation.com.br',
       subject: '🔔 Solicitação de Contato na BlueInnovation!',
       html: text,
       headers: {
         'X-Priority': '1 (Highest)',
         'X-MSMail-Priority': 'High',
         Importance: 'High'
       }
   };

   try {
       const info = await transporter.sendMail(mailOptions);
       res.send(info);
   } catch (error) {
       res.status(500).send(error.toString());
   }
});

app.use(( error, request, response, next)=>{
 if(error instanceof AppError){
 return response.status(error.statusCode).json({
    status: "error",
    message: error.message
 })
 }

 console.error(error)

 return response.status(500).json({
 status: "error",
 message: "internal server error"
 })
});

app.get('/health' , (req, res) => {
    res.status(200).send('OK!');
});

const PORT = process.env.PORT || 2245;
app.listen(PORT, () => console.log(`serve is running on port ${PORT}`));