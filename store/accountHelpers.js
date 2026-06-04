// ==========================================
// MOCK STORAGE API AND ACCOUNT HELPERS
// ==========================================

const ACCOUNT_STORAGE_KEY = 'manyavarAccount';
const PASSWORD_SALT = 'manyavar-demo-auth-v1';
const LEGACY_DEFAULT_PASSWORD_HASH = '639ca5047cea82d5b76fd4086cb4e6ba6b4dfc1787f5aa9774437395cbd850c8';

const isBrowser = () => typeof window !== 'undefined' && window.localStorage;

export const getPublicUser = (account) => ({
  name: account.name,
  email: account.email,
  mobile: account.mobile,
  image: account.image,
});

const isLegacyDefaultAccount = (account) => (
  account?.name === 'Sakshi' &&
  account?.email === 'sakshi@gmail.com' &&
  account?.passwordHash === LEGACY_DEFAULT_PASSWORD_HASH
);

export const getStoredAccount = () => {
  if (!isBrowser()) {
    return null;
  }

  const storedAccount = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);

  if (!storedAccount) {
    return null;
  }

  try {
    const parsedAccount = JSON.parse(storedAccount);

    if (isLegacyDefaultAccount(parsedAccount)) {
      window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
      return null;
    }

    if (parsedAccount.password && !parsedAccount.passwordHash) {
      delete parsedAccount.password;
    }

    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(parsedAccount));
    return parsedAccount;
  } catch {
    window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
    return null;
  }
};

export const saveAccountProfile = (profile) => {
  const storedAccount = getStoredAccount();

  if (!storedAccount) {
    return null;
  }

  const account = {
    ...storedAccount,
    name: profile.name,
    email: profile.email,
    mobile: profile.mobile,
  };

  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  return account;
};

const hashPassword = async (password) => {
  const input = `${PASSWORD_SALT}:${password}`;

  if (!window.crypto?.subtle) {
    return input;
  }

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const verifyPassword = async (password) => {
  const account = getStoredAccount();

  if (!account) {
    return false;
  }

  const passwordHash = await hashPassword(password);

  return account.passwordHash === passwordHash;
};

export const validateCredentials = async (email, password) => {
  const account = getStoredAccount();

  if (!account) {
    return false;
  }

  const passwordHash = await hashPassword(password);

  return (
    account.email.toLowerCase() === email.trim().toLowerCase() &&
    account.passwordHash === passwordHash
  );
};

export const createAccount = async ({ name, email, mobile, password }) => {
  const account = {
    name,
    email,
    mobile,
    image: '/user.jpg',
    passwordHash: await hashPassword(password),
  };

  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  return account;
};

export const updateStoredPassword = async (password) => {
  const storedAccount = getStoredAccount();

  if (!storedAccount) {
    return null;
  }

  const account = {
    ...storedAccount,
    passwordHash: await hashPassword(password),
  };

  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  return account;
};
