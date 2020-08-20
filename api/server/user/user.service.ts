import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../user/user.dto';
import userModel from './../user/user.model';

class UserService {
    public user = userModel;

    public async update(userData: UpdateUserDto) {
        let toDelete = {};        Object.keys(userData).forEach(k => {
            if (!userData[k] && userData[k] !== undefined) {
                delete userData[k];
                toDelete[k] = " ";
            }
        });        if (userData.address) {
            toDelete = { ...toDelete, address: {} };
            Object.keys(userData.address).forEach(k => {
                if (!userData.address[k] && userData.address[k] !== undefined) {
                    delete userData.address[k];
                    toDelete["address"][k] = " ";
                };
            });

            if (Object.keys(userData.address).length === 0) {
                delete userData["address"];
            }
        };

        if (userData.password && userData.password.length > 0) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData = { ...userData, password: hashedPassword };
        } else {
            delete userData["password"];
        }
        delete toDelete["password"];        await this.user.findOneAndUpdate(
            { uid: userData.uid },
            { $unset: toDelete },        );

        const user = await this.user.findOneAndUpdate(
            { uid: userData.uid },
            { $set: userData },
            (err, user) => {
                user.password = undefined;
            }
        );

        return {
            user,
        };
    }
}

export default UserService;
