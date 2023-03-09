export enum EnvConfigFunctions {
  Get = 'Get',
}

export enum EnvConfigActions {
  GetSecretFailed = 'GetSecretFailed',
}

export enum JestGlobal {
  JestGlobalTeardownFile = 'JestGlobalTeardownFile',
  JestGlobalTeardownMessage = '\n --- Run Jest Global Teardown Script ---',
  JestGlobalSetupFile = 'jestGlobalTeardownFile',
  JestGlobalSetupMessage = '\n --- Run Jest Global Setup Script ---',
  LoadEnv = 'LoadEnv',
}

export enum SwaggerActions {
  CreateSwagger = 'CreateSwagger',
  ISSwaggerEnabled = 'isSwaggerEnabled',
  AuthCredentials = 'AuthCredentials',
  AuthParts = 'AuthParts',
  SwaggerEnabledMessage = 'Attempt to open doc page on environment with swagger disabled',
  AuthCredentialsMessage = 'No swagger basic auth login and password: SWAGGER_PASSWORD',
  CheckAuthPartsMessage = 'Not valid SWAGGER_PASSWORD format, should be login:password',
}

export enum UnhandledExceptionsFilterEnum {
  HandleUnknownError = 'HandleUnknownError',
}
