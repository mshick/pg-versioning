import path from 'path';
import fs from 'fs';
import glob from 'glob';
import fp from './fp';
const { map, reduce, sortBy, toPairs, slice, join, flow } = fp;

const joinComma = join(',');
const joinNewLine = join('\n');

export interface Migration {
  filepath: string;
  filename: string;
  contents: string;
}

export interface Version {
  version: string;
  dependencies?: Array<string>;
  migrations?: Array<Migration>;
}

const getMigrations = (dirpath: string): Array<Migration> => {
  return sortBy(
    ['filename', 'asc'],
    reduce(
      (migrations, filename) => {
        const filepath = path.join(dirpath, filename);
        const contents = fs.readFileSync(filepath, 'utf8');

        const migration: Migration = {
          filepath,
          filename,
          contents
        };

        return [...migrations, migration];
      },
      [],
      glob.sync('*.sql', { cwd: dirpath })
    )
  );
};

const getVersions = (dirpath: string): Array<Object> => {
  return sortBy(
    ['version', 'asc'],
    reduce(
      (versions, filepath) => {
        const pathname = path.join(dirpath, filepath);
        const isDirectory = fs.statSync(pathname).isDirectory();

        if (isDirectory) {
          const version: Version = {
            version: filepath,
            migrations: getMigrations(pathname)
          };

          return [...versions, version];
        }

        return versions;
      },
      [],
      glob.sync('v*[0-9].*[0-9].*[0-9]*(-rc*(.*[0-9]))', { cwd: dirpath })
    )
  );
};

const mapDependencies = (versions): Array<Object> => {
  return map((args: Array<any>): Object => {
    const [index, version] = args;
    const dependsOn = slice(0, Number(index));
    const dependencies = map('version', dependsOn(versions));
    return {
      ...version,
      dependencies
    };
  }, toPairs(versions));
};

export const buildMigrationGraph = (dirpath: string): Array<Object> => {
  return flow(getVersions, mapDependencies)(dirpath);
};

const buildUpQuery = (node: Version): string => {
  const version = `'${node.version}'`;
  const dependencies = node.dependencies.length
    ? `ARRAY[${joinComma(map(str => `'${str}'`, node.dependencies))}]`
    : 'NULL';
  const migrations = joinNewLine(map('contents', node.migrations));

  return `
BEGIN;
select _v.register_patch(${version}, ${dependencies}, NULL);
${migrations}
COMMIT;`;
};

export const buildUpQueries = map(buildUpQuery);
