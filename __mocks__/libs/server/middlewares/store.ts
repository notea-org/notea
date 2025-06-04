// __mocks__/libs/server/middlewares/store.ts
import { ApiRequest } from 'libs/server/connect';

// Gunakan fungsi synchronous karena next() kemungkinan tidak perlu di-await dalam konteks mock ini
export const useStore = (req: ApiRequest, _res, next) => {
  applyStore(req); // Panggil fungsi untuk mengisi req.state
  next();          // Panggil next() untuk melanjutkan ke handler API
};

export function applyStore(req: ApiRequest) {
  const mockStore = {};

  // Pastikan req.state diinisialisasi dengan benar.
  // req.state || {} akan memastikan req.state selalu menjadi objek
  // bahkan jika awalnya undefined.
  req.state = {
    ...(req.state || {}),
    store: mockStore,
    treeStore: {
      // Mock method 'get' untuk mengembalikan data pohon dummy
      get: async () => [
        {
          id: 'mock-root',
          name: 'Mock Root Node',
          children: [],
        },
      ],
      // Mock method lain jika digunakan dalam test POST
      moveItem: async (source: any, dest: any) => {
        console.log('[mock] moveItem', source, dest);
      },
      mutateItem: async (id: string, data: any) => {
        console.log('[mock] mutateItem', id, data);
      },
    },
  };
}