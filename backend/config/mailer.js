import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a security alert email
 * @param {string} to - Recipient email
 * @param {object} detail - Detail of the attack (IP, Location, Attempts)
 */
export const sendSecurityAlert = async (to, detail) => {
  if (!to) return;
  
  const mailOptions = {
    from: `"Portfolio Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: '⚠️ ALERTA DE SEGURIDAD: Intentos de Acceso Fallidos',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; border: 2px solid #ef4444; border-radius: 10px;">
        <h2 style="color: #ef4444;">Ataque de Fuerza Bruta Detectado</h2>
        <p>Se han registrado múltiples intentos fallidos de acceso a tu panel de administración.</p>
        <hr/>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Dirección IP:</strong> ${detail.ip}</li>
          <li><strong>Ubicación:</strong> ${detail.city}, ${detail.country}</li>
          <li><strong>Intentos en la última hora:</strong> ${detail.attempts}</li>
          <li><strong>Fecha/Hora:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <hr/>
        <p style="font-size: 0.9rem; color: #666;">Si no has sido tú, te recomendamos cambiar tu contraseña lo antes posible desde el panel de control si aún tienes acceso, o revisar la seguridad de tu base de datos.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Security alert email sent to:', to);
  } catch (error) {
    console.error('Error sending security email:', error);
  }
};

export default transporter;
