import {
  ApiRequestError,
  generateChatReply,
  prepareJsonPost,
} from '../server/gemini.js';

export default async function handler(request, response) {
  if (!prepareJsonPost(request, response)) return;

  try {
    const reply = await generateChatReply(request.body);
    response.status(200).json({ reply });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error('Assistant generation failed:', error);
    response.status(503).json({ error: 'Assistant service is unavailable' });
  }
}
