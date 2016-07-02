# Cordova Notes

Documenting how to create the [Cordova](https://cordova.apache.org) app from scratch ’cuz I did that thing where you build the thing but forget how you built it. You know, that thing.

------

## Step 0: Install Node.js & NPM

You probably already have these installed. If not, see [this](https://github.com/segdeha/pdxcodeguild/blob/master/2.%20HTML%20%26%20CSS/2/nodejs-and-npm.md).

------

## Step 1: Install Cordova

    npm install -g cordova

Or, if that fails:

    sudo npm install -g cordova

------

## Step 2: Create the app

`cd` into the directory where you want to create the app, then run the following:

    cordova create WhatINeed com.pdxcodeguild.whatineed WhatINeed

------

## Step 3: Edit `config.xml`

Open `WhatINeed/config.xml` in Atom and change the following:

- description
- author

------

## Step 4: Add platforms

At a minimum, add iOS and Android as platforms (Cordova can also build to OS X, Blackberry, webOS, etc.).

    cordova platform add ios --save
    cordova platform add android --save

------

## Step 5:


------

## Step 6: 


------

## Step 7: 


------

## Step 8: 


------

## Step 9: 


------

## Step 10:

