export const formatGameDate = (dateString: string) => {
  const date = new Date(dateString);

  // Usar UTC para evitar problemas de zona horaria
  // Ya que las fechas se guardan como "date-only" (medianoche UTC)
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return `${day}/${monthNames[date.getUTCMonth()]}/${year}`;
};