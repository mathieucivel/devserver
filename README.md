# ExpressJS Dev Server

#-- WIP --

Local development server with LiveReload support that stream compile
CoffeeScript and Stylus.

The aim is to quickly serve any small client-side projects from any directory
without grunt/gulp config.

For any _*.js_ or _*.css_ request, the server try first to find a _*.coffee_
and _*.styl_ equivalent. It then compile, cache and serve them.


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

- stylus middleware
- cache coffeeScript compiled files based on modification time
- no need to use Express right ? switch to connect
- check liveReload port in case of multiple instances
- better error management
