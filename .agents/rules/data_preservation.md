# Universal Data Preservation & Database Update Rules

## CRITICAL RULE FOR ALL DATA UPDATES ACROSS ALL COLLECTIONS
Whenever asked to update, modify, seed, or add records to ANY data collection in this archive (including **Bot Memories / RAG**, **Stories / Essays**, **Acknowledgements**, **Safety Scenarios & Protocols**, **Resources / PDFs**, **Quotes**, and **Feature Requests**):

1. **ALWAYS FETCH LATEST FROM DATABASE FIRST**:
   - Query the live MongoDB database to fetch existing records before making changes.
   - Never assume local JSON/JS files have all records, because the Master Admin (Manik) adds and edits records live via the Admin Panel Dashboard.

2. **STRICT ZERO-DATA-LOSS / NON-DESTRUCTIVE POLICY**:
   - `deleteMany({})`, collection drops, or blind overwrites are **STRICTLY FORBIDDEN**.
   - Always preserve all custom entries created from the Admin Dashboard.
   - When adding or updating items, always use non-destructive upserts:
     - **Bot Memories (`BotMemory`)**: Match by `topic`
     - **Stories (`Story`)**: Match by `id` or `title`
     - **Acknowledgements (`Acknowledgement`)**: Match by `quote`
     - **Safety Scenarios (`SafetyScenario`)**: Match by `id` or `title`
     - **Resources (`Resource`)**: Match by `id` or `title`
     - **Quotes (`Quote`)**: Match by `content`
     - **Chat Logs (`UserChatLog`)**: Append-only

3. **SYNC WORKFLOW**:
   - Always merge new data with existing database entries.
   - Keep all database records intact when updating scripts or seeding data.
