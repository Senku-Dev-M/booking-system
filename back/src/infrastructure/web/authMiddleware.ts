import passport from './passportConfig';
export const authMiddleware = passport.authenticate('jwt', { session: false });