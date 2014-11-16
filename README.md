Here's the instructions to set up the project:
1. Install node from http://nodejs.org/ if node is not already installed on
   you laptop (you can easily check whether it is installed by typing "node"
   in your terminal).
2. Go into app directory
3. Type "npm install". This will install all node related dependencies for you.
4. Type "npm start". This starts the server.
5. Download MongoDb from http://mongodb.org/ (you can easily check whether 
   it is installed by typing "mongod" in your terminal)
6. Type "mkdir data" (you're in app folder now, just to remind you).
7. Type "mongod --dbpath data". This sets the database path to the folder you
   just created. It also starts mongodb backend.
8. Go to browswer and visit localhost:8080. Da-da, you should see our Q app~

IMPORTANT
I've run into this issue several so learn lesson from me... When you end the
project. You will probably control-c the "npm start" terminal and the mongod
terminal. HOWEVER, do not do that do mongod terminal because if you do you will
have a hard time starting mongodb. Do the following instead:
1. Open another terminal at the same location
2. Type "Mongo"
3. Now you're in mongo shell. 
4. Type "use admin"
5. Type "db.shutdownServer()"
If, just if, you forget to do this, next time you cannot start your mongod,
you can try "rm data/mongod.lock". Perhaps it will work for you.
Let me know if you have any question~ (Coco).
This is the link to the tutorial I basically follow (I did both this link and
the sequal to the original post): http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/
