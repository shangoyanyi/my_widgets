function initQrCodeGenerator() {
    const qrInput = document.getElementById('qr-input');
    const qrCodeDisplay = document.getElementById('qr-code-display');
    const downloadBtn = document.getElementById('qr-download-btn');
    const status = document.getElementById('qr-status');

    let canvasElement;

    const generateQrCode = () => {
        const text = qrInput.value.trim();
        qrCodeDisplay.innerHTML = ''; // Clear previous QR code or placeholder text
        
        if (!text) {
            downloadBtn.disabled = true;
            status.textContent = '請輸入內容以生成 QR Code。';
            return;
        }

        // Create a canvas element for the QR code
        canvasElement = document.createElement('canvas');
        qrCodeDisplay.appendChild(canvasElement);

        QRCode.toCanvas(canvasElement, text, { width: 240, margin: 1 }, (error) => {
            if (error) {
                console.error(error);
                status.textContent = '生成 QR Code 時發生錯誤。';
                status.style.color = '#fca5a5'; // red-300
                downloadBtn.disabled = true;
            } else {
                status.textContent = 'QR Code 已成功生成！';
                status.style.color = '#86efac'; // green-300
                downloadBtn.disabled = false;
            }
        });
    };

    // Use 'input' for real-time generation
    qrInput.addEventListener('input', generateQrCode);

    downloadBtn.addEventListener('click', () => {
        if (canvasElement) {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvasElement.toDataURL('image/png');
            link.click();
        }
    });

    // Initial state
    status.textContent = '請輸入內容以生成 QR Code。';
}
