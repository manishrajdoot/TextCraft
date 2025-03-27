function createRain() {
    try {
        const rain = document.querySelector('.rain');
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            rain.appendChild(drop);
        }
    } catch (err) {
        console.error('Rain effect failed:', err);
    }
}

function createFloatingElements() {
    try {
        const floatingElements = document.querySelector('.floating-elements');
        const items = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        items.forEach(item => {
            const fontItem = document.createElement('div');
            fontItem.className = 'floating-item draggable';
            fontItem.textContent = item;
            fontItem.draggable = true;
            fontItem.style.fontSize = '24px';
            fontItem.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            fontItem.style.left = `${Math.random() * 80 + 10}%`;
            fontItem.style.top = `${Math.random() * 80 + 10}%`;
            fontItem.style.animation = `randomFloat ${Math.random() * 2 + 1}s infinite ease-in-out`;
            fontItem.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)] || 'Arial';
            floatingElements.appendChild(fontItem);

            if (item === 'A') {
                const fontLink = document.createElement('link');
                fontLink.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontItem.style.fontFamily)}`;
                fontLink.rel = 'stylesheet';
                document.head.appendChild(fontLink);
            }

            fontItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', item);
                fontItem.style.opacity = '0.5';
            });

            fontItem.addEventListener('dragend', () => {
                fontItem.style.opacity = '1';
            });

            // Make draggable with mouse
            fontItem.addEventListener('mousedown', (e) => {
                fontItem.classList.add('draggable');
                let shiftX = e.clientX - fontItem.getBoundingClientRect().left;
                let shiftY = e.clientY - fontItem.getBoundingClientRect().top;

                function moveAt(pageX, pageY) {
                    fontItem.style.left = pageX - shiftX + 'px';
                    fontItem.style.top = pageY - shiftY + 'px';
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                document.addEventListener('mousemove', onMouseMove);

                document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    fontItem.classList.remove('draggable');
                }, { once: true });
            });

            fontItem.ondragstart = () => false;
        });

        const inputText = document.getElementById('inputText');
        inputText.addEventListener('dragover', (e) => e.preventDefault());
        inputText.addEventListener('drop', (e) => {
            e.preventDefault();
            const droppedText = e.dataTransfer.getData('text');
            inputText.value += droppedText;
            updatePreview();
        });

        setInterval(() => {
            const floaters = document.querySelectorAll('.floating-item');
            floaters.forEach(floater => {
                floater.style.left = `${Math.random() * 80 + 10}%`;
                floater.style.top = `${Math.random() * 80 + 10}%`;
                floater.style.animation = `randomFloat ${Math.random() * 2 + 1}s infinite ease-in-out`;
            });
        }, 3000);
    } catch (err) {
        console.error('Floating elements failed:', err);
    }
}

// Initialize Effects
createRain();
setTimeout(createFloatingElements, 1000);