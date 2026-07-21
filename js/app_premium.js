// app_premium.js - Logika Utama Al-Quran Premium

/**
 * MENGUBAH TEMA EKSKLUSIF
 * Menambahkan kelas tema ke body (misal: 'theme-ocean', 'theme-forest')
 */
function changeTheme(themeName) {
    console.log("Bos mengubah tema ke: " + themeName);
    
    // Hapus semua tema lama
    document.body.classList.remove(
        'theme-space', 
        'theme-ocean', 
        'theme-forest', 
        'theme-mountain', 
        'theme-modern'
    );
    
    // Tambahkan tema baru
    document.body.classList.add(themeName);
    
    // Opsional: Simpan preferensi Bos di LocalStorage agar tidak hilang saat di-refresh
    localStorage.setItem('quran_theme', themeName);
}

// Saat halaman dimuat, periksa apakah ada tema yang tersimpan sebelumnya
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('quran_theme');
    if (savedTheme) {
        changeTheme(savedTheme);
    } else {
        // Default tema: Luar Angkasa
        changeTheme('theme-space');
    }
});
