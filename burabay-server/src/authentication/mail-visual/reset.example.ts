export const getResetMessage = (code: string, email:string): string => {
  // Чтение изображения и кодирование в Base64
  return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <style>
      /* Reset CSS */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      }

      /* Container */
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #f8f9fa;
        border-radius: 8px;
        overflow: hidden;
      }

      /* Header */
      .email-header {
        background-color: #0a7d9e;
        color: #ffffff;
        padding: 16px;
        text-align: center;
        display: flex;
      }

      .email-header .lang {
        background-color: #ffffff;
        color: #000;
        padding: 8px 0;
        width: 40px;
        height: fit-content;
        border-radius: 12px;
        font-size: 12px;
        margin-right: 32px;
      }

      .email-header h4 {
        font-size: 18px;
        padding-top: 4px;
      }

      /* Body */
      .email-body {
        padding: 24px;
        background-color: #ffffff;
      }

      .email-body h1 {
        font-size: 48px;
        color: #0a7d9e;
        letter-spacing: 25px;
        margin-bottom: 24px;
        text-align: center;
      }

      .email-body p {
        font-size: 16px;
        line-height: 24px;
        color: #333333;
        margin-bottom: 16px;
      }

      .email-body .warning {
        font-weight: bold;
        margin-top: 16px;
      }

      /* Footer */
      .email-footer {
        padding: 16px;
        text-align: center;
        font-size: 14px;
        color: #777777;
        background-color: #f1f3f4;
      }

      .email-footer a {
        color: #0a7d9e;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <div class="email-container">
      <!-- Header Section -->
      <div class="email-header">
        <div class="lang">Рус</div>
        <div style="width: 100%; text-align: right;">
          <h4>Запрос на смену пароля</h4>
          <p style="color:#fff;">${email}</p>
        </div>
      </div>
      <!-- Body Section -->
      <div class="email-body">
        <h1>${code}</h1>
        <br />
        <p>
          Введите код на странице подтверждения и смените пароль. <br />
          Никому не сообщайте код!
        </p>
        <p class="warning">
          Если вы не запрашивали смену пароля, возможно, кто-то <br />
          пытается получить доступ к вашему аккаунту
        </p>
      </div>
    </div>
    <div class="email-container">
      <!-- Header Section -->
      <div class="email-header">
        <div class="lang">Eng</div>
        <div style="width: 100%; text-align: right;">
          <h4>Password change request</h4>
          <p style="color:#fff;">${email}</p>
        </div>
      </div>
      <!-- Body Section -->
      <div class="email-body">
        <h1>${code}</h1>
        <br />
        <p>
          Enter the code on the confirmation page and change the password. <br />
          Don't tell anyone the code!
        </p>
        <p class="warning">
          If you have not requested a password change, it is possible that <br />
          someone is trying to gain access to your account
        </p>
      </div>
    </div>
    <div class="email-container">
      <!-- Header Section -->
      <div class="email-header">
        <div class="lang">Қаз</div>
        <div style="width: 100%; text-align: right;">
          <h4>Құпия сөзді өзгерту туралы сұрау</h4>
          <p style="color:#fff;">${email}</p>
        </div>
      </div>
      <!-- Body Section -->
      <div class="email-body">
        <h1>${code}</h1>
        <br />
        <p>
          Растау бетіне кодты енгізіп, құпия сөзді өзгертіңіз. <br />
          Кодты ешкімге бермеңіз!
        </p>
        <p class="warning">
          Егер сіз парольді Өзгертуді сұрамаған болсаңыз, біреу сіздің <br />
          есептік жазбаңызға кіруге тырысуы мүмкін
        </p>
      </div>
    </div>
  </body>
</html>


  `;
};
