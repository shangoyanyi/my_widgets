function initJsonFormatter() {
    const jsonInput = document.getElementById('json-input');
    const formatBtn = document.getElementById('format-json-btn');
    const jsonStatus = document.getElementById('json-status');
    const jsonOutput = document.getElementById('json-output');
    const apiSelect = document.getElementById('json-api-select');

    apiSelect.addEventListener('change', async (event) => {
        const url = event.target.value;
        if (!url) {
            return;
        }

        jsonInput.value = '正在從 API 載入資料...';
        jsonStatus.textContent = '';
        jsonOutput.textContent = '';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            jsonInput.value = JSON.stringify(data, null, 4);
            jsonStatus.textContent = `已成功從 ${url} 載入資料。`;
            jsonStatus.style.color = '#86efac'; // green-300
            // 自動觸發格式化
            formatBtn.click();
        } catch (error) {
            jsonInput.value = '';
            jsonStatus.textContent = `無法載入資料：${error.message}`;
            jsonStatus.style.color = '#fca5a5'; // red-300
        }
    });

    formatBtn.addEventListener('click', () => {
        const inputText = jsonInput.value.trim();
        
        if (!inputText) {
            jsonStatus.textContent = '請輸入 JSON 內容。';
            jsonStatus.style.color = '#fca5a5'; // red-300
            jsonOutput.textContent = '';
            return;
        }

        try {
            const parsedJson = JSON.parse(inputText);
            const formattedJson = JSON.stringify(parsedJson, null, 4);
            
            jsonOutput.textContent = formattedJson;
            jsonStatus.textContent = 'JSON 格式正確且已成功格式化！';
            jsonStatus.style.color = '#86efac'; // green-300

        } catch (error) {
            jsonOutput.textContent = '';
            jsonStatus.textContent = `JSON 格式錯誤：${error.message}`;
            jsonStatus.style.color = '#fca5a5'; // red-300
        }
    });
}
