#!/bin/bash

# Test script for PDF Import API
echo "🧪 Testing PDF Import API (Liquor Delivery Processing)..."
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

# Create a test PDF file with liquor delivery data
echo "Creating test PDF file..."
cat > test-liquor-delivery.pdf << 'EOF'
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
<</Length 300>>
stream
BT
/F1 12 Tf
72 720 Td
(Liquor Delivery Invoice) Tj
0 -20 Td
(Sl.No. Brand Number Brand Name Product Type Pack Type Pack Qty/Size Qty Cases Delivered Qty Bottles Delivered Unit Rate/Btl Rate Rate Case Total Amount) Tj
0 -20 Td
(1  101  KINGFISHER BEER  Beer  A  24/650ml  10  240  30.00/720.00  720.00  7200.00) Tj
0 -20 Td
(2  102  ROYAL CHALLENGE  IML  B  12/750ml  5  60  120.00/1440.00  1440.00  7200.00) Tj
0 -20 Td
(Retailer Name: Test Store) Tj
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
560
%%EOF
EOF

echo "✅ Test PDF created"
echo ""

# Test the upload endpoint
echo "Testing POST /pdf-import/upload..."
echo "Sending request..."
echo ""

response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-liquor-delivery.pdf" \
  http://localhost:3001/pdf-import/upload)

# Extract HTTP status code
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
# Extract response body
response_body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')

echo "HTTP Status: $http_code"
echo "Response Body:"
echo "$response_body" | python3 -m json.tool 2>/dev/null || echo "$response_body"

echo ""

# Test getting all deliveries
echo "Testing GET /pdf-import/deliveries..."
curl -s http://localhost:3001/pdf-import/deliveries | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3001/pdf-import/deliveries

echo ""

# Clean up
rm -f test-liquor-delivery.pdf

if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo "✅ Test passed! PDF Import endpoint is working."
else
    echo "❌ Test failed. HTTP status: $http_code"
fi

echo ""
echo "📝 Available endpoints:"
echo "  POST /pdf-import/upload              # Upload liquor delivery PDF"
echo "  GET  /pdf-import/deliveries          # Get all delivery records"
echo "  GET  /pdf-import/deliveries/:id      # Get specific delivery record"
echo "  DELETE /pdf-import/deliveries/:id    # Delete delivery record"