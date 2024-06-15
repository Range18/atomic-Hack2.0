export namespace AllExceptions {
  export enum AuthExceptions {
    AccountIsNotVerified = 'Account is not verified. Please verify your email.',
    WrongPassword = 'Wrong password',
    ExpiredToken = 'Access token expired',
    InvalidAccessToken = 'Invalid access token',
  }

  export enum SessionExceptions {
    SessionNotFound = 'Session is not found',
    SessionExpired = 'Session expired',
  }

  export enum FileExceptions {
    NotFound = 'File is not found',
    AlreadyExists = 'File already exists',
  }

  export enum MessageExceptions {
    NotFound = 'File is not found',
  }

  export enum UserExceptions {
    UserNotFound = 'User is not found',
    UserAlreadyExists = 'User already exists',
  }

  export enum Queries {
    InvalidLimitOffset = 'limit * offset - offset can`t be < 0',
  }
}
