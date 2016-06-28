# whatineed

Smart shopping list

## Installation

Clone this repo and cd into it

    git clone https://github.com/segdeha/whatineed.git

then

    cd whatineed

### Create a virtual env and activate it:

    virtualenv env

then

    source env/bin/activate

you should see (env) show up in front of your prompt (ex: `(env) Jasmine@Home $`)

### Make sure it's running python3

    virtualenv -p python3 env

### install django

    pip3 install django

### make sure you're in the same directory as manage.py and do

    python manage.py runserver

follow its instructions and make sure you see the right message in your browser.

## Installing Cordova

If you want to build the mobile app, you will need to install the `cordova` app.

    npm install -g cordova

To run the app on a simulator, `cd` into `cordova/WhatINeed` then run the following command:

    cordova run ios
