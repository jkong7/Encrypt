import { MailtrapClient } from 'mailtrap'
import dotenv from 'dotenv'

dotenv.config()

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Jonathan Kong",
};

const recipients = [
  {
    email: "jonathankong677@gmail.com",
  }
];

