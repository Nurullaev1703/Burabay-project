import { RegisterOptions } from "react-hook-form"

export const requiredField = {
    required: "Это поле обязательное"
}

export const requiredValidateMinLength = (length: number): RegisterOptions =>{
    return {
        ...requiredField,
        validate: (value) => value.length > length || `Минимум ${length} символов`
    }
}
export const requiredEmailValidationRule ={
    ...requiredField,
    validate: (value:string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || "Некорректный email"
    }
}

export const requiredPhoneValidationRule = {
    ...requiredField,
    validate: (value:string) => {
        const phoneRegex = /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(value) || "Некорректный номер телефона"
    } 
}
export const requiredPasswordValidationRule = {
    ...requiredField,
    validate: (value:string) => {
        const passwordRegex = /^[a-zA-Z0-9]+$/;
        return passwordRegex.test(value) || "Пароль может содержать только буквы и цифры и быть больше 7 символов"
    } 
}