const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const releaseDir = path.join(projectRoot, 'release');
const zipFile = path.join(projectRoot, 'release.zip');

function cleanDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Cleaning existing directory: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source path does not exist, skipping copy: ${src}`);
    return;
  }
  console.log(`Copying ${src} to ${dest}...`);
  fs.cpSync(src, dest, { recursive: true, force: true });
}

async function main() {
  try {
    // 1. Run production build
    console.log('=== Step 1: Running Next.js Production Build ===');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });

    // 2. Prepare release directory
    console.log('\n=== Step 2: Preparing Release Directory ===');
    cleanDir(releaseDir);

    // 3. Verify standalone folder exists
    const standaloneDir = path.join(projectRoot, '.next', 'standalone');
    if (!fs.existsSync(standaloneDir)) {
      throw new Error('Standalone output directory was not found. Please ensure "output: \'standalone\'" is set in next.config.mjs');
    }

    // 4. Copy standalone server build files
    console.log('\n=== Step 3: Copying Standalone Build Files ===');
    // Copy everything from .next/standalone to release
    copyRecursive(standaloneDir, releaseDir);

    // 5. Copy public folder and .next/static folder
    console.log('\n=== Step 4: Copying Public and Static Assets ===');
    const publicSrc = path.join(projectRoot, 'public');
    const publicDest = path.join(releaseDir, 'public');
    copyRecursive(publicSrc, publicDest);

    const staticSrc = path.join(projectRoot, '.next', 'static');
    const staticDest = path.join(releaseDir, '.next', 'static');
    copyRecursive(staticSrc, staticDest);

    // 6. Write PM2 ecosystem.config.js inside release folder
    console.log('\n=== Step 5: Generating PM2 ecosystem.config.js ===');
    const ecosystemContent = `module.exports = {
  apps: [
    {
      name: "singlevendor-website",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        PORT: 3000,
        NODE_ENV: "production"
      }
    }
  ]
};
`;
    fs.writeFileSync(path.join(releaseDir, 'ecosystem.config.js'), ecosystemContent, 'utf8');
    console.log('Generated ecosystem.config.js');

    // 7. Write README.md with deployment instructions
    console.log('\n=== Step 6: Generating README.md ===');
    const readmeContent = `# production release package

This is a production-optimized standalone build of your Next.js application.

## VPS Deployment Steps (using Cyberpanel & PM2)

1. **Upload & Extract:**
   - Upload \`release.zip\` to your Hostinger VPS using the Cyberpanel File Manager (e.g., inside \`/home/yourdomain.com/public_html/\`).
   - Right-click \`release.zip\` and select **Extract**. This will create a folder named \`release\`.

2. **Start the application with PM2:**
   - Connect to your VPS via SSH.
   - Navigate to the extracted folder:
     \`\`\`bash
     cd /home/yourdomain.com/public_html/release
     \`\`\`
   - Start the app using PM2:
     \`\`\`bash
     pm2 start ecosystem.config.js
     \`\`\`
     *Note: If PM2 is not installed, install it globally using \`npm install -g pm2\`.*

3. **Port & Reverse Proxy:**
   - The application will run on port **3000** by default (configured in \`ecosystem.config.js\`).
   - Set up a reverse proxy in Cyberpanel (under Websites > Manage > Reverse Proxy or using OpenLiteSpeed rewrite rules) to forward incoming traffic from port 80/443 to \`http://127.0.0.1:3000\`.

4. **Managing the app:**
   - View logs: \`pm2 logs singlevendor-website\`
   - Restart: \`pm2 restart singlevendor-website\`
   - Stop: \`pm2 stop singlevendor-website\`
`;
    fs.writeFileSync(path.join(releaseDir, 'README.md'), readmeContent, 'utf8');
    console.log('Generated README.md');

    // 8. Create ZIP archive
    console.log('\n=== Step 7: Compressing Release Folder ===');
    if (fs.existsSync(zipFile)) {
      fs.unlinkSync(zipFile);
    }
    
    console.log('Compressing release directory to release.zip...');
    execSync(`powershell -Command "Compress-Archive -Path '${releaseDir}' -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });
    console.log('\n=========================================');
    console.log('SUCCESS: Release package generated successfully!');
    console.log(`- Release Directory: ${releaseDir}`);
    console.log(`- Zip Archive: ${zipFile}`);
    console.log('=========================================');

  } catch (error) {
    console.error('\n❌ Error during release generation:', error.message);
    process.exit(1);
  }
}

main();
