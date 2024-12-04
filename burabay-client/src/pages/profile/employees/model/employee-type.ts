export enum PositionType{
    MERCHANDAISER = "товаровед",
    MANAGER = "менеджер",
    OPERATOR = "оператор",
    LEADER = "руководитель"
}

export interface EmployeeType{
    id:string,
    fullName:string,
    phoneNumber:string,
    position: PositionType;
    email: string;
    permissions: PermissionsType
}

export interface PermissionsType{
    createOrders: boolean;
    signContracts: boolean;
    editProducts: boolean;
    editEmployee: boolean;
}