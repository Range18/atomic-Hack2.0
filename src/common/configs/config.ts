import 'dotenv/config';
import { get } from 'env-var';
import ms from 'ms';

export const backendServer = {
  host: get('BACKEND_HOST').default('localhost').asString(),
  port: get('BACKEND_PORT').default(3000).asPortNumber(),
  secure: get('SECURE').default('true').asBool(),
  url: function () {
    return `http${this.secure ? 's' : ''}://${this.host}:${this.port}`;
  },
  urlValue: 'https://helper.unisport.space',
};

export const frontendServer = {
  url: get('FRONTEND_URL').asString(),
};

export const AILink = get('AI_LINK').required().asString();

export const jwtConfig = {
  accessExpire: {
    ms() {
      return ms(this.value);
    },
    value: get('ACCESS_EXPIRE').asString(),
  },
  secret: get('SECRET').required().asString(),
};

export const passwordSaltRounds: number = get('PASS_SALT_ROUNDS')
  .default(10)
  .asInt();
