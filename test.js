const endpoint = process.env.STADIUM_ASSISTANT_URL || 'http://localhost:5173/api/assistantReply';

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello',
      language: 'English',
      context: {},
    }),
  });

  if (!response.ok) {
    throw new Error(`Assistant request failed with status ${response.status}`);
  }

  const result = await response.json();
  console.log('SUCCESS:', result.reply);
} catch (error) {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
}
