#!/usr/bin/env node

// Simple test to check if pdf-parse works
const pdfParse = require('pdf-parse');

// Create a minimal PDF buffer for testing
const testPdfBuffer = Buffer.from(`%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 85
>>
stream
BT
/F1 12 Tf
72 720 Td
(ICDC12345 Test Invoice) Tj
0 -20 Td
(1 101 KINGFISHER BEER Beer A 24/650ml 10 240 720.00/30.00 7200.00) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000179 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
314
%%EOF`);

async function testPdfParsing() {
  try {
    console.log('🧪 Testing PDF parsing...');
    
    const result = await pdfParse(testPdfBuffer);
    console.log('✅ PDF parsing successful!');
    console.log('Extracted text:');
    console.log('---');
    console.log(result.text);
    console.log('---');
    
    // Test ICDC extraction
    const icdcMatch = result.text.match(/ICDC\d+/);
    console.log('ICDC found:', icdcMatch ? icdcMatch[0] : 'Not found');
    
    // Test regex pattern
    const tableRegex = /(\d+)\s+(\d+)\s+([A-Z`' ]+)\s+(Beer|IML)\s+([A-Z])\s+(\d+)\s*\/\s*(\d+)\s*ml\s+(\d+)\s+(\d+)\s*([\d,.]+)\s*\/\s*([\d,.]+)\s*([\d,.]+)/g;
    const matches = [];
    let match;
    
    while ((match = tableRegex.exec(result.text)) !== null) {
      matches.push({
        sl_no: match[1],
        brand_code: match[2],
        brand_name: match[3].trim(),
        product_type: match[4],
        pack_type: match[5],
        pack_qty: match[6],
        size_ml: match[7],
        qty_cases: match[8],
        qty_bottles: match[9],
        rate_case: match[10],
        rate_bottle: match[11],
        total: match[12]
      });
    }
    
    console.log('Parsed items:', matches.length);
    if (matches.length > 0) {
      console.log('Sample item:', JSON.stringify(matches[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ PDF parsing failed:', error.message);
    if (error.message.includes('DOMMatrix')) {
      console.log('\n💡 Solution: You may need to install canvas and jsdom:');
      console.log('   npm install canvas jsdom');
    }
  }
}

testPdfParsing();