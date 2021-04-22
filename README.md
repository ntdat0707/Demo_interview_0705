## for local : #############################
create .env file, enter the config values for app
# install
- npm i or yarn
- Read Setup_environment.pdf file
# run miggration to sync with current database
npm run typeorm:migration:run

# start app
npm start
or npm run start:dev
# #############################################

##API DOCS:


## for cloud: #################################
create directory:

uploads -> users

docker-compose up --build
