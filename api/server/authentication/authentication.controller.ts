import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from "../middleware/auth.middleware"
import { CreateUserDto } from '../user/user.dto';
import User from '../user/user.interface';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import UserNotFoundException from '../exceptions/UserNotFoundException';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  public authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/refresh-token`, this.refreshToken);
    this.router.get(`${this.path}/sync-user`, authMiddleware, this.syncUser);
    this.router.post(`${this.path}/check-auth-ssr`, this.checkAuthSSR);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private syncUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const user = request.user;
    response.send(user);
  }

  private refreshToken = async (request: RequestWithUser, response: Response, next: NextFunction) => {    const cookies = request.cookies;
    if (cookies && cookies.Token) {
      const secret = process.env.JWT_SECRET;
      try {
        const verificationResponse: any = jwt.verify(cookies.Token, secret) as DataStoredInToken;
        const uid = verificationResponse.uid;
        const user = await userModel.findOne({ uid });
        if (user) {
          const tokenData = this.createToken(user);          response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
          response.send(user);
        } else {
          next(new UserNotFoundException(uid));
        }
      } catch (error) {
        next(new WrongAuthenticationTokenException());
      }
    } else {      response.send();
    }
  };

  private checkAuthSSR = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const body = request.body;
    if (body && body.Token) {
      const secret = process.env.JWT_SECRET;
      try {
        const verificationResponse: any = jwt.verify(body.Token, secret) as DataStoredInToken;
        const uid = verificationResponse.uid;
        const user = await userModel.findOne({ uid });
        if (user) {
          response.send(user);
        } else {
          next(new WrongAuthenticationTokenException());
        }
      } catch (error) {
        next(error);
      }
    } else {
      next(new AuthenticationTokenMissingException());
    }
  };

  private registration = async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const {
        user,
      } = await this.authenticationService.register(userData);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.get('password', null, { getters: false }),
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Token=;Path=/;Max-age=0']);
    response.sendStatus(200);
  }

  private createCookie(tokenData: TokenData) {
    return `Token=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      uid: user.uid,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

}

export default AuthenticationController;
