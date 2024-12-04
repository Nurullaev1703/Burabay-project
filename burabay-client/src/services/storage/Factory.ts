import { StorageService } from "./StorageService";
import { TokenModel } from "./models/TokenModel";

export const tokenService = new StorageService<TokenModel>("TOKEN_KEY")
export const phoneService = new StorageService<string>("phone")
export const roleService = new StorageService<string>("role")