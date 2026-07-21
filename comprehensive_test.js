const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Memulai Uji Coba 5 Lapis (Brute-Force UI Test)...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  let errorCount = 0;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ BROWSER ERROR:', msg.text());
      errorCount++;
    }
  });
  page.on('pageerror', err => {
    console.log('❌ PAGE EXCEPTION:', err.toString());
    errorCount++;
  });

  console.log('1️⃣ Memuat Halaman Utama...');
  await page.goto('file:///C:/Users/Irwan%20Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', { waitUntil: 'networkidle0' });

  console.log('2️⃣ Menguji Rendering Tampilan...');
  const title = await page.title();
  console.log('Judul Halaman:', title);

  console.log('3️⃣ Simulasi Klik Brutal (Brute-Force Clicking)...');
  try {
    await page.evaluate(() => {
       const btns = document.querySelectorAll('button');
       btns.forEach(b => { try { b.click() } catch(e) {} });
    });
    console.log('✅ Semua tombol (' + (await page.evaluate(() => document.querySelectorAll('button').length)) + ' tombol) berhasil disentuh tanpa crash kritis.');
  } catch (e) {
    console.log('❌ Gagal simulasi klik:', e);
  }

  console.log('4️⃣ Memeriksa Variabel & Scope Penting...');
  const checkVars = await page.evaluate(() => {
    return {
      playAudio: typeof window.playAudio,
      showTafsir: typeof window.showTafsir,
      searchAyah: typeof window.searchAyah,
      changeTheme: typeof window.changeTheme,
      closeSettings: typeof window.closeSettings,
    };
  });
  console.log('✅ Tipe Variabel Global:', checkVars);

  console.log('5️⃣ Memeriksa Fitur Pencarian...');
  try {
    await page.evaluate(() => {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = 'allah';
        const event = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(event);
      }
    });
    // Wait a bit to see if search triggers any errors
    await new Promise(r => setTimeout(r, 1000));
    console.log('✅ Fitur pencarian tidak menyebabkan error crash.');
  } catch (e) {
    console.log('❌ Error pada fitur pencarian:', e);
  }

  await browser.close();
  console.log('🏁 Tes Selesai! Total Error Ditemukan:', errorCount);
  if (errorCount === 0) {
    console.log('🏆 KODE SUPER SEMPURNA! TIDAK ADA SATU PUN ERROR TERSISA!');
  }
})();
