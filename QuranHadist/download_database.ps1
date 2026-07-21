# ============================================
# SCRIPT PENGUNDUH DATABASE AL-QURAN & HADIST
# Oleh: Antigravity AI untuk Bos Irwan
# ============================================

$baseDir = "c:\Users\Irwan Fahr\Desktop\QuranHadist"

# ---- BAGIAN 1: UNDUH 114 SURAH AL-QURAN ----
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MENGUNDUH 114 SURAH AL-QURAN..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$allSurah = @()
for ($i = 1; $i -le 114; $i++) {
    try {
        $url = "https://equran.id/api/v2/surat/$i"
        $data = Invoke-RestMethod -Uri $url -TimeoutSec 30
        if ($data.code -eq 200) {
            $surah = @{
                nomor = $data.data.nomor
                nama = $data.data.nama
                namaLatin = $data.data.namaLatin
                arti = $data.data.arti
                tempatTurun = $data.data.tempatTurun
                jumlahAyat = $data.data.jumlahAyat
                ayat = @()
            }
            foreach ($a in $data.data.ayat) {
                $surah.ayat += @{
                    nomorAyat = $a.nomorAyat
                    teksArab = $a.teksArab
                    teksLatin = $a.teksLatin
                    teksIndonesia = $a.teksIndonesia
                }
            }
            $allSurah += $surah
            Write-Host "  ✅ Surah $i/$('114'): $($data.data.namaLatin) ($($data.data.jumlahAyat) ayat)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ Gagal surah $i: $_" -ForegroundColor Red
    }
    # Jeda 200ms agar tidak membebani server
    Start-Sleep -Milliseconds 200
}

$quranJson = $allSurah | ConvertTo-Json -Depth 5 -Compress
$quranJs = "const QURAN_DATA = $quranJson;"
[System.IO.File]::WriteAllText("$baseDir\quran_data.js", $quranJs, [System.Text.Encoding]::UTF8)
Write-Host "`n✅ AL-QURAN SELESAI! File: quran_data.js" -ForegroundColor Cyan

# ---- BAGIAN 2: UNDUH HADIST DARI 9 PERAWI ----
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  MENGUNDUH HADIST DARI 9 KITAB PERAWI..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$perawi = @(
    @{slug="bukhari"; name="Bukhari"},
    @{slug="muslim"; name="Muslim"},
    @{slug="abu-dawud"; name="Abu Dawud"},
    @{slug="tirmidzi"; name="Tirmidzi"},
    @{slug="nasai"; name="Nasa'i"},
    @{slug="ibnu-majah"; name="Ibnu Majah"},
    @{slug="ahmad"; name="Ahmad"},
    @{slug="darimi"; name="Darimi"},
    @{slug="malik"; name="Malik"}
)

$allHadist = @{}
foreach ($p in $perawi) {
    Write-Host "`n📚 Mengunduh Kitab $($p.name)..." -ForegroundColor Yellow
    $items = @()
    $page = 1
    $pageSize = 300
    $hasMore = $true

    while ($hasMore) {
        try {
            $url = "https://hadis-api-id.vercel.app/hadith/$($p.slug)?page=$page&limit=$pageSize"
            $data = Invoke-RestMethod -Uri $url -TimeoutSec 60
            if ($data.items -and $data.items.Count -gt 0) {
                foreach ($h in $data.items) {
                    $items += @{
                        number = $h.number
                        arab = $h.arab
                        id = $h.id
                    }
                }
                Write-Host "  📥 Halaman $page: +$($data.items.Count) hadist (Total: $($items.Count))" -ForegroundColor Gray
                if ($data.items.Count -lt $pageSize) {
                    $hasMore = $false
                } else {
                    $page++
                    Start-Sleep -Milliseconds 500
                }
            } else {
                $hasMore = $false
            }
        } catch {
            Write-Host "  ⚠️ Error halaman $page, lanjut..." -ForegroundColor Red
            $hasMore = $false
        }
    }
    $allHadist[$p.slug] = @{ name = $p.name; total = $items.Count; items = $items }
    Write-Host "  ✅ $($p.name): $($items.Count) hadist diunduh!" -ForegroundColor Green
}

$hadistJson = $allHadist | ConvertTo-Json -Depth 5 -Compress
$hadistJs = "const HADIST_DATA = $hadistJson;"
[System.IO.File]::WriteAllText("$baseDir\hadist_data.js", $hadistJs, [System.Text.Encoding]::UTF8)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ SEMUA DATA BERHASIL DIUNDUH!" -ForegroundColor Cyan
Write-Host "  📁 Lokasi: $baseDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
