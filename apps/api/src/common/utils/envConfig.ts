import dotenv from 'dotenv'
import { cleanEnv, host, num, port, str, testOnly } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['development', 'production', 'test'],
  }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  DB_HOST: str(),
  DB_PORT: num(),
  DB_USER: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_MAX_CONNECTIONS: num({ devDefault: testOnly(20) }),
  DB_IDLE_TIMEOUT: num({ devDefault: testOnly(30000) }),
  DB_CONNECTION_TIMEOUT: num({ devDefault: testOnly(5000) }),
})
