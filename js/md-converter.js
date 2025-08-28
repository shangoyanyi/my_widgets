function initMdConverter() {
    const mdInput = document.getElementById('md-input');
    const mdOutput = document.getElementById('md-output');
    let isSyncing = false;

    const syncScroll = (source, target) => {
        if (isSyncing) return;
        isSyncing = true;

        const { scrollTop, scrollHeight, clientHeight } = source;
        const scrollableHeight = scrollHeight - clientHeight;

        if (scrollTop === 0) {
            target.scrollTop = 0;
        } else if (scrollTop >= scrollableHeight - 1) {
            target.scrollTop = target.scrollHeight - target.clientHeight;
        } else {
            const scrollPercentage = scrollTop / scrollableHeight;
            target.scrollTop = scrollPercentage * (target.scrollHeight - target.clientHeight);
        }

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

    // Initial render
    if (mdInput.value) {
        const rawHTML = marked.parse(mdInput.value);
        const sanitizedHTML = DOMPurify.sanitize(rawHTML);
        mdOutput.innerHTML = sanitizedHTML;
    }
}
