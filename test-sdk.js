const endpoint = process.env.STADIUM_OPS_URL || 'http://localhost:3000/api/analyze';

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phase: 'First Half',
      isEmergency: false,
      emergencyType: '',
      crowdZones: [{ zone: 'North Gate', people: 10 }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Operations analysis request failed with status ${response.status}`);
  }

  const result = await response.json();
  console.log('SUCCESS:', result.analysis);
} catch (error) {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
}
