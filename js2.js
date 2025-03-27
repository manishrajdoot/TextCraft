copyButton.addEventListener('click', async () => {
    const textToCopy = preview.textContent;
    const fancyText = toUnicodeStyle(textToCopy, selectedUnicodeStyle);

    try {
        if (!navigator.clipboard) throw new Error('Clipboard API not supported');
        await navigator.clipboard.writeText(fancyText);
        alert(`Fancy text copied in ${selectedUnicodeStyle} style! Paste anywhere to see it.`);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy text. Please try manually selecting and copying.');
    }
});