class PrismaClient {
  constructor() {
    // simple in-memory store for models
    this._data = {
      user: [],
      order: [],
      payment: []
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

    // order model mock
    this.order = {
      create: async ({ data }) => {
        const record = { id: data.id || `ord_${Math.random().toString(36).slice(2,8)}`, ...data };
        this._data.order.push(record);
        return record;
      },
      findUnique: async ({ where }) => {
        return this._data.order.find(o => o.id === where.id) || null;
      },
      findMany: async (query = {}) => {
        // simple filter by where.userId
        if (query.where && query.where.userId) {
          return this._data.order.filter(o => o.userId === query.where.userId);
        }
        return this._data.order.slice();
      }
    };

    // payment model mock
    this.payment = {
      create: async ({ data }) => {
        const record = { id: data.id || `pay_${Math.random().toString(36).slice(2,8)}`, ...data };
        this._data.payment.push(record);
        return record;
      },
      findUnique: async ({ where }) => {
        return this._data.payment.find(p => p.id === where.id) || null;
      },
      findMany: async (query = {}) => {
        if (query.where && query.where.orderId) {
          return this._data.payment.filter(p => p.orderId === query.where.orderId);
        }
        return this._data.payment.slice();
      }
    };
  }

  // test helpers
  __reset(data = {}) {
    this._data = Object.assign({ user: [], order: [], payment: [] }, data);
  }

  $connect() { return Promise.resolve(); }
  $disconnect() { return Promise.resolve(); }
}

module.exports = { PrismaClient };
