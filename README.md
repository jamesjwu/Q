# CMUQ
A office hours queue web app for 15-122. Under perpetual development...

Built on [node.js](http://nodejs.org), and assorted black magic.

## Prerequisites
- Install node.js.
- Install npm.

## How to run
- `git clone https://github.com/cocokechun/Q.git`
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

## Running on modulus

- Install the modulus npm package
- Run `modulus deploy`
- Log in with modulus account, continue as directed.

##Implementation details

### Front end
The front end of the queue is written in jade and jquery. It is primarily located in the public and views folders.
```
public/
    font/ - contains fonts
    javascripts/
        admin.js - Code for running admin controls
        Chart[.min].js - package for rendering charts in metrics
        common.js - code that's run everywhere, such as updating the title of the queue
        fuse.min.js - package for fuzzy search in metrics
        index.js - Code that's run on the queue's main page
        loggedIn.js - Small piece of code that checks if a user is logged in. Put at the start of any page that requires authentication
        login.js - Code for logging in and out
        materialize[.min].js - package for frontend effects and animations
        metrics.js Code for generation of metrics information
        mobile.js - Leftover in development code for mobile version. Not production ready
    stylesheets/
        materialize[.min].css - package for CSS effects
        style.css - package for specific custom styling. Edit this for anything specific you want to change

views/
    admin.jade - admin page HTML generation
    error.jade – default page for any error
    index.jade - front page layout
    layout.jade - common layout for top nav bar
    metrics.jade - metrics page HTML generation
    mobile.jade - Leftover in development code for mobile version. Not production ready.
```

### Back end

The backend server is implemented in routes
```
routes/
    index.js - Most reasonable routes
    metrics.js - Metrics related backend code
    users.js - Login related backend code, including authentication
```

### Miscellaneous
These files aren't included in the git repo, but are required for production:
coursePass.txt - md5 hashed course password
emailPass.txt - plaintext file with email password for email alerts
studentIDs.txt - plaintext list of student IDs in the course
TAAndrewIDs.txt - plaintext list of TA IDs in the course

These should be stored securely server side, with no way to access them publicly.
