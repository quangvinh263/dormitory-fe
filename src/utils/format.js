export const getInitials = (name) => {
  if (!name) return 'U';
  const words = name.trim().split(' ');
  const last = words[words.length - 1][0];
  const first = words.length > 1 ? words[words.length - 2][0] : '';
  return (first + last).toUpperCase();
};  