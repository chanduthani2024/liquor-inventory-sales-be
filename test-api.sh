#!/bin/bash

# Test script for Invoice Upload API
echo "🧪 Testing Invoice Upload API..."
echo "================================"

# Check if server is running
echo "Checking if server is running on port 3001..."
curl -s http://localhost:3001 > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Server is not running on port 3001"
    echo "Please start the server with: npm run start:dev"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Create a test PDF file (minimal PDF structure)
echo "Creating test PDF file..."
cat > test-invoice.pdf << 'EOF'
%PDF-1.4
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Kids[3 0 R]/Count 1>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>
endobj
4 0 obj
<</Length 44>>
stream
BT
/F1 12 Tf
72 720 Td
(ICDC12345 Test Invoice) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000209 00000 n 
trailer
<</Size 5/Root 1 0 R>>
startxref
295
%%EOF
EOF

echo "✅ Test PDF created"
echo ""

# Test the upload endpoint
echo "Testing POST /invoice/upload..."
echo "Sending request..."
echo ""

response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-invoice.pdf" \
  http://localhost:3001/invoice/upload)

# Extract HTTP status code
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
# Extract response body
response_body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')

echo "HTTP Status: $http_code"
echo "Response Body:"
echo "$response_body" | python3 -m json.tool 2>/dev/null || echo "$response_body"

echo ""

# Clean up
rm -f test-invoice.pdf

if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo "✅ Test passed! Upload endpoint is working."
else
    echo "❌ Test failed. HTTP status: $http_code"
    
    if [ "$http_code" = "404" ]; then
        echo ""
        echo "🔍 Debugging suggestions:"
        echo "1. Check if InvoiceItemModule is properly imported in app.module.ts"
        echo "2. Verify the controller route is '@Controller('invoice')'"
        echo "3. Make sure the server restarted after adding the new module"
        echo "4. Check server logs for any compilation errors"
    fi
fi

echo ""
echo "📝 Additional tests you can run:"
echo "  curl http://localhost:3001/invoice          # Get all invoice items"
echo "  curl http://localhost:3001/invoice/icdc/ICDC12345  # Get items by ICDC number"