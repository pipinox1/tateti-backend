# NODEJS Backend and DB

## Setup y Deployment del proyecto


In order to deploy this application, we simply need to have Docker and Docker Compose installed. And run the following command: 
"docker-compose up ." in the root folder of project.

Or you can make a file called docker-compose.yml and copy and paste the following lines and run "docker-compose up ." in the folder where you created the file.

```
version: '3'
services:
  tateti:
    image: pipinox1/tateti-app
    restart: always
    container_name: tateti
    ports:
      - 9080:9080
    depends_on:
      - mongo-db
  mongo-db:
    image: mongo
    restart: always
    container_name: mongo-db
    ports:
      - 27017:27017
    volumes:
      - $HOME/data/tateti:/data/db
```
