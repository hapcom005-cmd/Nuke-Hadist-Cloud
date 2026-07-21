// ==========================================
// AL-QURAN PREMIUM - USER DATA ENGINE
// ==========================================

const UserDataEngine = (function() {
    let data = {
        stats: {
            totalAyatRead: 0,
            readHistory: {} // format: "YYYY-MM-DD": count
        },
        notes: {}, // format: "surahNo:ayatNo": "catatan..."
        khatam: {
            active: false,
            targetDays: 30,
            startDate: null,
            versesPerDay: 0
        },
        bookmarks: [] // format: {surah, ayat, timestamp}
    };

    function init() {
        try {
            const saved = localStorage.getItem('alQuranPremiumUserData');
            if (saved) {
                const parsed = JSON.parse(saved);
                data = { ...data, ...parsed };
                data.stats = { ...data.stats, ...(parsed.stats || {}) };
                data.notes = { ...data.notes, ...(parsed.notes || {}) };
                data.khatam = { ...data.khatam, ...(parsed.khatam || {}) };
            }
        } catch (e) {
            console.error("Gagal memuat UserData", e);
        }
    }

    function save() {
        localStorage.setItem('alQuranPremiumUserData', JSON.stringify(data));
        updateStatsUI();
    }

    function getTodayKey() {
        const d = new Date();
        return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,'0') + "-" + String(d.getDate()).padStart(2,'0');
    }

    function recordRead(surahNo, ayatNo) {
        data.stats.totalAyatRead++;
        const today = getTodayKey();
        data.stats.readHistory[today] = (data.stats.readHistory[today] || 0) + 1;
        save();
    }

    function saveNote(surahNo, ayatNo, noteText) {
        const key = surahNo + ":" + ayatNo;
        if (!noteText || noteText.trim() === "") {
            delete data.notes[key];
        } else {
            data.notes[key] = noteText.trim();
        }
        save();
        alert("Catatan berhasil disimpan!");
    }

    function getNote(surahNo, ayatNo) {
        return data.notes[surahNo + ":" + ayatNo] || "";
    }

    function toggleBookmark(surahNo, ayatNo) {
        const idx = data.bookmarks.findIndex(b => b.surah === surahNo && b.ayat === ayatNo);
        if (idx >= 0) {
            data.bookmarks.splice(idx, 1);
            alert("Bookmark dihapus.");
        } else {
            data.bookmarks.push({surah: surahNo, ayat: ayatNo, timestamp: Date.now()});
            alert("Bookmark ditambahkan!");
        }
        save();
    }

    function isBookmarked(surahNo, ayatNo) {
        return data.bookmarks.some(b => b.surah === surahNo && b.ayat === ayatNo);
    }

    function startKhatam(days) {
        data.khatam.active = true;
        data.khatam.targetDays = days;
        data.khatam.startDate = Date.now();
        data.khatam.versesPerDay = Math.ceil(6236 / days);
        save();
        alert(`Target Khatam ${days} hari dimulai!\nTarget Harian: ${data.khatam.versesPerDay} Ayat.`);
    }
    
    function cancelKhatam() {
        data.khatam.active = false;
        save();
        alert("Target Khatam dibatalkan.");
    }

    // UI Updates
    function updateStatsUI() {
        const today = getTodayKey();
        const readToday = data.stats.readHistory[today] || 0;
        
        const elToday = document.getElementById('statReadToday');
        const elTotal = document.getElementById('statTotalRead');
        const elKhatam = document.getElementById('statKhatamProgress');
        
        if(elToday) elToday.innerText = readToday + " Ayat Hari Ini";
        if(elTotal) elTotal.innerText = data.stats.totalAyatRead + " Total Ayat Dibaca";
        
        if (data.khatam.active && elKhatam) {
            elKhatam.style.display = 'block';
            let percentage = (data.stats.totalAyatRead / 6236) * 100;
            if (percentage > 100) percentage = 100;
            elKhatam.innerHTML = `
                <div style="font-size:12px; color:var(--text-muted); margin-bottom:5px;">Target Khatam (${data.khatam.targetDays} Hari) - Progress: ${percentage.toFixed(1)}%</div>
                <div style="width:100%; height:8px; background:var(--bg-elevated); border-radius:4px; overflow:hidden;">
                    <div style="width:${percentage}%; height:100%; background:var(--accent-gold); border-radius:4px;"></div>
                </div>
                <div style="font-size:11px; color:var(--accent-cyan); margin-top:5px; text-align:right;">Target Harian: ${data.khatam.versesPerDay} Ayat</div>
                <button onclick="UserDataEngine.cancelKhatam()" style="margin-top:10px; background:var(--bg-elevated); border:1px solid #ff4d4d; color:#ff4d4d; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Batalkan Khatam</button>
            `;
        } else if(elKhatam) {
            elKhatam.innerHTML = `<button onclick="openKhatamModal()" style="background:var(--accent-cyan); color:var(--bg-base); border:none; padding:8px 15px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%;">Mulai Target Khatam Baru</button>`;
        }
    }

    // Call init on load
    init();

    return {
        recordRead,
        saveNote,
        getNote,
        toggleBookmark,
        isBookmarked,
        startKhatam,
        cancelKhatam,
        updateStatsUI,
        getData: () => data
    };
})();
