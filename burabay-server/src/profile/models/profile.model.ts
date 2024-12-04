import { Address } from "src/users/entities/address.entity"
import { Organization } from "src/users/entities/organization.entity"
import { User } from "src/users/entities/user.entity"
import { PERMISSIONS_TYPE, POSITION_TYPE, ROLE_TYPE } from "src/users/types/user-types"

export class Profile{
    id: string = ""
    fullName:string = ""
    phoneNumber: string = ""
    role: ROLE_TYPE | null = null
    position: POSITION_TYPE | null = null
    notifications: Notification[] | null = null
    organization: Organization | null = null
    address: Address | null = null
    permissions: PERMISSIONS_TYPE | null = null
    clientManager: User | null = null

    constructor(item:any){
        const keys = Object.keys(this)
        let validItems:Profile = this

        for(const key in item){
            if(keys.includes(key)){
                validItems[`${key}`] = item[`${key}`]
            }
        }

        Object.assign(this, validItems)
    }
}