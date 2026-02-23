//install docker 

docker compose up --build

//download any rest client postman ,thunderclient

user-service
http://localhost:3000
    -GET  get all user
    -POST add new user

task-service
http://localhost:3001
    -GET  get all task
    -POST all new task and it will publish my task to queue(rabbitmq)  and notification service subscribe it and console it.

notification-service
    console all my added task
