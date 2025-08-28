function initJsonFormatter() {
    const jsonInput = document.getElementById('json-input');
    const formatBtn = document.getElementById('format-json-btn');
    const jsonStatus = document.getElementById('json-status');
    const jsonOutput = document.getElementById('json-output');

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
