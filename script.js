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

        const data = weatherData[city];

        if (data) {
            weatherInfo.innerHTML = `
                <div class="weather-card p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
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