const fs = require('fs');
const path = require('path');

const files = [
    'c:/cmsystem/my-react-app/src/pages/ArchbishopDashboard.tsx',
    'c:/cmsystem/my-react-app/src/pages/BishopDashboard.tsx',
    'c:/cmsystem/my-react-app/src/pages/ArchdeaconDashboard.tsx',
    'c:/cmsystem/my-react-app/src/pages/PriestDashboard.tsx',
    'c:/cmsystem/my-react-app/src/pages/CellLeaderDashboard.tsx'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add 'certificates' to useState activeTab
    content = content.replace(/(useState<.*?)(>\(')/, "$1 | 'certificates'$2");

    // 2. Add Certificates import if we use CertificatesPage?
    // Actually, we can just render the CertificatesPage component!
    // But we need to import it.
    if (!content.includes('import CertificatesPage')) {
        content = content.replace("import React", "import CertificatesPage from './CertificatesPage';\nimport React");
    }

    // 3. Add the button
    // Find the end of the tabs container
    const tabContainerEndRegex = /<\/div>\s*\{\/\* TAB CONTENT/i;
    // Some files might not have {/* TAB CONTENT
    // Let's just find `</div>\n\n      {activeTab ===` and insert before `</div>`
    
    // We will look for `className="tab-container"` block
    const tabRegex = /(<div className="tab-container">[\s\S]*?)(<\/div>\s*\{activeTab)/;
    
    const newButton = `
        <button 
          onClick={() => setActiveTab('certificates')}
          className={\`tab-btn \${activeTab === 'certificates' ? 'active' : ''}\`}
        >
          Certificates
        </button>
      `;

    content = content.replace(tabRegex, (match, p1, p2) => {
        return p1 + newButton + p2;
    });
    
    // If it didn't match the regex above (some files have comments between div and {activeTab)
    if (!content.includes("setActiveTab('certificates')")) {
        const fallbackRegex = /(<div className="tab-container">[\s\S]*?)(<\/div>\s*(?:\{\/\*[\s\S]*?\*\/}\s*)?\{activeTab)/;
        content = content.replace(fallbackRegex, (match, p1, p2) => {
            return p1 + newButton + p2;
        });
    }

    // 4. Add the content block
    // We will insert it right before the Preview Modal or at the end
    const contentBlock = `
      {activeTab === 'certificates' && (
        <div style={{ marginTop: '1rem' }}>
          <CertificatesPage />
        </div>
      )}
`;

    if (content.includes("ATTACHMENT PREVIEW MODAL")) {
        content = content.replace(/\{\/\* (?:DETAILED )?ATTACHMENT PREVIEW MODAL \*\/\}/, (match) => {
            return contentBlock + '\n      ' + match;
        });
    } else {
        // CellLeaderDashboard doesn't have the modal
        content = content.replace(/(\s*)<\/>/, (match, p1) => {
            return p1 + contentBlock + p1 + '</>';
        });
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Processed:', file);
}
