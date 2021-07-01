# pa-api-auth
## Setup Environment Variables
```
cp .env.dist .env
```
in .env replace templates with real values
```
DB_PSWD={{db-password}}
HOST_ENV={{env}}
NODE_ENV={{env}}
JWT_SECRET={{secret}}
DB_CONNECTION_STRING={{db-connection-string}}
DB_READ_PREFERENCE={{primaryPreferred|secondary|secondaryPreferred|nearest}}
