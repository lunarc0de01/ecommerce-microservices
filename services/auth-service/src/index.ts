import app from './app.js';
import { connectDB } from './config/database.js';
import redisClient from './config/redis.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Redis already connects on import
    
    app.listen(Number(PORT), () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();