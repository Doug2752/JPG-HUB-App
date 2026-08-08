export const storage = {
  get: (key) => {
    try {
      const val = localStorage.getItem(key);
      return Promise.resolve(val ? { key, value: val } : null);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve({ key, value });
    } catch (e) {
      return Promise.reject(e);
    }
  },
  delete: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve({ key, deleted: true });
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
