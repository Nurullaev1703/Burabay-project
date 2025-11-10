import dayjs, { Dayjs } from "dayjs";

/**
 * Нормализирует дату в строковом формате (YYYY-MM-DD или DD.MM.YYYY)
 * и возвращает объект dayjs
 */
export const normalizeDate = (dateStr: string | undefined): Dayjs | null => {
  if (!dateStr) return null;

  // Проверяем формат YYYY-MM-DD (ISO)
  if (dateStr.includes("-") && dateStr.length === 10) {
    return dayjs(dateStr, "YYYY-MM-DD").startOf("day");
  }

  // Проверяем формат DD.MM.YYYY
  if (dateStr.includes(".") && dateStr.length === 10) {
    return dayjs(dateStr, "DD.MM.YYYY").startOf("day");
  }

  // Пытаемся спарсить как есть
  const parsed = dayjs(dateStr);
  if (parsed.isValid()) {
    return parsed.startOf("day");
  }

  console.warn(`Invalid date format: ${dateStr}`);
  return null;
};

/**
 * Проверяет, находится ли дата в диапазоне [start, end)
 * Начало включено, конец исключён
 */
export const isDateInRange = (
  date: Dayjs,
  startStr: string,
  endStr?: string
): boolean => {
  const start = normalizeDate(startStr);
  if (!start) return false;

  const end = endStr ? normalizeDate(endStr) : start;
  if (!end) return false;

  return date.isBetween(start, end, null, "[)");
};

/**
 * Проверяет, совпадает ли дата с конкретной датой (игнорирует время)
 */
export const isSameDay = (date: Dayjs, dateStr: string): boolean => {
  const normalized = normalizeDate(dateStr);
  if (!normalized) return false;
  return date.isSame(normalized, "day");
};

/**
 * Преобразует дату в стандартный формат DD.MM.YYYY для отображения
 */
export const formatDateDisplay = (dateStr: string): string => {
  const normalized = normalizeDate(dateStr);
  if (!normalized) return dateStr;
  return normalized.format("DD.MM.YYYY");
};
