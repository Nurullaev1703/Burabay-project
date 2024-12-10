import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    kz: {
      translation: {

        //welcome page
        welcome: "Қош келдіңіз",
        buyer: "Мен сатып алушымын",
        provider: "Мен сатушымын",
        providerRole: "Сатушы",
        buyerRole: "Сатып алушы",
        noneRole: "Қонақ",
        buyerHint:
          "Тауарды өз дүкеніңізге сату үшін сатып алыңыз немесе алыңыз",
        providerHint:
          "Өз тауарыңызды басқа біреудің дүкеніне сатуға немесе беруге",
        continue: "Жалғастыру",

        // login page
        skip: "Өткізіп жіберу",
        termsOfUseText: "Жалғастыра отырып сіз келісесіз",
        termsOfUseLink:
          "дербес деректерді өңдеумен және пайдалану ережелерімен",
        inputNumber: "Телефон нөмірін енгізіңіз",
        inputNumberText: "кіру немесе тіркелу үшін",
        getCode: "Кодты алыңыз",

        // accept page
        inputCode: "SMS - тен кодты енгізіңіз",
        sendCodeInfo: "Код нөмірге жіберілді",
        change: "Өзгерту",
        cancel: "Бас тарту",
        invalidCode: "Қате код",

        // register page
        orgType: "Ұйым түрі",
        register: "Тіркеу",
        orgName: "Ұйымның заңды атауы",
        registerNumber: "Тіркеу нөмірі",
        city: "Қала",
        acceptEgovData:
          "Электрондық цифрлық қолтаңба арқылы деректерді растаңыз",
        goToEgov: "ЭЦҚ растау",
        successTextUsual:
          "Он минут ішінде біздің маман сіздің 1С қызметіңізді біріктіру уақытын келісу үшін сізбен байланысады",
        successTextLate:
          "Ертең Біздің маман сіздің 1С қызметіңізді біріктіру уақытын келісу үшін сізбен байланысады",
        registerSuccess: "Тіркеу аяқталды",
        whatNext: "Әрі қарай не болады?",
        nameHint: "Басшының аты-жөні (толық)",
        acceptPerson: "Бизнес ЭЦҚ көмегімен жеке басын растаңыз",
        acceptPersonHint:
          "Бизнесте қолданылатын ЭЦҚ пайдаланыңыз. Егер оған телефоннан қол жетімділік болмаса, компьютер арқылы жеке басын растаңыз oneclick.kz",
        successEgov: "ЭЦҚ расталды",
        noBusinessInfo:
          "ЭЦҚ-да бизнес туралы ақпарат жоқ, басқа ЭЦҚ-ны қолданып көріңіз",
        ncalayerError: "NCALayer-ге қосылу мүмкін болмады:",
        signingError: "Қол қою қатесі болды",
        ownerError: "Фирманың иесі ғана қол қоя алады",
        moveToProfile:
          "1С жүйеңізді қызметке біріктіру файлын жүктеп алу үшін профильге өтіңіз",
        // input validation and errors
        invalidNumber: "Дұрыс емес телефон нөмірі",
        requiredField: "Бұл өріс міндетті болып табылады",
        tooManyRequests: "Тым көп әрекет, қолдау сұраңыз",
        invalidBin: "Ұйымның қате БСН",
        egovAuthError: "Egov арқылы авторизация қатесі",
        minSymbols: "Минималды таңбалар",

        // change phone page
        changePhone: "Нөмірді өзгерту",
        newPhoneNumber: "Жаңа телефон нөмірін енгізіңіз",
        phoneHint: "ол кіру үшін пайдаланылады",
        acceptHint:
          "Egov Mobile арқылы деректерді растағаннан кейін сізге SMS келеді",

        // profile page
        waiting1C: "Сіздің 1С қызметке қосылуын күтеміз",
        debts: "Қарыздар",
        contracts: "Шарттар",
        branches: "Филиалдар",
        employees: "Қызметкерлер",
        profileSettings: "Профиль параметрлері",
        help: "Көмек",
        estimateService: "Қызметті бағалаңыз",
        historyOrder: "Жеткізу тарихы",

        // profile edit page
        settings: "Параметрлер",
        region: "Аймақ",
        managerFilial: "Менеджердің электрондық поштасы",
        requisitesCheck: "Есеп айырысу деректемелері",
        bankName: "Банктің атауы",
        dataForLogin: "Авторизацияға арналған деректер",
        save: "Сақтау",
        logoutFromAccount: "Есептік жазбадан шығу",
        changeNumberHint: "Телефон нөмірін өзгерту үшін басыңыз",
        changeNumber: "Нөмірді өзгерту",
        enterNewNumber: "Жаңа телефон нөмірін енгізіңіз",
        descriptionNewNumber: "ол кіру үшін қолданылады",
        egovConfirm:
          "Egov Mobile арқылы деректерді растағаннан кейін сізге SMS келеді",
        addRequisite: "Шот қосу",
        newRequisite: "Жаңа шот",
        deleteRequisite: "Шотты жою",
        fullBankName: "Банктің толық атауы",
        bankNameError:
          "Банк табылмады. Сақтамас бұрын қате бар-жоғын тексеріңіз",
        // profile pages
        notifications: "Хабарламалар",
        noNotificaitions: "Хабарламалар жоқ",
        authHistory: "Авторизация тарихы",
        noAuthHistory: "Авторизация әлі болған жоқ",
        invalidUsername: "Пайдаланушы аты бірдей емес",
        noEmployees: "Қызметкерлер әлі жоқ",
        acceptWaiting: "Растауды күту",
        newEmployee: "Жаңа қызметкер",
        FIO: "Толық аты-жөні",
        emailForNotifications: "Хабарландыру электрондық поштасы",
        positionEmployee: "Қызметкер рөлі",
        placingOrder: "Тапсырыстарды орналастыру",
        signingContract: "Келісімшарттарға қол қою",
        employeeManagement: "Қызметкерлерді басқару",
        portfolioEdit: "Өнім портфолиосын өңдеу",

        //products page
        yourSuggestions: "Сіздің ұсыныстарыңыз",
        promotions: "Акциялар",
        discounts: "Жеңілдіктер",
        cashback: "Кэшбэк",
        yourProducts: "Сіздің тауарларыңыз",
        public: "Жарияланған",
        unpublic: "Жарияланбаған",

        // settings products page
        settingsProducts: "Портфель параметрлері",
        minimumSumm: "Себеттегі ең төменгі тапсырыс сомасы",
        applicationsSchedule: "Өтінімдерді қабылдау кестесі",
        monday: "Дүйсенбі",
        tuesday: "Сейсенбі",
        wednesday: "Сәрсенбі",
        thursday: "Бейсенбі",
        friday: "Жұма",
        saturday: "Сенбі",
        sunday: "Жексенбі",
        regionDelivery: "Жеткізу аймағы",
        regionAdd: "Аймақ қосу",
        // orders pages
        orders: "Тапсырыстар",
        ordersInfo:
          "Алынған тапсырыстар 1С қосылғаннан кейін осы жерде көрсетіледі",
        inputFindOrder: "Қолданбаны табыңыз",
        uploadOrders: "Барлық жаңа қолданбаларды жүктеп салыңыз",
        NEW: "Жаңа",
        IN_PROCESS: "Өңдеуде",
        DELIVERED: "Жеткізілді",
        IN_DELIVERY: "Жеткізуде",
        DELETED: "Жойылды",
        Cancel: "Болдырмау",
        EmptyOrderHistory: "Тапсырыс тарихы табылмады",
        Sorting: "Сұрыптау",
        OneC: "Алынған тапсырыстар 1С қосылғаннан кейін осы жерде көрсетіледі",

        // product portfolio pages
        productPortfolio: "Өнім портфолиосы",
        productsInfo: "1С қосылғаннан кейін өнімдеріңіз осы жерде көрсетіледі",

        questionConvenient: "Қолданба қаншалықты ыңғайлы?",
        describeInconvenient: "Қолданбаның не ыңғайсыз екенін сипаттаңыз?",
        describeСonvenient: "Қолданбаны не ыңғайлырақ ете алады?",
        thanks: "Рахмет!",
        answer: "Жауап",

        deleteEmployee: "Қызметкерді жою",
        apply: "Қолдану",
        allProductsPublished: "Барлық тауарлар жарияланды",
        // product page
        aboutProduct: "Өнім туралы",
        orderFrom: "Тапсырыс: ",
        brandProduct: "Бренд",
        expirationDateProduct: "Жарамдылық мерзімі",
        inStock: "Қоймада",
        countryProduct: "Елі",
        compoundProduct: "Құрамы",
        showInFull: "Толығымен көрсету",
        descriptionProduct: "Сипаттамасы",
        gender: "Жыныс",
        color: "Түс",
        material: "Материал",
        size: "Өлшем",
        expDate: "Сақтау мерзімі",
        expType: "Саны",
        power: "Салмағы",
        dosage: "Доза",
        needRecipe: "Рецепт",
        season: "Маусым",
        first: "Алдымен",
        new: "Жаңа",
        highPrice: "Қымбатырақ",
        lowPrice: "Арзан",
        old: "Ескі",
        unpublished: "Жарияланбаған",
        edit: "Өңдеу",
        count: "Саны",

        CountBig: "Көбірек бірлік",
        CountDown: "Бірліктер аз",
        firstDelivery: "Жеткізуде бірінші",
        firstEdit: "Өңдеуде бірінші",
        sumUp: "Сома көбірек",
        sumDown: "Сома аз",

        productPublish: "Өнімді жариялау",
        image: "Сурет",
        productName: "Өнім атауы",
        productCardPrice: "Тауар карточкасындағы баға",
        priceFor: "Бағасы үшін",
        multiplicity: "Еселік",
        resultPrice: "Қорытынды",
        minSumOrder: "Тауарға тапсырыс берудің ең аз сомасы",
        sum: "Сомасы",
        stockBalance: "Қоймадағы қалдық",
        availability: "Әрқашан қоймада бар",
        notAvailability: "Егер қалса «аяқталады»",
        description: "Сипаттама",
        showFull: "Толық көрсету",
        hideFull: "Мәтінді кішірейту",

        // promo page
        promo: "Акциялар",
        active: "Белсенді",
        archive: "Мұрағат",
        newPromo: "Жаңа акция",
        promoInArchive: "Барлық акциялар жарияланды",
        promoCategory: "Акциялық категория",

        // promo edit page
        infoAboutPromo: "Акция туралы ақпарат",
        title: "Тақырып",
        promoDuration: "Акцияның ұзақтығы",
        invalidDate: "Қате формат",
        maxLengthExceeded: "Символдар санының максималды шегінен асып кеттіңіз",
        deletePromo: "Акцияны жою",
        promoPublish: "Акцияны жариялау",

        // debts page
        arrears: "Қарыздар",
        findApplication: "Өтінімді табу",
        NotificateAll: "Барлығын хабарландыру",
        autoNotification: "Авто - хабарландыру",
        dayOfWeek: "Апта күні",
        exception: "Ерекшелік",
        add: "Қосу",
        invoices: "Шот-фактуралар",

        // terms page
        commonTerms:
          "Жеке деректерді өңдеуге келісімнің жалпы шарттары (жеке кабинет)",
        menu: "Мәзір",
        legalDocuments: "One Click заңды құжаттары",
        termsOfUse: "Қызметті пайдалану шарттары",
        termsOfPromo: "Акциялардың шарттары",

        // client profile page
        bonuses: "Бонустар",
        shops: "Дүкендер",
        favourite: "Таңдаулылар",
        deliveryAddress: "Тауарды жеткізу мекенжайы",

        // none profile page
        loginProfile: "Профильге кіріңіз",
        descriptionNoneProfile:
          "Келісімшарттарға, бонустарға, жеткізу тарихына және тағы басқаларға қол жеткізіңіз",
        login: "Кіру",

        // Nav Menu
        main: "Басты бет",
        providers: "Жеткізушілер",
        cart: "Себет",
        delivery: "Жеткізу",
        profile: "Профиль",

        // cart page
        cartDescription:
          "Бұл жерде сіздің себетке қосылған тауарларыңыз көрсетіледі.",

        //poviders page
        providersDescription:
          "Жеткізушіні таңдаңыз және оның санаттары осы қойындыда пайда болады",
        selectProvder: "Жеткізушіні таңдаңыз",
      },
    },
    ru: {
      translation: {

        // welcome page
        continue: "Продолжить",

        // login page
        skip: "Пропустить",
        termsOfUseText: "Продолжая вы соглашаетесь",
        termsOfUseLink:
          "с обработкой персональных данных и правилами пользования",
        inputNumber: "Введите номер телефона",
        inputNumberText: "чтобы войти или зарегистрироваться",
        getCode: "Получить код",

        //accept page
        inputCode: "Введите код из СМС",
        sendCodeInfo: "Код отправлен на номер",
        change: "Изменить",
        cancel: "Отмена",
        invalidCode: "Неверный код",

        // register pages
        orgType: "Тип организации",
        register: "Регистрация",
        orgName: "Юридическое название организации",
        registerNumber: "Регистрационный номер",
        city: "Город",
        acceptEgovData:
          "Подтвердите данные с помощью электронной цифровой подписи",
        goToEgov: "Подтвердить ЭЦП",
        successTextUsual:
          "В течении десяти минут с вами свяжется наш специалист что бы согласовать время для интеграции вашей 1С с сервисом",
        successTextLate:
          "Завтра с вами свяжется наш специалист что бы согласовать время интеграции вашей 1С с сервисом",
        registerSuccess: "Регистрация завершена",
        whatNext: "Что дальше?",
        nameHint: "ФИО руководителя (полное)",
        acceptPerson: "Подтвердите личность с помощью бизнес ЭЦП",
        acceptPersonHint:
          "Используйте ту ЭЦП, которая используется в бизнесе. Если к ней нет доступа с телефона, подтвердите личность через компьютер на oneclick.kz ",
        successEgov: "ЭЦП подтверждена",
        noBusinessInfo: "В ЭЦП нет информации о бизнесе, попробуйте другую ЭЦП",
        ncalayerError: "Не удалось подключиться к NCALayer:",
        signingError: "Произошла ошибка подписания",
        ownerError: "Подписать может только владелец фирмы",
        moveToProfile:
          "Перейдите в профиль что бы скачать файл интеграции вашей 1С с сервисом",

        // input validation and errors
        invalidNumber: "Некорректный номер телефона",
        requiredField: "Это поле обязательно",
        tooManyRequests:
          "Слишком большое количество попыток, обратитесь в поддержку",
        invalidBin: "Неверный БИН организации",
        egovAuthError: "Ошибка авторизации через Egov",
        minSymbols: "Минимум символов:",
        // change phone page
        changePhone: "Смена номера",
        newPhoneNumber: "Введите новый номер телефона",
        phoneHint: "он будет использоваться для входа",
        acceptHint:
          "После подтверждения данных через Egov Mobile вам придёт СМС",

        // profile page
        appLanguage: "Язык приложения",
        aboutService: "О сервисе",
        help: "Помощь",
        estimateService: "Оценить сервис",
        safety: "Безопасность",
        saved: "Сохраненное",

        // profile edit page
        accountSettings: "Настройки аккаунта",
        region: "Регион",
        managerFilial: "Менеджер магазина",
        requisitesCheck: "Реквизиты счёта",
        bankName: "Наименование банка",
        dataForLogin: "Данные для авторизации",
        save: "Сохранить",
        logoutFromAccount: "Выйти из аккаунта",
        changeNumberHint: "Нажмите что бы изменить номер телефона",
        changeNumber: "Смена номера",
        enterNewNumber: "Введите номер новый телефона",
        descriptionNewNumber: "он будет использоваться для входа",
        egovConfirm:
          "После подтверждения данных через Egov Mobile вам придёт СМС",
        addRequisite: "Добавить счёт",
        newRequisite: "Новый счёт",
        deleteRequisite: "Удалить счёт",
        fullBankName: "Полное наименование банка",
        bankNameError:
          "Банк не найден. Перед сохранением проверьте написание на наличие ошибки",
        email: "Почта",
        // profile pages
        notifications: "Уведомления",
        name: "Имя",
        noNotificaitions: "Нет уведомлений",
        authHistory: "История авторизаций",
        noAuthHistory: "Авторизаций ещё не было",
        invalidUsername: "Имя пользователя не совпадает",
        invalidEmail: "Неверный формат почты",
        noEmployees: "Сотрудников ещё нет",
        acceptWaiting: "Ожидание подтверждения",
        newEmployee: "Новый сотрудник",
        FIO: "ФИО",
        emailForNotifications: "Электронная почта для уведомления",
        positionEmployee: "Роль сотрудника",
        placingOrder: "Оформление заказов",
        signingContract: "Подписание договоров",
        employeeManagement: "Управление сотрудниками",
        portfolioEdit: "Редактирование товарного портфеля",
        account: "Аккаунт",
        accountConfirm:
          "Для подтверждения аккаунта нужно дополнить или изменить данные!",
        fillProfile: "Заполните свой профиль что бы бронировать быстрее",
        fill: "Заполнить",
        accountWaiting: "Данные отправлены, ожидайте подтверждение",
        details: "Подробнее",
        notFiled: "Не заполнено",
        organizationName: "Название организации",
        organizationAbout: "Об организации",
        emailToLogin: "Адрес для входа в в аккаунт",
        phone: "Номер телефона для связи с вами",
        phoneV2: "Телефон",
        site: "Сайт",

        //products page
        yourSuggestions: "Ваши предложения",
        promotions: "Акции",
        discounts: "Скидки",
        cashback: "Кэшбек",
        yourProducts: "Ваши товары",
        public: "Опубликовано",
        unpublic: "Неопубликовано",

        // settings products page
        settingsProducts: "Настройки портфеля",
        minimumSumm: "Минимальная сумма заказа в корзине",
        applicationsSchedule: "График приёма заявок",
        monday: "Понедельник",
        tuesday: "Вторник",
        wednesday: "Среда",
        thursday: "Четверг",
        friday: "Пятница",
        saturday: "Суббота",
        sunday: "Воскресенье",
        regionDelivery: "Регион доставки",
        regionAdd: "Добавить регион",

        // orders pages
        orders: "Заказы",
        ordersInfo:
          "Тут будут отображаться поступившие заказы, после того как мы подключим вашу 1С",
        inputFindOrder: "Найти заявку",
        uploadOrders: "Выгрузить все новые заявки",
        NEW: "Новый",
        IN_PROCESS: "В обработке",
        DELIVERED: "Доставлен",
        IN_DELIVERY: "В доставке",
        DELETED: "Удалён",
        Cancel: "Отменить",
        EmptyOrderHistory: "История заказов не найдена",
        Sorting: "Сортировка",
        OneC: "Тут будут отображаться поступившие заказы, после того как мы подключим вашу 1С",

        // product portfolio pages
        productPortfolio: "Товарный портфель",
        productsInfo:
          "Тут будут отображаться ваши товары, после того как мы подключим вашу 1С",
        allProductsPublished: "Все товары опубликованы",

        // modal
        questionConvenient: "Насколько удобно приложение?",
        describeInconvenient: "Опишите, что неудобно в приложении?",
        describeСonvenient: "Что может сделать приложение удобнее?",
        thanks: "Спасибо!",
        answer: "Ответить",

        deleteEmployee: "Удалить сотрудника",
        apply: "Применить",

        // product page
        aboutProduct: "О товаре",
        orderFrom: "Заказ от ",
        brandProduct: "Бренд",
        expirationDateProduct: "Срок годности",
        inStock: "На складе",
        countryProduct: "Страна",
        compoundProduct: "Состав",
        showInFull: "Показать полностью",
        descriptionProduct: "Описание",
        gender: "Пол",
        color: "Цвет",
        material: "Материал",
        size: "Размер",
        expDate: "Срок годности",
        expType: "Количество",
        power: "Вес",
        dosage: "Доза",
        needRecipe: "Рецепт",
        season: "Сезон",
        first: "Сначала",
        new: "Новые",
        highPrice: "Дороже",
        lowPrice: "Дешевле",
        old: "Давние",
        unpublished: "Неопубликованные",
        edit: "Редактирование",
        count: "Кол-во",

        CountBig: "Единиц больше",
        CountDown: "Единиц меньше",
        firstDelivery: "Сначала в доставке",
        firstEdit: "Сначала в обработке",
        sumUp: "Сумма больше",
        sumDown: "Сумма меньше",
        productPublish: "Публикация товара",
        image: "Изображение",
        productName: "Название товара",
        productCardPrice: "Цена в карточке товара",
        priceFor: "Цена за",
        multiplicity: "Кратность",
        resultPrice: "Итог",
        minSumOrder: "Миниальная сумма заказа товара",
        sum: "Сумма",
        stockBalance: "Остаток на складе",
        availability: "Всегда есть в наличии",
        notAvailability: "«Заканчивается» если осталось",
        description: "Описание",
        showFull: "Показать полностью",
        hideFull: "Свернуть текст",

        // promo page
        promo: "Акции",
        active: "Активное",
        archive: "Архив",
        newPromo: "Новая акция",
        promoInArchive: "Все акции опубликованы",
        promoCategory: "Акционная категория",

        // promo edit page
        infoAboutPromo: "Информация об акции",
        title: "Заголовок",
        promoDuration: "Длительность акции",
        invalidDate: "Неверный формат",
        maxLengthExceeded: "Вы превышаете максимальное кол-во символов",
        deletePromo: "Удалить акцию",
        promoPublish: "Публикация акции",

        // debt page
        arrears: "Задолженности",
        findApplication: "Найти заявку",
        NotificateAll: "Уведомить всех",
        autoNotification: "Авто - уведомление",
        dayOfWeek: "День недели",
        exception: "Исключение",
        add: "Добавить",
        invoices: "Накладные",

        // terms page
        commonTerms:
          "Общие условия согласия на обработку персональных данных (личный кабинет)",
        menu: "Меню",
        legalDocuments: "Юридичесские документы One Click",
        termsOfUse: "Условия пользования сервиса",
        termsOfPromo: "Условия акций",

        // client profile page
        bonuses: "Бонусы",
        shops: "Магазины",
        favourite: "Избранное",
        deliveryAddress: "Адрес доставки товара",

        // none profile page
        loginProfile: "Войдите в профиль",
        descriptionNoneProfile:
          "И получите доступ к договорам, бонусам истории поставок и многому другому",
        login: "Войти",

        // Nav Menu
        main: "Главная",
        providers: "Поставщики",
        cart: "Корзина",
        delivery: "Доставки",
        profile: "Профиль",

        // cart page
        cartDescription:
          "Тут будут отображаться ваши товары, добавленные в корзину.",
        noProducts: "Товаров пока нет",
        chooseProducts: "Выбрать товар",
        //poviders page
        providersDescription:
          "Выберите поставщика и его категории появятся в этой вкладке",
        selectProvder: "Выбрать поставщика",

        "signin":"Вход",
        "welcome":"Добро пожаловать!",
        "mail": "Почта",
        "inputMail":"Введите адрес электронной почты",
        "signinWith": "Или войдите с помощью",
        "next":"Далее",
        "registerBusiness":"зарегистрировать организацию"

      },
    },
  },
  lng: "ru",
  fallbackLng: "ru",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
