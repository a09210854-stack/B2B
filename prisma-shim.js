class PrismaClient {
  constructor() {
    // simple in-memory store for models
    this._data = {
      user: []
    };

    this.user = {
      findUnique: async ({ where }) => {
        return this._data.user.find(u => u.id === where.id) || null;
      },
      create: async ({ data }) => {
        const record = { ...data };
        this._data.user.push(record);
        return record;
      },
      update: async ({ where, data }) => {
        const idx = this._data.user.findIndex(u => u.id === where.id);
        if (idx === -1) return null;
        this._data.user[idx] = { ...this._data.user[idx], ...data };
        return this._data.user[idx];
      },
      delete: async ({ where }) => {
        const idx = this._data.user.findIndex(u => u.id === where.id);
        if (idx === -1) return null;
        return this._data.user.splice(idx, 1)[0];
      },
      findFirst: async (query = {}) => {
        return this._data.user[0] || null;
      }
    };
  }

  // test helpers
  __reset(data = {}) {
    this._data = Object.assign({ user: [] }, data);
  }

  $connect() { return Promise.resolve(); }
  $disconnect() { return Promise.resolve(); }
}

module.exports = { PrismaClient };
