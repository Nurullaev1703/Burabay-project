import { StorageService } from "./StorageService";
import { TokenModel } from "./models/TokenModel";

export const tokenService = new StorageService<TokenModel>("TOKEN_KEY")
export const roleService = new StorageService<string>("role")
export const langService = new StorageService<string>("lang")
export const notificationService = new StorageService<boolean>("push")