import {
  ApiRequestError,
  generateOpsAnalysis,
  prepareJsonPost,
} from '../server/gemini.js';

export default async function handler(request, response) {
  if (!prepareJsonPost(request, response)) return;

  try {
    const analysis = await generateOpsAnalysis(request.body);
    response.status(200).json({ analysis });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error('Operations analysis generation failed:', error);
    response.status(503).json({ error: 'Operations analysis is unavailable' });
  }
}
