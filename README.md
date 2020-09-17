# Introduction

Reproduction to show that `errorFormat: 'colorless'` is not working.

# To Reproduce

1. `docker-compose up -d` (to setup the database)
2. `yarn; yarn prisma generate` (to generate the client)
3. `node index.js` (the error has colors)
4. This can also be noticed in the snapshot test
