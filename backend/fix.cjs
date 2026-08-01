const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'resources/js/Pages');

function walkDir(currentDir) {
    fs.readdirSync(currentDir).forEach(file => {
        let fullPath = path.join(currentDir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Fix the corrupted tags from previous replace
            if (content.match(/<SneatLayout>.*?<\/h2>}>/s)) {
                content = content.replace(/<SneatLayout>.*?<\/h2>}>/s, "<SneatLayout>");
                modified = true;
            }
            
            // Fix multiline broken tags like <AppLayout header={ \n ... \n }>
            if (content.includes('<AppLayout header={')) {
                 let start = content.indexOf('<AppLayout header={');
                 let end = content.indexOf('}>', start);
                 if (end !== -1) {
                     content = content.substring(0, start) + '<SneatLayout>' + content.substring(end + 2);
                     modified = true;
                 }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed: ' + fullPath);
            }
        }
    });
}

walkDir(dir);
console.log('Done fixing');
