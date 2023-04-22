# Datawrapper Kanban 
Simple Kanban board fullstack app with Svelte and Node.js

## Setting up

install all dependencies for both frontend and backend.
```
npm run install-all
```

Seed the SQLite database with Prisma
```
npm run seed-db
```

## Development

Run both development instances in parallel
```
npm run dev
```

## Building

Build backend with `tsc`, frontend with `vite`
```
npm run build
```

Run built instances
```
npm run start:client  // run vite frontend
npm run start:server  // run node.js backend
npm run start         // run both
```