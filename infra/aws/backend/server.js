import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(express.json());

// Initialize AWS DynamoDB Client (picks up IAM role from ECS Fargate)
const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'stadium-assistant-backend' });
});

// Example route saving to DynamoDB
app.post('/api/events', async (req, res) => {
  const { type, zone, density } = req.body;
  
  const event = {
    eventId: Date.now().toString(),
    type: type || "CROWD_DENSITY_UPDATE",
    zone: zone || "General",
    density: density || "0%",
    timestamp: new Date().toISOString()
  };

  try {
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE || "StadiumEvents",
      Item: event
    });
    await docClient.send(command);
    
    // Broadcast via WebSockets
    io.emit('density-update', event);
    
    res.status(201).json({ message: "Event saved and broadcasted", event });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Failed to save event" });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
