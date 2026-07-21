const fs = require('fs');

const html = fs.readFileSync('HAPCOM_Premium.html', 'utf8');

const targetContent = `<select id="selectReciter" onchange="changeReciter()">
                            <optgroup label="Offline Murottal (Lokal)">
                                <option value="offline_mishary">Mishary Rashid Alafasy</option>
                                <option value="offline_abdulbaset">Abdul Baset (Mujawwad)</option>
                                <option value="offline_sudais">Abdurrahman as-Sudais</option>
                                <option value="offline_shuraim">Saud ash-Shuraim</option>
                                <option value="offline_husary">Mahmoud Khalil Al-Husary</option>
                            </optgroup>
                            <optgroup label="Online API (Cloud)">
                                <option value="ar.alafasy">Mishary Rashid (Online)</option>
                                <option value="ar.hudhaify">Ali Al-Hudhaify</option>
                                <option value="ar.abdullahbasfar">Abdullah Basfar</option>
                            </optgroup>
                        </select>`;

const replacementContent = `<select id="selectReciter" onchange="changeReciter()">
                            <optgroup label="Pilih Qari Murottal (Audio Engine)">
                                <option value="offline_mishary">Mishary Rashid Alafasy</option>
                                <option value="offline_abdulbaset">Abdul Baset (Mujawwad)</option>
                                <option value="offline_sudais">Abdurrahman as-Sudais</option>
                                <option value="offline_shuraim">Saud ash-Shuraim</option>
                                <option value="offline_husary">Mahmoud Khalil Al-Husary</option>
                                <option value="ar.hudhaify">Ali Al-Hudhaify</option>
                                <option value="ar.abdullahbasfar">Abdullah Basfar</option>
                            </optgroup>
                        </select>`;

// Replace carefully using string methods
const p1 = html.indexOf('<select id="selectReciter" onchange="changeReciter()">');
if (p1 !== -1) {
    const end = html.indexOf('</select>', p1) + 9;
    const oldChunk = html.substring(p1, end);
    const newHtml = html.replace(oldChunk, replacementContent);
    fs.writeFileSync('HAPCOM_Premium.html', newHtml);
    console.log('UI Dropdown berhasil disederhanakan!');
} else {
    console.log('Error: <select> not found!');
}
