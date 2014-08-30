# Dev Server -- WIP --

Local development server with LiveReload support that stream compile CoffeeScript and Less/Stylus.

The aim is to quickly serve any small client-side projects from any directory without grunt/gulp config.

For any _*.js_ or _*.css_ request, the server first try to find a _*.coffee_ and _*.less_ or _*.styl_ equivalent. It will then compile, cache and serve them. This doesn't force any folder organisation.
No file are saved on the working directory. The project build phase can be handled by grunt/gulp later on when your project get serious.

This way the amount of time between a file change and the refresh of the browser is very low.


## Installation

No npm package yet

    cd ~/where-i-usually-install-dev-stuff
    git clone https://github.com/mathieucivel/devserver.git
    cd devserver
    npm install
    sudo npm link


## Usage

    cd ~/where-i-do-projects/my-project
    devserver


## Options

    -r, --root <path>                                 root directory to serve, default to current directory
    -p, --port <n>                                    port number, default 8000
    -d, --domain <domain_or_ip>                       domain or ip to listen to, default localhost
    -l, --livereload <n>                              LiveReload port, default 35729
    -P, --proxy <http://domain:port,path1,path2,...>  The given list of path will be forwarded to the given url

## TODO

- browserify support with automatic coffee transform
- sass support
- check liveReload port in case of multiple instances
- better log & error management
- move bin in bin/
- need to use Express ? switch to connect ?
