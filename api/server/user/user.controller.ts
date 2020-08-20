import { Router, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import userModel from './user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import { UpdateUserDto } from './user.dto';
import UserService from './user.service';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  public userService = new UserService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:uid`, authMiddleware, this.getUserById);
    this.router.put(`${this.path}/update/:uid`, authMiddleware, this.updateUser);
  }  private getUserById = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const uid = request.params.uid;
    const userQuery = this.user.findById(uid);

    const user = await userQuery;
    if (user) {
      response.send(user);
    } else {
      next(new UserNotFoundException(uid));
    }
  }

  private updateUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      if (request.user.uid === Number.parseInt(request.params.uid)) {
        let userData: UpdateUserDto = { ...request.body, uid: request.user.uid };

        const {
          user,
        } = await this.userService.update(userData);

        response.send(user);
      } else {
        next(new NotAuthorizedException());
      }

    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
