export const getAcceptMessage = (code: string): string => {
  // Чтение изображения и кодирование в Base64
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Confirmation</title>
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
        padding: 8px;
        border-radius: 12px;
        font-size: 12px;
      }
      .email-header h4 {
        font-size: 18px;
        margin-left: 40px;
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
        <p class="lang">Рус</p>
        <h4>Подтверждение email</h4>
      </div>
      <!-- Body Section -->
      <div class="email-body">
        <h1>${code}</h1>
        <p>
          Введите код на странице подтверждения и подтвердите email. <br />
          Никому не сообщайте код!
        </p>
        <p class="warning">
          Если вы не запрашивали код подтверждения, возможно, кто-то <br />
          пытается получить доступ к вашему аккаунту.
        </p>
      </div>
    </div>
    <div class="email-container">
      <!-- Header Section -->
      <div class="email-header">
        <p class="lang">Eng</p>
        <h4>Сonfirmation email</h4>
      </div>
      <!-- Body Section -->
      <div class="email-body">
        <h1>${code}</h1>
        <p>
          Enter the code on the confirmation page to confirm your email <br />
          Do not share the code with anyone!
        </p>
        <p class="warning">
          If you did not request a passcode, someone may <br />
          trying to access your account
        </p>
      </div>
    </div>
    <div class="email-container">
      <!-- Header Section -->
      <div class="email-header">
        <p class="lang">Қаз</p>
        <h4>Растау электрондық поштасы</h4>
      </div>
      <!-- Body Section -->
      <div class="email-body">
        <h1>${code}</h1>
        <p>
          Растау бетінде кодты енгізіп, электрондық поштаңызды растаңыз. <br />
          Кодты ешкіммен бөліспеңіз!
        </p>
        <p class="warning">
          Егер сіз растау кодын сұрамаған болсаңыз, біреу сұрауы мүмкін <br />
          тіркелгіңізге кіруге әрекеттену
        </p>
      </div>
    </div>
  </body>
</html>
  `;
};
