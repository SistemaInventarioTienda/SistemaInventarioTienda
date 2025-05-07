import { USEREMAIL, USERPASSEMAIL } from "../config.js";
import nodemailer from "nodemailer";

export const changePasswordEmail = async (data) => {
  data['html'] = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cambio de Contraseña Exitoso</title>
            <style>
                body {
                    font-family: sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    width: 90%;
                    max-width: 600px;
                    text-align: center;
                }
                h1 {
                    color: #28a745; /* Verde éxito */
                    margin-bottom: 20px;
                }
                h5 {
                    color: #333;
                    margin-top: 0;
                    margin-bottom: 15px;
                }
                .message {
                    color: #555;
                    display: block;
                    margin-bottom: 20px;
                }
                .date-container {
                    background-color: #e9ecef; /* Gris claro */
                    padding: 15px;
                    border-radius: 6px;
                    margin-top: 25px;
                }
                .date-title {
                    color: #333;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .date-value {
                    color: #007bff; /* Azul */
                    font-size: 1.2em;
                }
                .greeting {
                    margin-bottom: 15px;
                    font-style: italic;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Cambio de Contraseña Exitoso</h1>
                <p class="greeting">Estimado/a ${data.name},</p>
                <p class="message">El cambio de su contraseña fue exitoso!</p>
                <div class="date-container">
                    <h2 class="date-title">Fecha de Cambio:</h2>
                    <p class="date-value">${data.date}</p>
                </div>
                <br>
                <p style="font-size: 0.8em; color: #999;">Este es un correo electrónico automático. Por favor, no responda a este mensaje.</p>
            </div>
        </body>
        </html>
    `;
  data['subject'] = "Alerta Cambio de contraseña";
  sendEmail(data);
}

const sendEmail = async (data) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USEREMAIL,
      pass: USERPASSEMAIL,
    },
  });

  // Set up email options
  let mailOptions = {
    from: USEREMAIL,
    to: data.to,
    subject: data.subject,
    html: data.html,
    attachments: data.files?.map(file => ({
      filename: file.name,
      path: file.path,
      contentType: file.type
    }))
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log("Error al enviar el correo: ", error)
  }
};
