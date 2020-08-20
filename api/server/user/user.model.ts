import * as mongoose from 'mongoose';
import User from './user.interface';
import { counter } from '../utils/sequence.model';
import Sequence from "../utils/sequence.interface";

interface UserDoc extends mongoose.Document {
  uid: Number;
}

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  street: String,
}, {
  _id: false
}
);

const userSchema = new mongoose.Schema(
  {
    uid: Number,
    address: addressSchema,
    email: String,
    firstName: String,
    lastName: String,
    password: {
      type: String,
      get: (): undefined => undefined,
    },
    role: {
      type: Number,
      default: 0
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },    id: false,
    timestamps: true
  },
);
userSchema.pre<UserDoc>('save', function (next) {  const doc = this;

  const name = 'user_counter';  counter.findByIdAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { upsert: true, new: true }, function (err, result: Sequence) {
    if (err) {
      return next(err);
    }

    doc.uid = result.seq;    next();
  });
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
