// PDF.js library
const pdfjsLib = window['pdfjs-dist/build/pdf'];

const pdfFileInput = document.getElementById('pdfFile');
const readPdfButton = document.getElementById('readPdf');
const textOutput = document.getElementById('textOutput');
const playAudioButton = document.getElementById('playAudio');

let extractedText = '';

// Read PDF
readPdfButton.addEventListener('click', () => {
    const file = pdfFileInput.files[0];
    if (!file) {
        alert('Please select a PDF file first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);

        try {
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            extractedText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                textContent.items.forEach((item) => {
                    extractedText += item.str + ' ';
                });
            }

            textOutput.value = extractedText.trim() || 'No readable text found in this PDF.';
        } catch (error) {
            console.error('Error reading PDF:', error);
            alert('Failed to read the PDF. Ensure the file is not encrypted or corrupted.');
        }
    };

    reader.readAsArrayBuffer(file);
});

// Play Audio
playAudioButton.addEventListener('click', () => {
    if (!extractedText.trim()) {
        alert('No text to read. Please extract text from a PDF first.');
        return;
    }

    if (!('speechSynthesis' in window)) {
        alert('Text-to-Speech is not supported in this browser. Please try a modern browser like Chrome or Edge.');
        return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(extractedText);

    utterance.onerror = () => {
        alert('An error occurred during speech synthesis.');
    };

    synth.speak(utterance);
});
