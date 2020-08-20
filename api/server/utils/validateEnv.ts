import { cleanEnv, port, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    DATABASE: str(),
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    PORT: port(),
  });
}

export default validateEnv;
