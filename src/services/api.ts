// API endpoint'leri için sabit değerler
export const API_BASE_URL = 'https://api.example.com'; // Backend URL'i buraya gelecek

// API istekleri için yardımcı fonksiyonlar
export const api = {
  // Giriş işlemi için
  login: async (email: string, password: string) => {
    try {
      // TODO: Backend entegrasyonu yapıldığında bu kısım güncellenecek
      // Şimdilik mock data dönüyoruz
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'test@test.com' && password === '123456') {
            resolve({
              success: true,
              data: {
                token: 'mock-jwt-token',
                user: {
                  id: 1,
                  email: 'test@test.com',
                  name: 'Test User',
                },
              },
            });
          } else {
            reject({
              success: false,
              message: 'E-posta veya şifre hatalı.',
            });
          }
        }, 1000); // Gerçek API çağrısını simüle etmek için 1 saniye gecikme
      });
    } catch (error) {
      throw error;
    }
  },

  // Çıkış işlemi için
  logout: async () => {
    try {
      // TODO: Backend entegrasyonu yapıldığında bu kısım güncellenecek
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    } catch (error) {
      throw error;
    }
  },
}; 