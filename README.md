# Northcoders News API

[NC-News API](https://nc-news-xo72.onrender.com/api)

NC-News is a RestFUL API built in Node.js using TDD and the MVC pattern to implement a number of endpoints, made available on the link above, allowing access to data stored in a PostgreSQL database.

## Requirements

You will need Node.js >= v20 installed with a local PostgreSQL instance >= v14.

## Local setup

To run this project locally:

1. `git clone` the repo using the URL under the "<> Code" button in GitHub.

2. `cd` into the newly created directory and run `npm install` to install all necessary dependencies.

3. Create two .env files in the root directory: `.env.development` and `.env.test`

They each require a `PGDATABASE=` key with a different database name as the value in each file:

#### .env.development

`PGDATABASE=nc_news`

#### .env.test

`PGDATABASE=nc_news_test`

4. Create your local Postgres databases (test and development) by running `npm run setup-dbs`

5. Seed the development database by running `npm run seed`

6. Start the server by running `npm start`

7. In your browser, navigate to http://localhost:9090/api to view all available API endpoints

To run tests, use `npm run test`

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
