export enum ConnectionFunctions {
  DBConnection = 'DBConnection',
}

export enum ConnectionActions {
  Established = 'Established',
  UsingExistingDBConnection = 'UsingExistingDBConnection',
  ExistingDBConnectionNotConnected = 'ExistingDBConnectionNotConnected',
  Failed = 'Failed',
}
