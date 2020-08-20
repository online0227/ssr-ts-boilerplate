# ssr-ts-boilerplate

Features:
- 100% Typescript (except json and css files)
- Separated API server
- Following object-oriented programming principle (backend)
- MVC, Singleton pattern implemented (backend)
- Server Side Rendering + Code-splitting + Multi-domain + REST + Hot Reload
- React, Mongo, Node.js, Webpack, Babel used
- JWT Auth, simple user/admin dashboard

How to run:
1. Set settings in src/config.ts
2. Set settings in api/server/config.ts
3. Create .env file in api folder (e.g. api/.env)
4. Copy and paste following text into .env, then set the values:
<pre>
DATABASE=mongodb://localhost:27017/ssr-ts-boilerplate
MONGO_USER=
MONGO_PASSWORD=
JWT_SECRET=
PORT=3001
</pre>
5. Create .env file in src folder (e.g. src/.env)
6. Copy and paste following text into .env, then set the values:
<pre>
PORT=3000
</pre>
7. Run it with "npm run dev" or "npm run prod" in src folder
8. Run it with "npm run dev" or "npm run prod" in api folder
