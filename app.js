document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startBtn = document.getElementById('startBtn');
    const speedValue = document.getElementById('speedValue');
    const gaugeProgress = document.getElementById('gaugeProgress');
    const gaugeLabel = document.getElementById('gaugeLabel');
    const downloadFinal = document.getElementById('downloadFinal');
    const uploadFinal = document.getElementById('uploadFinal');
    const downloadCard = document.getElementById('downloadCard');
    const uploadCard = document.getElementById('uploadCard');

    // Gauge Setup
    const radius = gaugeProgress.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    gaugeProgress.style.strokeDasharray = `${circumference} ${circumference}`;
    gaugeProgress.style.strokeDashoffset = circumference;

    const setGaugePercent = (percent) => {
        // Clamp to 100
        const p = Math.min(Math.max(percent, 0), 100);
        const offset = circumference - (p / 100) * circumference;
        gaugeProgress.style.strokeDashoffset = offset;
    };

    // Configuration
    // 64 Megabytes = 512 Megabits
    const PAYLOAD_SIZE = 64 * 1024 * 1024; 
    const MS_TO_S = 1000;

    let isRunning = false;

    startBtn.addEventListener('click', async () => {
        if (isRunning) return;
        isRunning = true;
        startBtn.classList.add('disabled');
        startBtn.querySelector('span').innerText = 'Testing...';

        // Reset UI
        downloadFinal.innerText = '--';
        uploadFinal.innerText = '--';
        downloadCard.classList.remove('active');
        uploadCard.classList.remove('active');
        setGaugePercent(0);

        try {
            // Phase 1: Download
            await runTestPhase('download');
            
            // Short pause
            await new Promise(r => setTimeout(r, 500));
            
            // Phase 2: Upload
            await runTestPhase('upload');

            gaugeLabel.innerText = 'Completed';
            speedValue.innerText = '0';
            setGaugePercent(0);
        } catch (error) {
            console.error(error);
            gaugeLabel.innerText = 'Error';
            speedValue.innerText = 'ERR';
        } finally {
            startBtn.classList.remove('disabled');
            startBtn.querySelector('span').innerText = 'Start Test';
            isRunning = false;
        }
    });

    const runTestPhase = (type) => {
        return new Promise((resolve, reject) => {
            const isDownload = type === 'download';
            gaugeLabel.innerText = isDownload ? 'Downloading' : 'Uploading';
            gaugeLabel.classList.add('pulsing');
            
            // Update Card Activity
            if (isDownload) {
                downloadCard.classList.add('active');
                gaugeProgress.style.stroke = 'var(--accent)';
                gaugeProgress.style.filter = 'drop-shadow(0 0 10px rgba(0, 245, 212, 0.6))';
            } else {
                downloadCard.classList.remove('active');
                uploadCard.classList.add('active');
                gaugeProgress.style.stroke = 'var(--primary)';
                gaugeProgress.style.filter = 'drop-shadow(0 0 10px rgba(157, 78, 221, 0.6))';
            }

            const xhr = new XMLHttpRequest();
            const url = isDownload ? `https://speed.cloudflare.com/__down?bytes=${PAYLOAD_SIZE}&t=${Date.now()}` : `https://speed.cloudflare.com/__up`;
            
            xhr.open(isDownload ? 'GET' : 'POST', url, true);
            
            let startTime = performance.now();
            let lastUpdate = startTime;
            let finalMbps = 0;

            const updateSpeedUi = (loadedBytes) => {
                const now = performance.now();
                const elapsedS = (now - startTime) / MS_TO_S;
                
                if (elapsedS > 0) {
                    // Current overall speed
                    const loadedBits = loadedBytes * 8;
                    const mbps = (loadedBits / 1000000) / elapsedS;
                    
                    // Throttle UI updates slightly
                    if (now - lastUpdate > 100) {
                        finalMbps = mbps;
                        const displaySpeed = mbps.toFixed(1);
                        speedValue.innerText = displaySpeed;

                        // Calculate gauge progress (assuming 1000Mbps as absolute max for standard visuals, scale as needed)
                        // Using a logarithmic-ish or just simple scaling. 
                        let gaugeVal = (mbps / 1000) * 100;
                        if (mbps < 100) gaugeVal = (mbps / 100) * 50; // give more room to lower speeds
                        setGaugePercent(gaugeVal);
                        lastUpdate = now;
                    }
                }
            };

            if (isDownload) {
                xhr.onprogress = (event) => {
                    updateSpeedUi(event.loaded);
                };
            } else {
                xhr.upload.onprogress = (event) => {
                    // With upload, progress events can be bursty, track carefully
                    updateSpeedUi(event.loaded);
                };
            }

            xhr.onload = () => {
                gaugeLabel.classList.remove('pulsing');
                if (xhr.status >= 200 && xhr.status < 300) {
                    const finalDisplay = finalMbps.toFixed(2);
                    if (isDownload) {
                        downloadFinal.innerText = finalDisplay;
                    } else {
                        uploadFinal.innerText = finalDisplay;
                    }
                    resolve();
                } else {
                    reject(new Error(`Test failed with status ${xhr.status}`));
                }
            };

            xhr.onerror = () => {
                gaugeLabel.classList.remove('pulsing');
                reject(new Error('Network error'));
            };

            if (isDownload) {
                xhr.send();
            } else {
                // Generate exactly 64MB payload
                // Use text/plain to ensure it is a "simple request" and bypasses CORS preflight
                const blob = new Blob([new ArrayBuffer(PAYLOAD_SIZE)], { type: 'text/plain' });
                xhr.send(blob);
            }
        });
    };
});
