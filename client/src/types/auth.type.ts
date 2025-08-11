export interface signupInput {
    name : string;
    email : string;
    password : string;
    confirmPassword : string
}

export interface AxiosResponse {
  success: boolean;
  message: string;
}

export interface BaseResponse<T> {
    success: boolean;
    message: string;
    data: T
}


export interface ICustomer {
    _id: string,
    name: string;
    address: string;
    mobile: number;
}

export interface Response {
    customer: ICustomer,
    message: string;
}

export interface IItem {
    _id : string;
    name: string;
    description: string;
    quantity: number;
    price: number;
}

export interface ISale {
    _id : string;
    date: Date,
    items: {
        name : string,
        quantity : number,
        price : number,
    }[],
    customerName: string;
}

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};