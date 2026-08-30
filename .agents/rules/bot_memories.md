# Bot Memories & RAG Knowledge Update Rules

## CRITICAL RULE FOR ALL BOT MEMORY UPDATES
Whenever asked to update, modify, seed, or add Bot Memories (RAG Knowledge):

1. **ALWAYS FETCH LATEST FROM DATABASE FIRST**:
   - Connect to MongoDB and fetch all active/existing `BotMemory` records.
   - Never assume the local file contains all memories, because the admin (Manik) adds and edits memories directly from the Admin Panel Dashboard.

2. **PRESERVE ALL PREVIOUS & CUSTOM MEMORIES**:
   - NEVER drop the `BotMemory` collection (`deleteMany({})` is strictly forbidden).
   - NEVER overwrite or remove custom memory topics created via the dashboard.
   - Use non-destructive upserts (`findOneAndUpdate({ topic: mem.topic }, { $set: mem }, { upsert: true, returnDocument: 'after' })`).

3. **SYNC WORKFLOW**:
   - When updating or adding new memories, merge them with the existing database memories.
   - If updating `seedBotMemories.js`, ensure all memories currently in MongoDB are preserved.
