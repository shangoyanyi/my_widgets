function initBase64Converter() {
    const inputArea = document.getElementById('b64-input');
    const outputArea = document.getElementById('b64-output');
    const encodeBtn = document.getElementById('b64-encode-btn');
    const decodeBtn = document.getElementById('b64-decode-btn');
    const statusArea = document.getElementById('b64-status');

    // Encode from input to output
    encodeBtn.addEventListener('click', () => {
        try {
            const rawString = inputArea.value;
            if (!rawString) {
                statusArea.textContent = '請在左側輸入原始文字。';
                statusArea.style.color = '#fca5a5'; // red-300
                return;
            }
            // Use btoa for Base64 encoding. Need to handle Unicode characters.
            const encodedString = btoa(unescape(encodeURIComponent(rawString)));
            outputArea.value = encodedString;
            statusArea.textContent = '編碼成功！';
            statusArea.style.color = '#86efac'; // green-300
        } catch (error) {
            statusArea.textContent = `編碼失敗：${error.message}`;
            statusArea.style.color = '#fca5a5'; // red-300
        }
    });

    // Decode from output to input
    decodeBtn.addEventListener('click', () => {
        try {
            const encodedString = outputArea.value;
            if (!encodedString) {
                statusArea.textContent = '請在右側輸入 Base64 字串。';
                statusArea.style.color = '#fca5a5'; // red-300
                return;
            }
            // Use atob for Base64 decoding. Need to handle Unicode characters.
            const decodedString = decodeURIComponent(escape(atob(encodedString)));
            inputArea.value = decodedString;
            statusArea.textContent = '解碼成功！';
            statusArea.style.color = '#86efac'; // green-300
        } catch (error) {
            statusArea.textContent = `解碼失敗：無效的 Base64 字串。`;
            statusArea.style.color = '#fca5a5'; // red-300
        }
    });
}
