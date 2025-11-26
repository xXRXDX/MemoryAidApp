MemoryApp Backend (Runnable)

Features:
- User auth (register/login) with JWT
- Quest generator (daily/main/side) with templates, scaling, rarities
- UserQuest assignment and completion (awards XP, updates realms, streak)
- In-memory MongoDB fallback (mongodb-memory-server) so you can run without installing MongoDB
- ESM modules, nodemon dev script

Quick start:
1. unzip and open folder in terminal
2. npm install
3. npm run dev
4. Server runs on http://localhost:5000 (or PORT in .env)

If you have a real MongoDB, set MONGO_URI in a .env file.