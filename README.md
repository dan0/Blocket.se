Blocket.se
==========

This is a NodeJS script that checks Blocket for new ads and sends an email.

How to install
==============

Clone the repo, cd into the Blocket.se folder and type "npm install".  npm
will install the dependencies.

How to use
==========

Open the config.json file and change the settings in there. Provide your
email credentials like host, username, password so that it can use these to send
you an email with all the new ads.  Change the "recipient" value to the email
address which should recieve alerts.

You can also change after how many miliseconds it should check blocket for a new
ad.

Finally add/remove urls from the url array inside the config.json file. These
urls can be retrieved from the blocket.se website. Do a search on the website
and then copy the url and add it in the urls array.

How to run
==========

Go into the Blocket.se folder and run **node main.js**

Dependencies
==========

This is a NodeJS script so you need NodeJS installed on your computer.

These packages are required in order for you to run the script

1. requirejs (npm install requirejs)
2. cheerio (npm install cheerio)
3. emailjs (npm install emailjs)
4. node-gyp (npm install node-gyp)
5. iconv (npm install iconv)

npm can be used to automatically install the dependencies, by running
the "npm install" command from the root of the project.
