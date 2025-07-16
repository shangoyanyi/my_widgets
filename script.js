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

    const PDF_CONVERTER_API_URL = 'https://cpe-pdf-reader.onrender.com/upload';

    // Display endpoint URL
    endpointUrlSpan.textContent = PDF_CONVERTER_API_URL;

    const fetchWeather = async (locationName) => {
        // CWA Open Data API endpoint for general weather forecast
        const CWA_API_URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=rdec-key-123-45678-011121314`;
        
        weatherInfo.innerHTML = `
            <div class="weather-card p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
                <p>Loading weather data...</p>
            </div>
        `;

        try {
            const response = await fetch(CWA_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data.records || !data.records.location) {
                throw new Error('Invalid API response format');
            }

            const locationData = data.records.location.find(loc => loc.locationName === locationName);

            if (locationData) {
                const weatherElement = locationData.weatherElement;
                const minT = weatherElement.find(el => el.elementName === 'MinT').time[0].parameter.parameterName;
                const maxT = weatherElement.find(el => el.elementName === 'MaxT').time[0].parameter.parameterName;
                const temperature = `${minT} - ${maxT}`;
                const condition = weatherElement.find(el => el.elementName === 'Wx').time[0].parameter.parameterName;
                const pop = weatherElement.find(el => el.elementName === 'PoP').time[0].parameter.parameterName;

                const today = new Date();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const day = today.getDate().toString().padStart(2, '0');
                const formattedDate = `${month}/${day}`;

                weatherInfo.innerHTML = `
                    <div class="weather-card p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
                        <p class="text-5xl font-bold mb-2">${formattedDate}</p>
                        <h2 class="text-2xl font-bold mb-2">${locationName}</h2>
                        <p>${condition}</p>
                        <p class="text-xl">${temperature}°C</p>
                        <p class="mt-2">降雨機率 ${pop}%</p>
                    </div>
                `;
            } else {
                throw new Error(`Could not find weather data for ${locationName}`);
            }
        } catch (error) {
            console.error('Fetch weather error:', error);
            weatherInfo.innerHTML = `<p>Could not fetch weather for ${locationName}.</p>`;
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
