Mern Authentication System

Step 1 - install packages into backend
    At backend File -> terminal -> npm init
    remove test script in package.json
    terminal --> npm i express cors dotenv nodemon jsonwebtoken mongoose bcryptjs nodemailer cookie-parser
        -- express -creates the app
        -- cors - connects backend with front end
        -- dotenv - stores involvement variables in backend
        -- nodemon - restarts backend whenever code changes in file
        -- jsonwebtoken - creates the token for authentication
        -- mongoose - connects with the mongo database
        -- bycryptjs - encrypts the password and save in database
        -- nodemailer - send the emails
        -- cookie-parser - sends cookies in the API response
    add "type": "module" after "main" and "server": "nodemon server.js" in package.json to import and export

step 2 - create server.js file, import stuff, app.use and listen to port

Step 3 - create mongodb database, store address and password to .env file MONGODB_URI=""
       - Create config directory under backend, create mongodb.js