import { EnvVariable, IsPartOfEnum, DefaultsTo } from '../src/utils/Decorators';

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

  @EnvVariable('SECRET_EXPIRE_AT')
  secretExpireAt: Date;
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
