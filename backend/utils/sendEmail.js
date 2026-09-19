import {config} from "../config/env.js";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: config.nodemailer_host,
    port: config.nodemailer_port,
    auth: {
      user: config.nodemailer_user,
      pass: config.nodemailer_password,
    },
  });

  const message = {
    from: `${config.nodemailer_from_name} <${config.nodemailer_from_email}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(message);
};

export { sendEmail };
