document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
    const moreButton = document.getElementById('more-button');
    const widgetContainer = document.getElementById('widget-container');

    const widgetInitializers = {
        'weather-widget': () => initWeatherWidget(),
        'md-converter-widget': () => initMdConverter(),
        'hash-converter-widget': () => initHashConverter(),
        'json-formatter-widget': () => initJsonFormatter(),
        'base64-converter-widget': () => initBase64Converter(),
        'qr-code-generator-widget': () => initQrCodeGenerator()
    };

    const loadWidget = async (targetId) => {
        const widgetName = targetId.replace('#', '');
        const fileName = widgetName.replace('-widget', '.html');

        try {
            const response = await fetch(`widgets/${fileName}`);
            if (!response.ok) {
                throw new Error(`Could not load ${fileName}. Status: ${response.status}`);
            }
            widgetContainer.innerHTML = await response.text();

            // Run the initializer for the loaded widget
            if (widgetInitializers[widgetName]) {
                widgetInitializers[widgetName]();
            }

        } catch (error) {
            console.error('Error loading widget:', error);
            widgetContainer.innerHTML = `<p class="text-white text-center">${error.message}</p>`;
        }
    };

    const setActiveLink = (targetId) => {
        const cleanTargetId = targetId.startsWith('#') ? targetId : `#${targetId}`;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === cleanTargetId);
        });
        bottomNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === cleanTargetId);
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
        const targetId = e.currentTarget.getAttribute('href'); // e.g., #weather-widget
        setActiveLink(targetId);
        loadWidget(targetId);
        closeSidebar();
    };

    // Attach event listeners
    navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
    bottomNavLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
    moreButton.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Initial setup
    const initialWidget = '#weather-widget';
    setActiveLink(initialWidget);
    loadWidget(initialWidget);
});
