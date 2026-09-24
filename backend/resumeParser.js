import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

/**
 * Extracts clean readable text from a PDF buffer.
 * @param {Buffer} pdfBuffer - The buffer containing PDF data.
 * @returns {Promise<{text: string, numPages?: number, warning?: string}>}
 */
export async function extractTextFromPDF(pdfBuffer) {
  try {
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('PDF file is empty');
    }

    const data = await pdfParse(pdfBuffer);
    const cleanText = (data.text || '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    if (cleanText.length < 40) {
      return {
        text: cleanText,
        numPages: data.numpages || 1,
        warning: 'Extracted text is very short. This resume might be a scanned image or photo without selectable text.'
      };
    }

    return {
      text: cleanText,
      numPages: data.numpages || 1
    };
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extracts clean readable text from a Word document (.docx or .doc) buffer.
 * @param {Buffer} wordBuffer - The buffer containing Word document data.
 * @returns {Promise<{text: string, warning?: string}>}
 */
export async function extractTextFromWord(wordBuffer) {
  if (!wordBuffer || wordBuffer.length === 0) {
    throw new Error('Word document file is empty');
  }

  // 1. Attempt standard docx text extraction via mammoth
  try {
    const result = await mammoth.extractRawText({ buffer: wordBuffer });
    const cleanText = (result.value || '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    if (cleanText.length >= 30) {
      return { text: cleanText };
    }
  } catch (mammothErr) {
    // If not a valid zip (.docx), proceed to binary string extraction (.doc)
  }

  // 2. Fallback for legacy .doc binary files or plain word dumps
  try {
    const rawString = wordBuffer.toString('latin1');
    const matches = rawString.match(/[\x20-\x7E\xA0-\xFF\n\r]{4,}/g) || [];
    const cleanText = matches.join(' ').replace(/[ \t]+/g, ' ').trim();

    if (cleanText.length >= 20) {
      return { text: cleanText };
    }
  } catch (binaryErr) {
    // ignore
  }

  throw new Error('Could not extract readable text from this Word document. Please ensure it is a valid .docx or .doc file.');
}

/**
 * Universal document text extractor supporting PDF, DOCX, and DOC.
 * @param {Buffer} buffer - File buffer.
 * @param {string} fileName - Original file name.
 * @returns {Promise<{text: string, warning?: string}>}
 */
export async function extractTextFromDocument(buffer, fileName = '') {
  const lowerName = (fileName || '').toLowerCase();

  if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
    return await extractTextFromWord(buffer);
  }

  // Default to PDF
  return await extractTextFromPDF(buffer);
}
