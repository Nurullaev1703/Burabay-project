import { Organization } from "./users/entities/organization.entity";

export class NotificationsMessages {
    // admin-panel.service.ts
    public static getAccountBlockedMessage(language: string): NotificationContent {
        return staticNotifications.accountBlocked[language];
    }
    public static getAccountUnblockedMessage(language: string): NotificationContent {
        return staticNotifications.accountUnblocked[language];
    }
    public static getCancelBookingByBlockOrgMessage(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru':
                return {
                    title: `Бронирование отменено из-за блокировки организации`,
                    text: `Бронирование "${adTitle}" отменено из-за блокировки организации, которая создала объявление.`
                };
            case 'en':
                return {
                    title: `Booking canceled due to organization block`,
                    text: `Booking "${adTitle}" canceled due to organization block that created the ad.`
                };
            case 'kz':
                return {
                    title: `Ұйымның бұғатталуына байланысты брондау жойылды`,
                    text: `Брондау "${adTitle}" ұйымның бұғатталуына байланысты жойылды, ол хабарландыруды жасаған.`
                };
        }
    }
    public static getDeleteBookingByDeleteAdMessage(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru':
                return {
                    title: `Бронирование удалено из-за удаления объявления`,
                    text: `Бронирование "${adTitle}" удалено из-за удаления объявления администратором.`
                };
            case 'en':
                return {
                    title: `Booking deleted due to ad removal`,
                    text: `Booking "${adTitle}" deleted due to ad removal by the administrator.`
                };
            case 'kz':
                return {
                    title: `Хабарландыру жойылғандықтан брондау жойылды`,
                    text: `Брондау "${adTitle}" әкімші тарапынан хабарландыру жойылғандықтан жойылды.`
                };
        }
    }

    // booking.service.ts
    public static getNewBookingForAdMessage(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Новое бронирование для объявления`,
                text: `У вас новое бронирование для объявления "${adTitle}".`
            };
            case 'en': return {
                title: `New booking for ad`,
                text: `You have a new booking for ad "${adTitle}".`
            };
            case 'kz': return {
                title: `Хабарландыру үшін жаңа брондау`,
                text: `Сізде "${adTitle}" хабарландыруы үшін жаңа брондау бар.`
            };
        }
    }
    public static getDeleteBookingMessage(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return { title: `Бронирование удалено`, text: `Бронирование на объявление ${adTitle} удалено` };
            case 'en': return { title: `Booking has been deleted`, text: `Your booking for ad ${adTitle} has been deleted` };
            case 'kz': return {
                title: `Сіздің брондауыңыз жойылды`,
                text: `Сіздің ${adTitle} хабарландыруыңызға арналған брондауыңыз жойылды`
            };
        }
    }
    public static getCancelBookingMessageForTourist(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return { title: `Бронирование отменено`, text: `Ваше бронирование на объявление ${adTitle} отменено` };
            case 'en': return { title: `Booking has been canceled`, text: `Your booking for ad ${adTitle} has been canceled` };
            case 'kz': return { title: `Сіздің брондауыңыз жойылды`, text: `Сіздің ${adTitle} хабарландыруыңызға арналған брондауыңыз жойылды` };
        }
    }
    public static getCancelBookingMessageForOrg(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return { title: `Бронирование отменено`, text: `Бронирование на объявление ${adTitle} было отменено` };
            case 'en': return { title: `Booking has been canceled`, text: `The booking for ad ${adTitle} has been canceled` };
            case 'kz': return { title: `Брондау жойылды`, text: `${adTitle} хабарландыруы үшін брондау жойылды` };
        }
    }
    public static acceptBooking(language: string, adTitle: string, phone: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Бронирование подтверждено организацией`,
                text: `Ваша бронь на объявление "${adTitle}" подтверждена организацией. ${phone ? `Номер телефона: ${phone}` : ''}`
            };
            case 'en': return {
                title: `Booking accepted by organization`,
                text: `Your booking for ad "${adTitle}" has been accepted by the organization. ${phone ? `Phone number: ${phone}` : ''}`
            };
            case 'kz': return {
                title: `Ұйым брондауды растады`,
                text: `Сіздің "${adTitle}" хабарландыруыңызға арналған брондауыңыз ұйым тарапынан расталды. ${phone ? `Телефон нөмірі: ${phone}` : ''}`
            };
        }
    }
    // public static acceptBookingForTourist(language: string, adTitle: string): NotificationContent {
    //     switch (language) {
    //         case 'ru': return {
    //             title: `Турист подтвердил бронирование`,
    //             text: `Турист подтвердил бронирование на объявление "${adTitle}".`
    //         };
    //         case 'en': return {
    //             title: `Tourist accepted booking`,
    //             text: `Tourist has accepted the booking for ad "${adTitle}".`
    //         };
    //         case 'kz': return {
    //             title: `Турист брондауды растады`,
    //             text: `Турист "${adTitle}" хабарландыруы үшін брондауды растады.`
    //         };
    //     }
    // }
    public static payBooking(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Бронирование оплачено`,
                text: `Бронирование на объявление "${adTitle}" успешно оплачено.`
            };
            case 'en': return {
                title: `Booking paid`,
                text: `Your booking for ad "${adTitle}" has been successfully paid.`
            };
            case 'kz': return {
                title: `Брондау төленді`,
                text: `"${adTitle}" хабарландыруы үшін брондауыңыз сәтті төленді.`
            };
        }
    }
    public static expiredBooking(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Бронирование истекло`,
                text: `Срок действия бронирования на объявление "${adTitle}" истек.`
            };
            case 'en': return {
                title: `Booking expired`,
                text: `Your booking for ad "${adTitle}" has expired.`
            };
            case 'kz': return {
                title: `Брондаудың мерзімі аяқталды`,
                text: `"${adTitle}" хабарландыруы үшін брондауыңыздың мерзімі аяқталды.`
            };
        }
    }

    // review.service.ts
    public static newReviewForOrg(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Новый отзыв для организации`,
                text: `Для объявления "${adTitle}" оставлен новый отзыв.`
            };
            case 'en': return {
                title: `New review for organization`,
                text: `A new review has been left for ad "${adTitle}".`
            };
            case 'kz': return {
                title: `Ұйымға жаңа шолу`,
                text: `"${adTitle}" хабарландыруы үшін жаңа шолу қалдырылды.`
            };
        }
    }
    public static deleteReviewForTourist(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Отзыв удален`,
                text: `Ваш отзыв для объявления "${adTitle}" был удален.`
            };
            case 'en': return {
                title: `Review deleted`,
                text: `Your review for ad "${adTitle}" has been deleted.`
            };
            case 'kz': return {
                title: `Шолу жойылды`,
                text: `"${adTitle}" хабарландыруы үшін шолу жойылды.`
            };
        }
    }
    // review-answer.service.ts
    public static answerReviewForTourist(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Ответ на ваш отзыв`,
                text: `На ваш отзыв для объявления "${adTitle}" был дан ответ.`
            };
            case 'en': return {
                title: `Answer to your review`,
                text: `An answer has been given to your review for ad "${adTitle}".`
            };
            case 'kz': return {
                title: `Сіздің шолуңызға жауап`,
                text: `"${adTitle}" хабарландыруы үшін сіздің шолуңызға жауап берілді.`
            };
        }
    }
    // review-report.service.ts
    public static reportReviewForTourist(language: string, adTitle: string): NotificationContent {
        switch (language) {
            case 'ru': return {
                title: `Жалоба на ваш отзыв`,
                text: `На ваш отзыв для объявления "${adTitle}" была подана жалоба.`
            };
            case 'en': return {
                title: `Report on your review`,
                text: `A report has been filed on your review for ad "${adTitle}".`
            };
            case 'kz': return {
                title: `Сіздің шолуңызға шағым`,
                text: `"${adTitle}" хабарландыруы үшін сіздің шолуңызға шағым түсті.`
            };
        }
    }
}
const staticNotifications = {
    accountBlocked: {
        ru: {
            title: 'Ваш аккаунт был заблокирован',
            text: 'Администратор заблокировал ваш аккаунт.'
        },
        en: {
            title: "Your account has been blocked",
            text: "The administrator has blocked your account."
        },
        kz: {
            title: "Сіздің аккаунтыңыз бұғатталды",
            text: "Әкімші сіздің аккаунтыңызды бұғаттады."
        },
    },
    accountUnblocked: {
        ru: {
            title: 'Ваш аккаунт был разблокирован',
            text: 'Администратор разблокировал ваш аккаунт.'
        },
        en: {
            title: "Your account has been unblocked",
            text: "The administrator has unblocked your account."
        },
        kz: {
            title: "Сіздің аккаунтыңыздың бұғаттамасы алынды",
            text: "Әкімші сіздің аккаунтыңыздың бұғаттамасын алып тастады."
        }
    },
}

export type NotificationContent = {
    title: string;
    text: string;
};