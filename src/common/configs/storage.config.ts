import 'dotenv/config';
import { get } from 'env-var';

export const storageConfig = {
  path: get('STORAGE_PATH').required().asString(),
  allowedMimetypes: ['image/png', 'image/jpeg', 'image/gif', 'text/plain'],
};
