export const formatGameDate = (dateString: string) => {
  const date = new Date(dateString);

  // Formato Day/Month/Year: 27/Mar/2025
  const day = date.getDate();
  const year = date.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return `${day}/${monthNames[date.getMonth()]}/${year}`;
};