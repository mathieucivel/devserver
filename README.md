# ExpressJS Dev Server

#-- WIP --

Local development server with LiveReload support that stream compile CoffeeScript and Stylus.

The aim is to quickly serve any small client-side projects from any directory without grunt/gulp config.

For any _*.js_ or _*.css_ request, the server try first to find a _*.coffee_ and _*.styl_ equivalent. It then compile, cache and serve them. This doesn't force any folder organisation.
No files are saved on the working directory. The project build phase can be handled by grunt/gulp later on when your project get serious.


## Installation

No npm package yet

    cd ~/where-i-usually-install-stuff
    git clone https://github.com/mathieucivel/devserver.git
    cd devserver
    npm link


## Usage

    cd ~/where-i-do-projects/my-project
    devserver


## TODO

- cache js & css compiled files based on modification time
- no need to use Express right ? switch to connect
- check liveReload port in case of multiple instances
- less / sass support
- proxy feature
- better error management
- move bin in bin/
