# pg-versioning

Migration versioning support for PostgreSQL.

# ideas

Input — a well-formed directory, like:

/migrations/v1.0.0/01_types.sql
/migrations/v1.0.0/02_users.sql
/migrations/v1.0.1/01_users.patch.sql
/migrations/v2.0.0/01_contracts.sql

First, the user should initialize the versioning functions, this is idempotent:

`pgVersioning.initialize();`

User provides a path:

`pgVersioning.performMigrations('./migrations');`

File system is read, builds a raw graph like:

```
[
  {
    version: 'v1.0.0',
    migrations: [
      {name: '01_types.sql', sql: 'blah blah'},
      {name: '02_users.sql', sql: 'blah blah'}
    ]
  },
  {
    version: 'v1.0.1',
    migrations: [
      {name: '01_users.patch.sql', sql: 'blah blah'}
    ]
  },
  {
    version: 'v2.0.0',
    migrations: [
      {name: '01_contracts.sql', sql: 'blah blah'}
    ]
  }  
]
```

Graph is sorted, all migrations and versions are put in lexical order.

Each version creates a dependency of all versions before it in the graph.

Be sure this is installed `https://github.com/depesz/Versioning`

Build out query

```
BEGIN;
select _v.register_patch(filename, ARRAY[dependency, dependency], NULL);
insert into users (username) values ('depesz');
COMMIT;
```
