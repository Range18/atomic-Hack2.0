export namespace AllExceptions {
  export enum AuthExceptions {
    AccountIsNotVerified = 'Account is not verified. Please verify your email.',
    WrongPassword = 'Неверный пароль',
    ExpiredToken = 'Время работы токена истёк, перезайдите под своим логином и паролем',
    InvalidAccessToken = 'Неверный токен доступа',
  }

  export enum SessionExceptions {
    SessionNotFound = 'Сессия не найдена',
    SessionExpired = 'Время жизни сессии истекло',
  }

  export enum FileExceptions {
    NotFound = 'Файл не найден',
    AlreadyExists = 'Файл уже существует',
  }

  export enum MessageExceptions {
    NotFound = 'Сообщение не найдено',
  }

  export enum UserExceptions {
    UserNotFound = 'Пользователь не найден',
    UserAlreadyExists = 'Пользователь с таким логином уже существует',
  }

  export enum Queries {
    InvalidLimitOffset = 'limit * offset - offset can`t be < 0',
  }
}
