export const formatToDisplayPhoneNumber = (rawPhone: string): string => {
  // Удаляем все символы, кроме цифр
  const cleaned = rawPhone.replace(/\D/g, "");

  // Проверяем, что номер состоит из 11 цифр и начинается с 7
  if (cleaned.length !== 11 || cleaned[0] !== "7") {
    return "+7"
  }

  // Применяем регулярное выражение для форматирования
  const formatted = cleaned.replace(
    /^(\+7|7)?(\d{3})(\d{3})(\d{2})(\d{2})$/,
    "+7 $2 $3-$4-$5"
  );

  return formatted;
};
