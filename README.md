# my-to-do

Clone coding: [Microsoft To Do](https://todo.microsoft.com/)

## Requirements

- Node 16

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:5000
$ yarn dev

# build for production
$ yarn build

# launch server in production mode
$ yarn start
```

## Production Server Management

1. Launch server with systemd

```bash
# First, you need to fill in the empty WorkingDirectory value in the service file.

# Then do the following:
$ sudo cp my-to-do.service /etc/systemd/system
$ sudo systemctl enable my-to-do.service
$ sudo systemctl start my-to-do.service
```

2. Deploy

```bash
$ git fetch
$ git checkout (RELEASE_VERSION)
$ yarn install
$ yarn build
$ sudo systemctl restart my-to-do.service
```
