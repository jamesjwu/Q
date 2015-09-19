# CMUQ
A office hours queue web app for 15-122. Under perpetual development...

Built on [node.js](http://nodejs.org), and assorted black magic.

## Prerequisites
- Install node.js.
- Install npm.

## How to run
- `git clone https://github.com/jamesjwu/Q.git`
- `cd Q/app`
- `npm install`
- Create Q/app/coursePass.txt containing the MD5 hash of the password.
- Create Q/app/TAAndrewIDs.txt containing a newline-separated list of the TA
  AndrewIDs.
- Create Q/app/studentIDs.txt containing a newline-separated list of the student
  AndrewIDs.
- Create Q/app/emailPass.txt containing the password to the email used in
  Q/app/routes/users.js.
- `npm start`
- Go to [http://localhost:3000](http://localhost:3000)

Of course, these instructions are kinda useless, since currently everything is
hardwired up to our production server (please don't tell), but that's how it
ought to work.

Maybe we'll fix this this summer...
