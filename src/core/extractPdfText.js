const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function extractPdfText(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return {
      success: false,
      text: '',
      error: 'A valid file path is required'
    };
  }

  const extension = path.extname(filePath).toLowerCase();

  if (extension !== '.pdf') {
    return {
      success: false,
      text: '',
      error: 'File is not a PDF'
    };
  }

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      text: '',
      error: 'File does not exist'
    };
  }

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);

    return {
      success: true,
      text: parsed.text || '',
      pageCount: parsed.numpages || 0,
      info: parsed.info || {}
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      error: error.message
    };
  }
}

module.exports = {
  extractPdfText
};
