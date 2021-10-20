# Nest Blog Api

## Start Up the project

- `docker-componse up api --build`
- `docker-componse exec api bash`
  - `yarn typeorm:migration:generate <migration-name>` Generate migration file inside *src/migrations/<>.ts*
  - `yarn typeorm:migration:run` Reflact migration on database.

