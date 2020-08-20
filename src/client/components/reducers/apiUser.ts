import {
    UserState,
    USER_ERROR,
    FETCH_USER_DETAIL,
    UserActionTypes
} from '../types/apiUser';

const initialState: UserState = {
    error: {
        message: '',
        status: 0
    },
    userDetail: {
        email: '',
        firstName: '',
        lastName: '',
        address: {
            city: '',
            country: '',
            street: ''
        }
    }
};

export default function (state = initialState, action: UserActionTypes): UserState {
    switch (action.type) {
        case USER_ERROR:
            return { ...state, error: action.payload };
        case FETCH_USER_DETAIL:
            let toFetch = {
                email: action.payload.email,
                firstName: '',
                lastName: '',
                address: {
                    city: '',
                    country: '',
                    street: ''
                }
            }
            if(action.payload.firstName) toFetch.firstName = action.payload.firstName;
            if(action.payload.lastName) toFetch.lastName = action.payload.lastName;
            if(action.payload.address && action.payload.address.city) toFetch.address.city = action.payload.address.city;
            if(action.payload.address && action.payload.address.country) toFetch.address.country = action.payload.address.country;
            if(action.payload.address && action.payload.address.street) toFetch.address.street = action.payload.address.street;

            return {
                ...state,
                error: {
                    message: '',
                    status: 0
                },
                userDetail: toFetch
            };
        default:
            return state;
    }
};