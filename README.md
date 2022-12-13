# gc-scraper
Vehicle crawler for cashme

## Installation

Use the package manager [npm](https://nodejs.org/en/) to install.


```
1. cd docker
2. cp env-example .env
3. docker-compose up -d
4. cd ../server
5. cp .env.example .env
6. npm install
7. npm run watch
8. npm run dev (another tab)

Server listens  http://localhost:4005
```

### How to run list_am

Send post request in postman to http://localhost:4005/api/start, 

with json body: 
```
{
    "usdRate": "400",
    "source": "list.am"
}

where usdRate is not important for list_am, any value will do.
```

### Run Tests
```
npm run test
```
### Create Migration

- sequelize migration:generate --name

Migrate
- $ sequelize db:migrate
- $ sequelize db:migrate:undo

Seed
- $ sequelize-cli db:seed:all

### Windows 10 docker fix

...

`docker volume create postgres_database`

And then you link it like that :

services:
  postgres:
    restart: always
    volumes: - postgres_database:/var/lib/postgresql/data:Z

volumes:
  postgres_database:
    external: true

...
