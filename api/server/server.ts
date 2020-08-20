import 'dotenv/config';
import App from './app';
import MarkdownController from './markdown/markdown.controller';
import AuthenticationController from './authentication/authentication.controller';
import UserController from './user/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [
        new MarkdownController(),
        new AuthenticationController(),
        new UserController(),
    ],
);

app.listen();
