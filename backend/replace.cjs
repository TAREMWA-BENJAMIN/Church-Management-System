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

            if (content.includes('import AppLayout from \'@/Layouts/AppLayout\';')) {
                content = content.replace(/import AppLayout from '@\/Layouts\/AppLayout';/g, "import SneatLayout from '@/Layouts/SneatLayout';");
                modified = true;
            }

            if (content.includes('<AppLayout')) {
                // Remove header prop completely: <AppLayout header={...}> -> <SneatLayout>
                content = content.replace(/<AppLayout[^>]*>/g, "<SneatLayout>");
                modified = true;
            }

            if (content.includes('</AppLayout>')) {
                content = content.replace(/<\/AppLayout>/g, "</SneatLayout>");
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    });
}

walkDir(dir);
console.log('Done');
