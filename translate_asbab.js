const fs = require('fs');
const path = require('path');
const translate = require('@vitalets/google-translate-api').translate;

const asbabDir = path.join(__dirname, 'QuranHadist/data/asbab_nuzul');
const files = fs.readdirSync(asbabDir).filter(f => f.endsWith('.json'));

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log(`Found ${files.length} Asbab Al-Nuzul files to translate.`);
    
    for (const file of files) {
        const filePath = path.join(asbabDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Skip if already translated (we can check if it has occasions_id)
        if (data[0] && data[0].occasions_id) {
            console.log(`Skipping ${file} - already translated.`);
            continue;
        }
        
        console.log(`Translating ${file}...`);
        
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            entry.occasions_id = [];
            
            for (const text of entry.occasions) {
                try {
                    // Google translate has rate limits, be gentle
                    const res = await translate(text, { to: 'id' });
                    entry.occasions_id.push(res.text);
                    await delay(1500); // 1.5s delay to avoid ban
                } catch(e) {
                    console.log(`Error translating in ${file}: ${e.message}`);
                    entry.occasions_id.push(text); // Fallback to original
                    await delay(5000); // wait longer if error
                }
            }
        }
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Saved ${file}`);
    }
    
    console.log("Translation complete!");
}

main().catch(console.error);
