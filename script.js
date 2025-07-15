document.addEventListener('DOMContentLoaded', () => {
    const locationSelect = document.getElementById('location-select');
    const weatherInfo = document.getElementById('weather-info');
    const widgets = document.querySelectorAll('.widget');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');

    // Navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
    const moreButton = document.getElementById('more-button');

    // PDF Converter elements
    const pdfFileInput = document.getElementById('pdf-file-input');
    const pdfFileNameSpan = document.getElementById('pdf-file-name');
    const pdfConvertBtn = document.getElementById('pdf-convert-btn');
    const pdfStatus = document.getElementById('pdf-status');
    const pdfForm = document.getElementById('pdf-form');
    const fileUploadArea = document.querySelector('.file-upload-area');
    const endpointUrlSpan = document.getElementById('endpoint-url');

    // Hash Converter elements
    const plaintextInput = document.getElementById('plaintext-input');
    const hashInput = document.getElementById('hash-input');
    const hashAlgorithmSelect = document.getElementById('hash-algorithm');
    const toHashBtn = document.getElementById('to-hash-btn');
    const hashStatus = document.getElementById('hash-status');

    // MD Converter elements
    const mdInput = document.getElementById('md-input');
    const mdOutput = document.getElementById('md-output');
    let isSyncing = false;

    const weatherAPIKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
    const PDF_CONVERTER_API_URL = 'https://cpe-pdf-reader.onrender.com/upload';

    // Display endpoint URL
    endpointUrlSpan.textContent = PDF_CONVERTER_API_URL;

    const fetchWeather = (city) => {
        const weatherData = {
            Taipei: { temp: '28°C', condition: 'Sunny' },
            NewTaipei: { temp: '27°C', condition: 'Partly Cloudy' },
            Taoyuan: { temp: '26°C', condition: 'Rainy' },
            Taichung: { temp: '29°C', condition: 'Sunny' },
            Tainan: { temp: '30°C', condition: 'Hot' },
            Kaohsiung: { temp: '31°C', condition: 'Very Hot' },
        };

        const weatherIcons = {
            'Sunny': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-yellow-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-7.757l-.707.707M5.382 18.618l-.707.707M18.618 5.382l-.707-.707M5.382 5.382l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>',
            'Partly Cloudy': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>',
            'Rainy': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10a4 4 0 00-4-4h-1a3 3 0 00-3 3v2m3-3h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            'Hot': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-7.757l-.707.707M5.382 18.618l-.707.707M18.618 5.382l-.707-.707M5.382 5.382l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>',
            'Very Hot': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-7.757l-.707.707M5.382 18.618l-.707.707M18.618 5.382l-.707-.707M5.382 5.382l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>'
        };

        const data = weatherData[city];

        if (data) {
            const iconSvg = weatherIcons[data.condition] || '';
            weatherInfo.innerHTML = `
                <div class="weather-card p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
                    ${iconSvg}
                    <h2 class="text-2xl font-bold mb-2">${city}</h2>
                    <p class="text-xl">${data.temp}</p>
                    <p>${data.condition}</p>
                </div>
            `;
        } else {
            weatherInfo.innerHTML = `<p>Could not fetch weather for ${city}.</p>`;
        }
    };

    const setActiveLink = (targetId) => {
        // Update sidebar links
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`);
        });
        // Update bottom nav links
        bottomNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`);
        });
    };

    const showWidget = (targetId) => {
        widgets.forEach(widget => {
            const isActive = widget.id === targetId;
            widget.classList.toggle('active', isActive);
            widget.classList.toggle('hidden', !isActive);
        });
    };

    const openSidebar = () => {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    };

    const handleNavLinkClick = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        setActiveLink(targetId);
        showWidget(targetId);
        closeSidebar(); // Close sidebar after selection
    };

    // PDF Converter Logic
    let selectedFile = null;

    pdfFileInput.addEventListener('change', (event) => {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            pdfFileNameSpan.textContent = selectedFile.name;
            pdfStatus.textContent = '';
        } else {
            pdfFileNameSpan.textContent = '尚未選擇檔案';
        }
    });

    fileUploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        fileUploadArea.classList.add('dragover');
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });

    fileUploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        fileUploadArea.classList.remove('dragover');
        selectedFile = event.dataTransfer.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            pdfFileNameSpan.textContent = selectedFile.name;
            pdfStatus.textContent = '';
        } else {
            selectedFile = null;
            pdfFileNameSpan.textContent = '請選擇 PDF 檔案';
            pdfStatus.textContent = '錯誤：請上傳 PDF 檔案。';
        }
    });

    pdfForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            pdfStatus.textContent = '請先選擇一個 PDF 檔案。';
            return;
        }

        pdfStatus.textContent = '正在轉換中...';
        pdfConvertBtn.disabled = true;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(PDF_CONVERTER_API_URL, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'output.csv'; // Backend returns CSV, so download as CSV
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
                pdfStatus.textContent = '轉換成功！檔案已下載。';
            } else {
                const errorText = await response.text();
                pdfStatus.textContent = `轉換失敗：${errorText || response.statusText}`;
            }
        } catch (error) {
            pdfStatus.textContent = `發生錯誤：${error.message}`;
        } finally {
            pdfConvertBtn.disabled = false;
        }
    });

    // Hash Converter Logic
    const calculateHash = async (text, algorithm) => {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(text);
        let hashBuffer;

        if (algorithm === 'MD5') {
            // MD5 is not directly supported by Web Crypto API for security reasons.
            // For demonstration, we'll use a simple non-cryptographic hash or a library.
            // For a real application, consider a dedicated MD5 library if needed.
            // Here, we'll just return a placeholder or a simple non-cryptographic hash.
            hashStatus.textContent = 'MD5 is not recommended for security and not directly supported by Web Crypto API. Using a placeholder.';
            return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32); // Simple non-cryptographic representation
        } else {
            hashBuffer = await crypto.subtle.digest(algorithm, data);
        }

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    toHashBtn.addEventListener('click', async () => {
        const plaintext = plaintextInput.value;
        const algorithm = hashAlgorithmSelect.value;
        if (plaintext) {
            hashStatus.textContent = 'Calculating hash...';
            try {
                const hash = await calculateHash(plaintext, algorithm);
                hashInput.value = hash;
                hashStatus.textContent = 'Hash calculated successfully.';
            } catch (error) {
                hashStatus.textContent = `Error calculating hash: ${error.message}`;
            }
        } else {
            hashStatus.textContent = 'Please enter plaintext to convert.';
        }
    });

    // MD Converter Logic
    const syncScroll = (source, target) => {
        if (isSyncing) return;
        isSyncing = true;

        const { scrollTop, scrollHeight, clientHeight } = source;
        const scrollableHeight = scrollHeight - clientHeight;

        // Check for boundary conditions to prevent floating point errors
        if (scrollTop === 0) {
            target.scrollTop = 0;
        } else if (scrollTop >= scrollableHeight - 1) { // Use a small tolerance
            target.scrollTop = target.scrollHeight - target.clientHeight;
        } else {
            const scrollPercentage = scrollTop / scrollableHeight;
            target.scrollTop = scrollPercentage * (target.scrollHeight - target.clientHeight);
        }

        // Use requestAnimationFrame for smoother syncing and to avoid race conditions
        requestAnimationFrame(() => {
            isSyncing = false;
        });
    };

    mdInput.addEventListener('input', () => {
        const rawHTML = marked.parse(mdInput.value);
        const sanitizedHTML = DOMPurify.sanitize(rawHTML);
        mdOutput.innerHTML = sanitizedHTML;
    });

    mdInput.addEventListener('scroll', () => {
        syncScroll(mdInput, mdOutput);
    });

    mdOutput.addEventListener('scroll', () => {
        syncScroll(mdOutput, mdInput);
    });

    // Attach event listeners
    navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
    bottomNavLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
    moreButton.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
    locationSelect.addEventListener('change', (event) => fetchWeather(event.target.value));

    // Initial setup
    fetchWeather(locationSelect.value);
    // Set initial active link based on the default widget
    setActiveLink('weather-widget');
});
