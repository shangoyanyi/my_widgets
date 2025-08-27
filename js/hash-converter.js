function initHashConverter() {
    const plaintextInput = document.getElementById('plaintext-input');
    const hashInput = document.getElementById('hash-input');
    const hashAlgorithmSelect = document.getElementById('hash-algorithm');
    const toHashBtn = document.getElementById('to-hash-btn');
    const hashStatus = document.getElementById('hash-status');

    const calculateHash = async (text, algorithm) => {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(text);
        let hashBuffer;

        if (algorithm === 'MD5') {
            hashStatus.textContent = 'MD5 is not recommended for security and not directly supported by Web Crypto API. Using a placeholder.';
            return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
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
}
