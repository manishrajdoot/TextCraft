downloadButton.addEventListener('click', () => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const format = formatSelector.value;
        const text = preview.textContent || 'Yahan aapka text dikhega';

        // Font settings
        const fontSize = 300; // Larger font for 4K quality
        ctx.font = `${fontSize}px "${activeFont}"`;

        // 4K base resolution
        const baseWidth = 3840; // 4K width
        const padding = 200; // Padding on all sides
        const maxTextWidth = baseWidth - padding * 2; // Max width for text
        const lineHeight = fontSize * 1.2; // Line spacing (1.2x font size)

        // Split text into lines for wrapping
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth <= maxTextWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine); // Add the last line

        // Determine alignment and height
        let textAlign = 'center';
        let startY = padding;
        let requiredHeight;

        if (lines.length === 1) {
            // Center short text vertically and horizontally
            requiredHeight = fontSize * 1.5 + padding * 2; // Minimal height for single line
            startY = requiredHeight / 2 - fontSize / 2; // Center vertically
        } else {
            // Left-align long text (A4 style)
            textAlign = 'left';
            const textHeight = lines.length * lineHeight;
            requiredHeight = textHeight + padding * 2; // Height based on text
        }

        const qualityMultiplier = Math.min(Math.max(window.devicePixelRatio || 2, 2), 3); // 2x or 3x scaling
        canvas.width = baseWidth * qualityMultiplier;
        canvas.height = requiredHeight * qualityMultiplier;

        console.log(`Canvas size: ${canvas.width}x${canvas.height} pixels (Lines: ${lines.length})`);

        // Scale the context
        ctx.scale(qualityMultiplier, qualityMultiplier);

        // Maximize rendering quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background
        if (format === 'png' || format === 'ico') {
            ctx.clearRect(0, 0, baseWidth, requiredHeight);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, baseWidth, requiredHeight);
        }

        // Text rendering
        ctx.font = `${fontSize}px "${activeFont}"`; // Reapply font after scaling
        ctx.fillStyle = colorPicker.value;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'top';

        // Draw each line
        if (lines.length === 1) {
            // Center short text
            ctx.fillText(lines[0], baseWidth / 2, startY);
        } else {
            // Left-align long text
            lines.forEach((line, index) => {
                ctx.fillText(line, padding, startY + index * lineHeight);
            });
        }

        // Download logic
        if (format === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: requiredHeight > baseWidth ? 'portrait' : 'landscape',
                unit: 'px',
                format: [baseWidth, requiredHeight]
            });

            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, baseWidth, requiredHeight);
            pdf.save('textcraft.pdf');
        } else {
            // Generate data URL for other formats
            const mimeTypeMap = {
                'png': 'image/png',
                'jpeg': 'image/jpeg',
                'jpg': 'image/jpeg',
                'bmp': 'image/bmp',
                'ico': 'image/x-icon'
            };
            const mimeType = mimeTypeMap[format] || 'image/png';
            const extension = format === 'jpeg' ? 'jpg' : format;
            const quality = (format === 'jpg' || format === 'jpeg') ? 1.0 : undefined;

            const dataUrl = canvas.toDataURL(mimeType, quality);
            console.log(`Data URL length: ${dataUrl.length} characters`);

            if (dataUrl.length <= 22) {
                throw new Error('Canvas data is empty. Resolution might be too high for your device.');
            }

            // Estimate file size (for debugging)
            const fileSizeMB = (dataUrl.length * 0.75) / (1024 * 1024);
            console.log(`Estimated file size: ${fileSizeMB.toFixed(2)} MB`);

            // Download directly
            const link = document.createElement('a');
            link.download = `textcraft.${extension}`;
            link.href = dataUrl;
            link.click();
        }
    } catch (err) {
        console.error('Download error:', err);

        // Fallback to smaller size
        try {
            console.log('Attempting fallback with smaller resolution...');
            const fallbackWidth = 1920; // Full HD width
            const fallbackFontSize = 150;
            const fallbackLineHeight = fallbackFontSize * 1.2;
            const fallbackMaxTextWidth = fallbackWidth - padding * 2;

            // Recompute lines for fallback
            let fallbackLines = [];
            let fallbackCurrentLine = words[0] || '';
            for (let i = 1; i < words.length; i++) {
                const testLine = fallbackCurrentLine + ' ' + words[i];
                const testWidth = ctx.measureText(testLine).width;
                if (testWidth <= fallbackMaxTextWidth) {
                    fallbackCurrentLine = testLine;
                } else {
                    fallbackLines.push(fallbackCurrentLine);
                    fallbackCurrentLine = words[i];
                }
            }
            fallbackLines.push(fallbackCurrentLine);

            let fallbackHeight;
            let fallbackStartY = padding / 2;
            if (fallbackLines.length === 1) {
                fallbackHeight = fallbackFontSize * 1.5 + padding;
                fallbackStartY = fallbackHeight / 2 - fallbackFontSize / 2;
            } else {
                const fallbackTextHeight = fallbackLines.length * fallbackLineHeight;
                fallbackHeight = fallbackTextHeight + padding;
            }

            canvas.width = fallbackWidth * 2;
            canvas.height = fallbackHeight * 2;
            ctx.scale(2, 2);

            if (format === 'png' || format === 'ico') {
                ctx.clearRect(0, 0, fallbackWidth, fallbackHeight);
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, fallbackWidth, fallbackHeight);
            }

            ctx.font = `${fallbackFontSize}px "${activeFont}"`;
            ctx.fillStyle = colorPicker.value;
            ctx.textAlign = fallbackLines.length === 1 ? 'center' : 'left';
            ctx.textBaseline = 'top';

            if (fallbackLines.length === 1) {
                ctx.fillText(fallbackLines[0], fallbackWidth / 2, fallbackStartY);
            } else {
                fallbackLines.forEach((line, index) => {
                    ctx.fillText(line, padding / 2, (padding / 2) + index * fallbackLineHeight);
                });
            }

            if (format === 'pdf') {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: fallbackHeight > fallbackWidth ? 'portrait' : 'landscape',
                    unit: 'px',
                    format: [fallbackWidth, fallbackHeight]
                });

                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, fallbackWidth, fallbackHeight);
                pdf.save('textcraft_fallback.pdf');
            } else {
                const fallbackDataUrl = canvas.toDataURL(mimeType, quality);
                const fallbackSizeMB = (fallbackDataUrl.length * 0.75) / (1024 * 1024);
                console.log(`Fallback size: ${fallbackSizeMB.toFixed(2)} MB`);

                const link = document.createElement('a');
                link.download = `textcraft_fallback.${extension}`;
                link.href = fallbackDataUrl;
                link.click();
            }
        } catch (fallbackErr) {
            console.error('Fallback failed:', fallbackErr);
        }
    }
});