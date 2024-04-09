export default () => ({
  SECRET: process.env.JWT_APP_SECRET,
});

export const EXPIRES = 3600;
