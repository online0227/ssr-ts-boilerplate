import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../user/user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Token) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse: any = jwt.verify(cookies.Token, secret) as DataStoredInToken;
      const uid = verificationResponse.uid;
      const user = await userModel.findOne({ uid });
      if (user) {
        request.user = user;
        next();
      } else {
        next(new UserNotFoundException(uid));
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
