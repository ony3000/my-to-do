# my-to-do

Clone coding: [Microsoft To Do](https://todo.microsoft.com/)<br>
(Replicated the user interface of 2021.)

## Requirements

- Node 18
- [pnpm 8.5.1](https://pnpm.io/)

## Build Setup

```bash
# install dependencies
$ pnpm install

# serve with hot reload at localhost:5000
$ pnpm run dev

# build for production
$ pnpm run build

# launch server in production mode
$ pnpm run start
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
$ pnpm install
$ pnpm run build
$ sudo systemctl restart my-to-do.service
```
