import { Profile } from "../../../profile/model/profile";

export interface Notification {
  email: string;
    users: Profile[],
    message: string,
    createdAt: Date,
    title: string,
    isRead: boolean,
    id: string,
    type: NotificationType,

}

export const NotificationType = {
    POSITIVE: "позитивное",
    NEGATIVE: "негативное",
    NEUTRAL: "нейтральное",
    NONE: "пустое",
  } as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];