"use server";

import { Resend } from 'resend';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY. Please add it to your .env file.');
  }
  return new Resend(apiKey);
};

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const description = formData.get('description') as string;

  if (!name || !email) {
    return { error: 'Name and Email are required.' };
  }

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: 'Portfolio <contact@mohammodmahadyh.com>',
      to: ['mohammodmahadyh@gmail.com'],
      subject: `New Quote Request from ${name}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}

Description:
${description || 'No description provided.'}
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { error: 'Failed to send email.' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Server Action Error:', err);
    return { error: err.message || 'An unexpected error occurred.' };
  }
}
