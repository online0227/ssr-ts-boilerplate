import * as mongoose from 'mongoose';
import Sequence from "./sequence.interface";

const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

export const counter = mongoose.model<Sequence & mongoose.Document>('counter', CounterSchema);

export const Sequence = function() {
    const user_counter = () => {
        return new Promise((resolve, reject) => {
            counter.collection.insert({
                _id: "user_counter",
                seq: 1
            }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    setTimeout(resolve, 10);
                }
            });
        });
    };

    return Promise.race([
        user_counter(),    ])
};
