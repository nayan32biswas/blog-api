const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const randomString = (N = 5) => {
  let result = '';
  for (let i = 0; i < N; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
};

export const toAlphabet = (str: string) => str.replace(/[^\w]+/gi, '');

export const slugify = (str: string) =>
  str.replace(/[^\w]+/gi, '-').toLowerCase();
