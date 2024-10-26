# Docker
To run the app in docker-compose you need to execute
```
$ cp .env.example .env

$ node ace generate:key

$ docker compose up -d
```
Once the services are up you can run DB migrations by executing:
```
$ docker exec cocktail_api node ace migration:run
```

You can access the app at `localhost:8080`
