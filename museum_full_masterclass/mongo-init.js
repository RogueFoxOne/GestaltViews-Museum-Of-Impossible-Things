// mongo-init.js
// Initialize Museum database with collections and indexes

db = db.getSiblingDB('museumofimpossiblethings');

// Create exhibits collection
db.createCollection('exhibits');

// Create indexes for efficient querying
db.exhibits.createIndex({ "slug": 1 }, { unique: true });
db.exhibits.createIndex({ "category": 1 });
db.exhibits.createIndex({ "year": 1 });
db.exhibits.createIndex({ "title": "text", "description": "text" });

// Create conversations collection for curator
db.createCollection('conversations');
db.conversations.createIndex({ "session_id": 1 });
db.conversations.createIndex({ "created_at": 1 });

print('🎨 Museum database initialized successfully!');
