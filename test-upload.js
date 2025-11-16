#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const https = require('https');

// Create a test PDF buffer (this is just a mock PDF header)
const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj\n<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n176\n%%EOF');

async function testUploadEndpoint() {
  try {
    const form = new FormData();
    form.append('file', mockPdfBuffer, {
      filename: 'test-invoice.pdf',
      contentType: 'application/pdf'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/invoice/upload',
      method: 'POST',
      headers: form.getHeaders()
    };

    console.log('Testing endpoint: http://localhost:3001/invoice/upload');
    console.log('Sending mock PDF data...');

    const req = require('http').request(options, (res) => {
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('Response:');
        try {
          const response = JSON.parse(data);
          console.log(JSON.stringify(response, null, 2));
        } catch (e) {
          console.log('Raw response:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('\n❌ Connection refused. Make sure the server is running on port 3001');
        console.log('Start the server with: npm run start:dev');
      }
    });

    form.pipe(req);

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

console.log('🧪 Testing Invoice Upload API...\n');
testUploadEndpoint();