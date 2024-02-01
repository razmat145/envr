# envr

Nodejs Typescript Environment Validator and Loader

## Motivation

Tired of repeating (or copy/paste) the same environment variable handling and validation over and over again?  
`envr` aims to help with that!

It does so by using an `Environment` typed and decorated class via a small build step

### Installing

```
npm install --save envr
```

### Setup

We start by firstly defining our `env.ts`

e.g.

```typescript
// <cwd>/src/env.ts
import { EnvVariable, IsPartOfEnum, DefaultsTo } from 'envr';

export class Environment {
  @EnvVariable('APPLICATION_NAME')
  applicationName: string;

  @EnvVariable('PORT')
  @DefaultsTo(3000)
  port: number;

  @EnvVariable('LOG_LEVEL')
  @IsPartOfEnum(['debug', 'info', 'warn', 'error'])
  logLevel: string;

  redis: RedisConnectionConfig;

  prometheus: PrometheusConfig;
}

class RedisConnectionConfig {
  @EnvVariable('REDIS_HOST')
  host: string;

  @EnvVariable('REDIS_PORT')
  port: number;

  @EnvVariable('REDIS_USERNAME')
  username: string;

  @EnvVariable('REDIS_PASSWORD')
  password: string;

  @EnvVariable('REDIS_INDEXES')
  indexes: string[];
}

class PrometheusConfig {
  @EnvVariable('PROMETHEUS_ENABLED')
  @DefaultsTo(false)
  enabled: boolean;

  @EnvVariable('PROMETHEUS_HOST')
  host: string;

  @EnvVariable('PROMETHEUS_PORT')
  port: number;

  @EnvVariable('PROMETHEUS_DEFAULT_QUANTILES')
  defaultQuantiles?: number[];

  flags?: PrometheusFlags;
}

class PrometheusFlags {
  @EnvVariable('PROMETHEUS_ENABLED_ENDPOINTS')
  enabledEndpoints?: string[];

  @EnvVariable('PROMETHEUS_ENABLED_USER_IDS')
  enabledUserIds?: number[];
}
```

Note: the name of the file nor the location is not important (as its target can be changed within the build step); the important part is to `export` the `Environment` class.

### Building the env types

The type definition of the `Environment` class must be built in order to survive past runtime.  
We use `tparserr` to translate the type definition into a `.json` file, and we do so as below:  
`tparserr generate --includeOnlyExports --enableDecorators -f=<env.ts target path> -o=<env.json output path>`

By default `envr` looks for the `env.json` type descriptions under `<cwd>/env.json` - this however can be changed via adjusting the `targetPath` passed to the `envr` initialisation.

Following the example above, we can build the types by either manually running:  
`npx tparserr generate --includeOnlyExports --enableDecorators -f=./src/env.ts -o=./env.json`  
or simply adding it as a `package.json` script and hook it before out `tsc` build.

e.g.

```json
{
  // ...
  "scripts": {
    "build-env": "tparserr generate --includeOnlyExports --enableDecorators -f=./src/env.ts -o=./env.json",
    "build": "npm run build-env && tsc"
  }
  // ...
}
```

### Usage

It is recommended to initialise `envr` as soon as possible during the app startup in order to validate if the whole environment corresponds to the typed `Environment`; after which it can be used/reused throughout the application without having to `initialize` (singleton).

```typescript
// <cwd>/src/index.ts
process.env.APPLICATION_NAME = 'test';
process.env.PORT = '3000';
process.env.LOG_LEVEL = 'debug';

process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.REDIS_USERNAME = 'user';
process.env.REDIS_PASSWORD = 'password';
process.env.REDIS_INDEXES = 'abc, def, ghi';

process.env.PROMETHEUS_ENABLED = 'true';
process.env.PROMETHEUS_HOST = 'localhost';
process.env.PROMETHEUS_PORT = '9090';
process.env.PROMETHEUS_DEFAULT_QUANTILES = '0.5, 0.9, 0.99';

import { Environment } from './env';
import { Enver } from 'envr';

(async function main() {
  await Enver.initialize<Environment>();

  const env = Enver.getEnv<Environment>();
  // const env: Environment

  const port = Enver.get<Environment, 'port'>('port');
  // const port: number

  const hasRedisHost = Enver.has('redis.host');
  // const hasRedisHost: boolean

  const redisOpts = Enver.get<Environment, 'redis'>('redis');
  // const redisOpts: RedisConnectionConfig

  const redisPort = Enver.get<Environment, 'redis', 'port'>('redis', 'port');
  // const redisPort: number

  const prometheusDefaultQuantiles = Enver.get<
    Environment,
    'prometheus',
    'defaultQuantiles'
  >('prometheus', 'defaultQuantiles');
  // const prometheusDefaultQuantiles: number[]

  const prometheusEnabledUserIds = Enver.get<
    Environment,
    'prometheus',
    'flags',
    'enabledUserIds'
  >('prometheus', 'flags', 'enabledUserIds');
  // const prometheusEnabledUserIds: number[]
})().catch(console.error);
```

Note: in case the environment is invalid, `envr` will throw `error`s in the order of validation/type description (fail-fast)

### API tldr;

- `initialise` - used to initialise `envr`
- `getEnv` - used to get the whole loaded environment
- `has` - checks whether a json path (e.g. `nesting.key.otherKey`) to an environment variable exists
- `get` - used to get specific env variable values

### Supported Decorators

- `@EnvVariable` - required on any `Environment` property that requires validation/loading
- `@IsPartOfEnum` - used to restrict allowed values to a predefined enum
- `@DefaultsTo` - used to default env variables if not present

### Configuration

```typescript
export interface IEnverConfig {
  // by default it points to <cwd>/env.json for its' to be loaded type definitions
  targetPath?: string;
}
```

### Suggestions

Any improvement ideas/suggestions; feel free to open an issue :)

## License

This library is licensed under the Apache 2.0 License
