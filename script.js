document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const fontList = document.getElementById('fontList');
    const seeAllFontsButton = document.getElementById('seeAllFonts');
    const colorPicker = document.getElementById('colorPicker');
    const preview = document.getElementById('preview');
    const copyButton = document.getElementById('copyButton');
    const formatSelector = document.getElementById('formatSelector');
    const downloadButton = document.getElementById('downloadButton');
    const rain = document.querySelector('.rain');
    const floatingElements = document.querySelector('.floating-elements');

    let fonts = [];
    let activeFont = '';
    const visibleItems = 20;
    let showingAllFonts = false;

    // Load Google Fonts with lazy loading
    function loadGoogleFonts() {
        const apiKey = window.GOOGLE_FONTS_API_KEY;
        const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    fonts = data.items.map(item => item.family);
                    renderFontList(0);
                    activeFont = fonts[0];
                    updatePreview();
                    updateActiveFontItem();

                    const initialFontLink = document.createElement('link');
                    initialFontLink.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(activeFont)}`;
                    initialFontLink.rel = 'stylesheet';
                    document.head.appendChild(initialFontLink);
                }
            })
            .catch(err => {
                console.error('Error loading fonts:', err);
                fontList.innerHTML = '<div class="font-item" data-font="Arial">Arial (Fallback)</div>';
                activeFont = 'Arial';
                updatePreview();
                updateActiveFontItem();
            });
    }

    // Render font list (virtual scrolling or all)
    function renderFontList(startIndex) {
        fontList.innerHTML = '';
        if (showingAllFonts) {
            fonts.forEach(font => {
                const div = document.createElement('div');
                div.className = 'font-item';
                div.textContent = font;
                div.dataset.font = font;
                div.style.fontFamily = font;
                fontList.appendChild(div);
            });
        } else {
            const endIndex = Math.min(startIndex + visibleItems, fonts.length);
            for (let i = startIndex; i < endIndex; i++) {
                const font = fonts[i];
                const div = document.createElement('div');
                div.className = 'font-item';
                div.textContent = font;
                div.dataset.font = font;
                div.style.fontFamily = font;
                fontList.appendChild(div);
            }
        }
        updateActiveFontItem();
    }

    // Real-time preview update
    function updatePreview() {
        const text = inputText.value || 'Yahan aapka text dikhega';
        const color = colorPicker.value;
        preview.style.fontFamily = activeFont;
        preview.style.color = color;
        preview.textContent = text;
    }

    // Highlight active font item
    function updateActiveFontItem() {
        const items = fontList.querySelectorAll('.font-item');
        items.forEach(item => {
            item.classList.toggle('active', item.dataset.font === activeFont);
        });
    }

    // Scroll event with virtual scrolling
    fontList.addEventListener('scroll', () => {
        if (!showingAllFonts) {
            const scrollTop = fontList.scrollTop;
            const itemHeight = fontList.querySelector('.font-item').offsetHeight;
            const middleIndex = Math.floor((scrollTop + fontList.clientHeight / 2) / itemHeight);
            const startIndex = Math.max(0, middleIndex - Math.floor(visibleItems / 2));

            renderFontList(startIndex);

            const newIndex = startIndex + Math.floor(visibleItems / 2);
            if (newIndex >= 0 && newIndex < fonts.length) {
                const newFont = fonts[newIndex];
                if (newFont !== activeFont) {
                    activeFont = newFont;
                    const fontLink = document.createElement('link');
                    fontLink.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(activeFont)}`;
                    fontLink.rel = 'stylesheet';
                    document.head.appendChild(fontLink);
                    updatePreview();
                }
            }
        }
    });

    // Click event to select font
    fontList.addEventListener('click', (e) => {
        const target = e.target.closest('.font-item');
        if (target) {
            activeFont = target.dataset.font;
            const fontLink = document.createElement('link');
            fontLink.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(activeFont)}`;
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
            updatePreview();
            updateActiveFontItem();
        }
    });

    // See All Fonts button
    seeAllFontsButton.addEventListener('click', () => {
        showingAllFonts = !showingAllFonts;
        seeAllFontsButton.textContent = showingAllFonts ? 'Show Less' : 'See All Fonts';
        renderFontList(0);
    });

    // Event listeners
    inputText.addEventListener('input', updatePreview);
    colorPicker.addEventListener('input', updatePreview);

    copyButton.addEventListener('click', () => {
        const textToCopy = preview.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Text copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
    });

    function getDeviceScaleFactor() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const screenWidth = window.screen.width * devicePixelRatio;
        const screenHeight = window.screen.height * devicePixelRatio;

        if (screenWidth >= 2560 && screenHeight >= 1440) return 4;
        else if (screenWidth >= 1920 && screenHeight >= 1080) return 3;
        else if (screenWidth >= 1280 && screenHeight >= 720) return 2;
        else return 1;
    }

    downloadButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const format = formatSelector.value;
        const scaleFactor = getDeviceScaleFactor();

        canvas.width = 400 * scaleFactor;
        canvas.height = 100 * scaleFactor;
        ctx.scale(scaleFactor, scaleFactor);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (format === 'png' || format === 'ico') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
        }

        ctx.font = `24px "${activeFont}"`;
        ctx.fillStyle = colorPicker.value;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(preview.textContent, (canvas.width / scaleFactor) / 2, (canvas.height / scaleFactor) / 2);

        const link = document.createElement('a');
        let mimeType;
        let extension;

        switch (format) {
            case 'png': mimeType = 'image/png'; extension = 'png'; break;
            case 'jpeg':
            case 'jpg': mimeType = 'image/jpeg'; extension = 'jpg'; break;
            case 'bmp': mimeType = 'image/bmp'; extension = 'bmp'; break;
            case 'ico': mimeType = 'image/x-icon'; extension = 'ico'; break;
            default: mimeType = 'image/png'; extension = 'png';
        }

        link.download = `textcraft.${extension}`;
        link.href = canvas.toDataURL(mimeType, 1.0);
        link.click();
    });

    // Rain effect with increased drops (100)
    function createRain() {
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            rain.appendChild(drop);
        }
    }
    createRain();

    // Floating A-Z with random floating
    function createFloatingElements() {
        const items = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // Only A-Z (26 items)

        // Cursor color toggle removed since it's only for textarea now

        // A-Z with random floating and drag
        items.forEach(item => {
            const fontItem = document.createElement('div');
            fontItem.className = 'floating-item draggable';
            fontItem.textContent = item;
            fontItem.draggable = true;
            fontItem.style.fontSize = '24px';
            fontItem.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color
            fontItem.style.left = `${Math.random() * 80 + 10}%`;
            fontItem.style.top = `${Math.random() * 80 + 10}%`;
            fontItem.style.animation = `randomFloat ${Math.random() * 2 + 1}s infinite ease-in-out`; // Faster float (1-3s)
            fontItem.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)] || 'Arial';
            floatingElements.appendChild(fontItem);

            // Preload only active font, not all
            if (item === 'A') { // Preload only one for initial load
                const fontLink = document.createElement('link');
                fontLink.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontItem.style.fontFamily)}`;
                fontLink.rel = 'stylesheet';
                document.head.appendChild(fontLink);
            }

            // Drag events
            fontItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', item);
                fontItem.style.opacity = '0.5';
            });

            fontItem.addEventListener('dragend', () => {
                fontItem.style.opacity = '1';
            });
        });

        // Drop event for textarea
        inputText.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        inputText.addEventListener('drop', (e) => {
            e.preventDefault();
            const droppedText = e.dataTransfer.getData('text');
            inputText.value += droppedText;
            updatePreview();
        });

        // Randomize positions periodically
        setInterval(() => {
            const floaters = document.querySelectorAll('.floating-item');
            floaters.forEach(floater => {
                floater.style.left = `${Math.random() * 80 + 10}%`;
                floater.style.top = `${Math.random() * 80 + 10}%`;
                floater.style.animation = `randomFloat ${Math.random() * 2 + 1}s infinite ease-in-out`; // Faster float (1-3s)
            });
        }, 3000); // Update every 3 seconds
    }

    // Load fonts and initial setup
    loadGoogleFonts();

    // Add floating elements after fonts are loaded
    setTimeout(createFloatingElements, 1000);
});

// Add styles dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .rain-drop {
        position: absolute;
        width: 2px;
        height: 20px;
        background: rgba(255, 255, 255, 0.7);
        animation: fall linear infinite;
    }
    .floating-item {
        position: absolute;
        z-index: -1;
        user-select: none;
    }
    .draggable {
        cursor: grab;
    }
    .draggable:active {
        cursor: grabbing;
    }
`;
document.head.appendChild(styleSheet);