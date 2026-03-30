const { networkInterfaces } = require('os');
const { spawn } = require('child_process');

const nets = networkInterfaces();
const results = Object.create(null);

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal && !name.toLowerCase().includes('vEthernet') && !name.toLowerCase().includes('virtual')) {
            results[name] = results[name] || [];
            results[name].push(net.address);
        }
    }
}

// Fallback if the filter blocked all IPs
if (Object.keys(results).length === 0) {
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                results[name] = results[name] || [];
                results[name].push(net.address);
            }
        }
    }
}

const ips = Object.values(results).flat();

if (ips.length > 0) {
    console.log('\n======================================================');
    console.log('📱 EXPOSED TO LOCAL NETWORK FOR MOBILE TESTING!');
    console.log('======================================================');
    console.log('👉 Open your phone browser (Safari/Chrome) and enter:');
    console.log(`\n    http://${ips[0]}:3000\n`);
    console.log('⚠️ Make sure your phone and laptop are on the same Wi-Fi!');
    console.log('======================================================\n');
}

const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev', '--', '-H', '0.0.0.0'], { stdio: 'inherit', shell: true });
