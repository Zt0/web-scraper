export enum AuthServiceFunctions {
  ValidateUser = 'ValidateUser',
  ForgotPassword = 'ForgotPassword',
  ResetPassword = 'ResetPassword',
  VerifyOTP = 'VerifyOTP',
  SendOTP = 'SendOTP',
  LogIn = 'LogIn',
  Register = 'Register',
  RefreshToken = 'RefreshToken',
  RemoveExpiredOTPs = 'RemoveExpiredOTPs',
}

export enum AuthServiceActions {
  Succeed = 'Succeed',
  Failed = 'Failed',
}
