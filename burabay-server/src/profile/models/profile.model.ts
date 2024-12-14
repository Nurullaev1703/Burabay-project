import { Organization } from "src/users/entities/organization.entity"
import { User } from "src/users/entities/user.entity"
import { ROLE_TYPE } from "src/users/types/user-types"

export class Profile{
    fullName:string = ""
    phoneNumber: string = ""
    role: ROLE_TYPE | null = null
    picture: string | null = null
    email: string = ""
    isEmailConfirmed: boolean = false
    organization: Organization | null = null

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