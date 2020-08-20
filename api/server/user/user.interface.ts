interface User {  uid?: number;
  firstName?: string;
  lastName?: string;  email: string;
  password: string;  role?: number;
  address?: {
    street: string,
    city: string,
    country: string
  };
}

export default User;
