export enum ROLE_TYPE{
    CLIENT = "покупатель",
    PROVIDER = "поставщик"
}

export enum POSITION_TYPE{
    MERCHANDAISER = "товаровед",
    MANAGER = "менеджер",
    OPERATOR = "оператор",
    LEADER = "руководитель"
}

export interface PERMISSIONS_TYPE {
    createOrders : boolean,
    signContracts: boolean,
    editProducts: boolean;
    editEmployees: boolean
}