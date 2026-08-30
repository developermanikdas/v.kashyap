# Agent Guidelines & Database Rules for V-Kashyap Project

## 🛡️ UNIVERSAL DATA PRESERVATION RULE (HIGHEST PRIORITY)
This rule applies to **ALL COLLECTIONS** in MongoDB:
- **Bot Memories / RAG Knowledge** (`BotMemory`)
- **Archive Stories & Essays** (`Story`)
- **Acknowledgements & Thank You Notes** (`Acknowledgement`)
- **Safety Scenarios & Protocols** (`SafetyScenario`)
- **Resources & PDF Guides** (`Resource`)
- **Quotes** (`Quote`)
- **Feature Requests** (`FeatureRequest`)
- **User Chat Logs** (`UserChatLog`)

### Strict Rules:
1. **Always Fetch Latest from MongoDB First**:
   - The admin creates and updates content directly in the Admin Panel. Always inspect or query the live database first before performing updates or creating seed scripts.
2. **Never Delete Existing Data**:
   - `deleteMany({})` or dropping collections is **strictly prohibited**.
   - All script operations must use non-destructive upserts (`findOneAndUpdate` with `upsert: true`) so that any records added by the user are never deleted.
3. **Non-Destructive Matching Keys**:
   - `BotMemory`: `{ topic }`
   - `Story`: `{ id }` or `{ title }`
   - `Acknowledgement`: `{ quote }`
   - `SafetyScenario`: `{ id }` or `{ title }`
   - `Resource`: `{ id }` or `{ title }`
   - `Quote`: `{ content }`
