Storage = (() => {
  let storage_ = {};
  return {
    set(key, value) {
      storage_[key] = value;
    },

    get(key) {
      return storage_[key];
    },

    reset() {
      storage_ = {};
    },
  };
})();
