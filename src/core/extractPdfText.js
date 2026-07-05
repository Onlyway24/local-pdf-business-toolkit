const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

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
    const parser = new PDFParse({ data: dataBuffer });

    const parsed = await parser.getText();

    if (typeof parser.destroy === 'function') {
      await parser.destroy();
    }

    return {
      success: true,
      text: parsed.text || '',
      pageCount: parsed.total || 0,
      info: parsed.info || {}
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      pageCount: 0,
      info: {},
      error: error.message
    };
  }
}

module.exports = {
  extractPdfText
};
