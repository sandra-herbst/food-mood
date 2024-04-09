# FoodMood
FoodMood helps you decide what to eat every day. The app suggests two random dishes one after the other and you only have to decide which of the two you would rather eat.

# Setup

1. Create ```.env``` file
2. Start project. If no database is found, the seeder is automatically executed with the sample data when the project is started.
 ```
 docker compose up
 ```
3. Access frontend at: http://localhost:3000/login
4. Login credentials
 - email: admin@admin.de
 - password: admin

# Important URLs

- backend at [http://localhost:5001/api/](http://localhost:5001/api)
- pgAdmin at [http://localhost:5002/](http://localhost:5002/)
- Swagger API Documentation at [http://localhost:5001/docs](http://localhost:5001/docs)
- frontend at [http://localhost:3000/](http://localhost:3000/)

## Production Setup
```
docker compose -f docker-compose.production.yml up -d
```

## Run seeder
To reseed the database in development or seed in production mode the following command is necessary:
```
docker compose exec backend yarn run seed:run
```
