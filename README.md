# thelocalworkflow

Use at your own risk.  These are internal workflow tools that don't all work, and you shouldn't trust them without knowing how to tinker with them yourself (and, obviously, perform loads of tests before you trust them in a production environment).

## getting started

For our staff, the best place to get started learning is actually [thesimpleworkflow](https://github.com/learninglab-dev/thesimpleworkflow). But when you want to get `thelocalworkflow` running on one of our machines, here are the steps:

1. make sure your machine has node and git installed (should be no problem if on one of the LL machines)
2. open up Terminal and get into your Development folder if you have one (type `cd ~/Development`)
3. type `git clone https://github.com/ll-dev-team/thelocalworkflow.git` to clone the repository--it will create a new folder for thesimpleworkflow.  (Alternatively, if you have your own github account you can click the "fork" icon to fork thesimpleworkflow and work on this fork)
4. type `cd thelocalworkflow` to change directories and get into the root of `thelocalworkflow` app
5. type `npm install` to install all the npm dependencies you'll need
5. type `atom .` to open up the root folder and all of its contents in Atom (this will only work if you have Atom command line tools installed, but you should do this if you haven't already)
6. create a file in the root directory of thesimpleworkflow called `.env` and add all your secret stuff (like `SLACK_TOKEN=XXXXXXXXXXXX` and `MONGODB_URL=XXXXXXXXXX` etc.)--ask MK for more info on this that we can't put up on GitHub
7. most currently existing functions are available by typing `node thelocalworkflow` + an argument or two.  For example, `node thelocalworkflow --rename` + a folder name will rename all of your footage (if you've organized your folders according to our conventions), and it will generate .fcpxml that syncs all footage from our 4 main cameras.  (Everything else just gets renamed).  For more on the functions available through the command line, check out `thelocalworkflow.js`, which you'll find in the root directory.
8. we are in the process of making some of these functions available through an html-interface (all running locally on `localhost:3000`).  To play around with this, type `npm start` and then open a browser.  One really useful page that's up and running is the [markers-to-stills page](http://localhost:3000/m2s), which will take in an `.fcpxml` file formatted according to the LL specs and send you back well-named stills, serving them up as a web preview for you and storing them in the public folder.
