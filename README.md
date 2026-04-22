# Requirements

1. NodeJS
2. Yarn
3. Backend
4. VScode extensions: eslint, prettier

# Initial setup

- Copy file `.env.example` to `.env`
- BE server running at `VITE_PROXY_URL` the same as in `.env`. Notice that API calls in this FE will point to itself, ones with `/api` path prefix will be proxied to BE server
- Install required library packages:

```
yarn install
```

# Running application

- Run development API server

```
yarn start:dev
```

# Development commands

- Build application

```
yarn build

```

- Serve compiled statis files

```
yarn serve
```
