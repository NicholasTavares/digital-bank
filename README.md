# Digital Bank

![Badge development](http://img.shields.io/static/v1?label=STATUS&message=development&color=yellow&style=for-the-badge)
![Badge development](http://img.shields.io/static/v1?label=LICENCE&message=MIT&color=GREEN&style=for-the-badge)

A Digital Bank API. This is a portfolio project that allow users to send and receive fake money to simulate the basic transactions of a bank. Users can make money earn interest on savings and make all basics operations of a user (CRUD).

## :wrench: Technologies

- `TypeScript`: Strongly typed programming language that builds on JavaScript
- `NestJS`: [Framework](https://nestjs.com/) in Node ecosystem for building scalable server-side applications.
- `TypeORM`: [ORM (object-relational mapper)](https://typeorm.io/) library that link the application up to a relational database database.
- `PostgreSQL`: [Relational database](https://typeorm.io/) used for store all data from users, transations and savings.
- `Redis`: [In-memory data store](https://redis.io/) used for store whitelist JWT tokens and jobs for sending emails.
- `docker-compose and Docker`: Technologies that respectively manage multiple containers (PostgreSQL, Redis) and build application to deploy.
- `Scheduler`: Execute a task at a fixed date/time create by a Cron. In this project is used a package provided by NestJS: [@nestjs/schedule](https://docs.nestjs.com/techniques/task-scheduling#task-scheduling)
- `Jobs`: Taks in to be executed in a [Queue](https://docs.nestjs.com/techniques/queues#queues). In this project jobs are used for process emais and interest savings in background. In interest savings context, every midnight a Cron is fired to increment 0.1% of all savings from all users in the database. 
- `Transactions`: Database resource that ensures that all operations within a scope succeed. Otherwise, all operations are cancelled. In this project transation are used to send money and to increment 0.1% of all savings from all users in the database every midnight.
- `AWS S3`: AWS resource to store objects in cloud. Avatar photos from users are stored in AWS S3 bucket.
- `GitHub Actions`: Workflows that are used for Continuous Integration. In this project GitHub Actions is used for scan docker images ([Trivy](https://trivy.dev/)), scan code ([CodeQL](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-javascript/)) and build image of the project to [Docker Hub](https://hub.docker.com/search?q=).
- `Jest`: Library for unit test.
- `Python Locust`: [Library from Python](https://locust.io/) for load testing.
- `Swagger`: Library for endpoints documentation. NestJS provide a native solution for documentation: [@nestjs/swagger
](https://docs.nestjs.com/openapi/introduction).

## :shield: Security Tests
Each commit is analyzed for known security vulnerabilities using [CodeQL](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-javascript/) for code. Each pull request or merge is analyzed by [Trivy](https://trivy.dev/) for docker images. Both analyzes are workflows that are dispatched by pull requests of merges.
