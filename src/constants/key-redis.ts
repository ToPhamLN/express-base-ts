export const LOCK_EXPIRE = 60 * 60 * 24;
export const VERIFY_EMAIL_EXPIRE = 60 * 1;
export const VERIFY_EMAIL = (id: string) => `verify_email_${id}`;
export const LOCK_USER = (id: string) => `lock_user_${id}`;
