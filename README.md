# rs-sloths-be
The rs-sloths-be is a back-end for RS Sloths application.

We are using the Microservice pattern together with Backend-For-Frontend, which acts as Facade and aggregates all client requests to microservices. 

We are using Nest.js, PostgreSQL + Prisma, Passport.js, GitHub OAuth2, Winston.

This repo is monorepo for BFF and microservices so you could get monorepo benefits like installing dependencies only once and running altogether. But you also could do that individually for BFF and each microservices.


## Run BFF and microservices using one shared DB:

1) Rename all `.env.example` files to `.env` and specify environment settings and `DATABASE_URL` should be the same for all microservices;

2) Run `npm i` command in your terminal at the root directory;

3) After that run `npx prisma generate` command in your terminal at the root directory to generate prisma schemas;

4) Now you can run BFF and microservices in production and development mode by using one of these commands in your terminal at the root directory:

```sh
npm start # production mode
```

```sh
npm run start:dev # development watch mode
```

## Run BFF and microservices using separated microservice DBs:

1) Rename all `.env.example` files to `.env` inside `apps` subfolders and specify environment settings and now `DATABASE_URL` should be _**different**_ for all microservices;

2) Run `npm i` command in your terminal at the root directory;

3) After that you should run `npx prisma generate` at every microservice folder to generate prisma schemas for that microservice DB;

4) Now you can run BFF and microservices in production and development mode by using one of these commands in your terminal at the root directory:

```sh
npm start # production mode
```

```sh
npm run start:dev # development watch mode
```


