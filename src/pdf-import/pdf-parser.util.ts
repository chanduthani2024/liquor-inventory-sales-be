import * as pdfParse from 'pdf-parse';
import { CreateLiquorDeliveryDto } from './dto/create-liquor-delivery.dto';

interface BrandItem {
    brandNumber: string;
    brandName: string;
    productType: string;
    packType: string;
    packQtySize: string;
    qtyCasesDelivered: number;
    qtyBottlesDelivered: number;
    unitRateBtlRate: string;
    rateCase: number;
    totalAmount: number;
}

/**
 * Parse PDF file from API payload and extract liquor delivery data
 * @param file - Multer file object from API request
 * @returns Array of brand items
 */
export async function parsePDF(file: any): Promise<CreateLiquorDeliveryDto[]> {
    try {
        // Validate file exists
        if (!file) {
            throw new Error('No file provided');
        }

        // Validate it's a PDF
        if (file.mimetype !== 'application/pdf') {
            throw new Error('File must be a PDF');
        }

        console.log('Processing PDF:', {
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        });

        // Get buffer
        let pdfBuffer: Buffer;
        if (file.buffer) {
            pdfBuffer = file.buffer;
        } else if (file.path) {
            const fs = require('fs');
            pdfBuffer = fs.readFileSync(file.path);
        } else {
            throw new Error('File buffer or path not found');
        }

        // Parse PDF to extract text
        const pdfData = await pdfParse(pdfBuffer);
        const pdfText = pdfData.text;

        console.log('Extracted PDF text length:', pdfText.length);
        
        // Extract brands from the text
        const brands = extractBrandsFromPDFText(pdfText);
        
        console.log('Extracted brands count:', brands.length);
        
        if (brands.length === 0) {
            console.warn('No brands extracted. Check logs above for details.');
        }
        
        return brands;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
}

/**
 * Extract brand items from PDF text content
 * Data spans multiple lines in the PDF
 */
function extractBrandsFromPDFText(pdfText: string): BrandItem[] {
    const brands: BrandItem[] = [];
    
    // Normalize line breaks
    const lines = pdfText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

    let inDataSection = false;
    let headerFound = false;
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Start collecting data after finding the header row (only first occurrence)
        if (!headerFound && (trimmedLine.includes('Sl.No.') || trimmedLine.includes('Brand Number'))) {
            console.log(`Found header at line ${i + 1}`);
            inDataSection = true;
            headerFound = true;
            i++;
            continue;
        }
        
        // Skip repeated headers on subsequent pages (don't reset inDataSection)
        if (headerFound && (trimmedLine.includes('Sl.No.') || trimmedLine.includes('Brand Number'))) {
            console.log(`Found repeated header at line ${i + 1} - skipping`);
            i++;
            continue;
        }

        // Stop at the end of table - look for summary/footer sections
        if (trimmedLine.includes('TIN') || trimmedLine.includes('Particulars') || 
            trimmedLine.includes('Invoice Qty') || trimmedLine.includes('CST') ||
            trimmedLine.includes('Breakage Qty') || trimmedLine.includes('Total (Cases/Btls)')) {
            console.log(`Found table end at line ${i + 1}: ${trimmedLine.substring(0, 50)}`);
            break;
        }

        if (!inDataSection) {
            i++;
            continue;
        }
        
        if (!trimmedLine) {
            i++;
            continue;
        }

        // Skip page footers/headers (URLs, page numbers, etc.)
        if (trimmedLine.includes('https://') || 
            trimmedLine.includes('tgbcl.telangana.gov.in') ||
            trimmedLine.match(/^Page\s+\d+\s+of\s+\d+/) ||
            trimmedLine.match(/^\d{2}\/\d{2}\/\d{2},\s+\d{1,2}:\d{2}\s+(AM|PM)$/)) {
            console.log(`  -> Skipping page footer/header at line ${i + 1}: ${trimmedLine.substring(0, 50)}`);
            i++;
            continue;
        }

        // Check if line starts with serial number + 4-digit brand number
        const startsWithSerial = /^(\d+)(\d{4})(.*)$/.exec(trimmedLine);
        if (!startsWithSerial) {
            i++;
            continue;
        }

        const serialNo = startsWithSerial[1];
        const brandNumber = startsWithSerial[2];
        let restOfLine = startsWithSerial[3].trim();

        console.log(`\nLine ${i + 1} - Serial: ${serialNo}, Brand#: ${brandNumber}`);

        // Track how many lines we consumed for brand name
        let linesConsumedForBrandName = 0;
        
        // If restOfLine is empty or very short, the brand name is on the next line(s)
        // Collect next lines until we find IML or Beer
        if (!restOfLine || !restOfLine.match(/(IML|Beer)/)) {
            console.log(`  -> Brand name continues on next line(s)`);
            let lookAheadIndex = i + 1;
            const brandNameLines: string[] = [];
            
            // Collect lines until we find IML or Beer (max 5 lines ahead)
            while (lookAheadIndex < lines.length && lookAheadIndex < i + 6) {
                const nextLine = lines[lookAheadIndex].trim();
                if (!nextLine) {
                    lookAheadIndex++;
                    linesConsumedForBrandName++;
                    continue;
                }
                
                brandNameLines.push(nextLine);
                linesConsumedForBrandName++;
                
                // Check if this line contains IML or Beer
                if (nextLine.match(/(IML|Beer)/)) {
                    break;
                }
                
                lookAheadIndex++;
            }
            
            // Combine all lines
            restOfLine = brandNameLines.join(' ');
            console.log(`  -> Combined brand line: ${restOfLine.substring(0, 100)}`);
            console.log(`  -> Consumed ${linesConsumedForBrandName} lines for brand name`);
        }

        // Parse: <brandName><IML|Beer><G|C|P><packQty><cases><bottles>
        const productTypeMatch = restOfLine.match(/^(.+?)(IML|Beer)([A-Z])(.+)$/);
        if (!productTypeMatch) {
            console.log(`  -> No product type found in: ${restOfLine.substring(0, 50)}`);
            i++;
            continue;
        }

        const brandName = productTypeMatch[1].trim();
        const productType = productTypeMatch[2];
        const packType = productTypeMatch[3];
        const afterPackType = productTypeMatch[4];

        // Parse pack qty, cases, bottles from the same line
        // Pattern: <packQty>ml<cases><bottles>
        const sameLineMatch = afterPackType.match(/^(\d+\s*\/\s*\d+)\s*ml\s*(\d+)\s*(\d+)/);
        
        if (!sameLineMatch) {
            console.log(`  -> Pack qty pattern didn't match in: ${afterPackType}`);
            i++;
            continue;
        }

        const packQty = sameLineMatch[1].trim();
        const cases = sameLineMatch[2];
        const bottles = sameLineMatch[3];

        console.log(`  -> Brand: "${brandName}", Type: ${productType}, Pack: ${packType}`);
        console.log(`  -> Pack: ${packQty} ml, Cases: ${cases}, Bottles: ${bottles}`);

        // Now look at the NEXT lines for rate and total (after brand name lines)
        // Start from after the brand name lines we already consumed
        let nextLineIndex = i + 1 + linesConsumedForBrandName;
        let rateFirstPart = '';
        let rateSecondPart = '';
        let totalAmount = '';
        
        // Collect next 3-4 lines to find rate and total
        const nextLines: string[] = [];
        for (let j = nextLineIndex; j < Math.min(nextLineIndex + 4, lines.length); j++) {
            const nextLine = lines[j].trim();
            if (nextLine && !nextLine.match(/^\d+\d{4}/)) { // Not a new product line
                nextLines.push(nextLine);
            } else {
                break;
            }
        }

        console.log(`  -> Next lines for rate/total (starting from line ${nextLineIndex}):`, nextLines);

        // Try to extract rate and total from next lines
        // Pattern 1: "1,501.00 /" on one line, "125.08" on next, "66,044.00" on next
        // Pattern 2: "1,501.00 / 125.08" on one line, "66,044.00" on next
        
        for (let j = 0; j < nextLines.length; j++) {
            const nl = nextLines[j];
            
            // Check for rate with / at the end or middle
            if (nl.match(/^[\d,]+\.?\d*\s*\//) && !rateFirstPart) {
                // Extract first part of rate
                const rateMatch = nl.match(/^([\d,]+\.?\d*)\s*\/\s*([\d,]+\.?\d*)?/);
                if (rateMatch) {
                    rateFirstPart = rateMatch[1];
                    if (rateMatch[2]) {
                        rateSecondPart = rateMatch[2];
                    }
                }
            }
            // Check for second part of rate (if not already found)
            else if (!rateSecondPart && rateFirstPart && nl.match(/^[\d,]+\.?\d*$/)) {
                rateSecondPart = nl;
            }
            // Check for total amount (number with comma)
            else if (rateFirstPart && rateSecondPart && nl.match(/^[\d,]+\.?\d*$/) && !totalAmount) {
                totalAmount = nl;
                break;
            }
        }

        if (!rateFirstPart || !rateSecondPart || !totalAmount) {
            console.log(`  -> Could not extract rate/total. Rate1: ${rateFirstPart}, Rate2: ${rateSecondPart}, Total: ${totalAmount}`);
            i++;
            continue;
        }

        try {
            const unitRateBtlRate = `${rateFirstPart} / ${rateSecondPart}`;
            const rateCase = parseFloat(rateFirstPart.replace(/,/g, ''));
            const total = parseFloat(totalAmount.replace(/,/g, ''));

            const brand: BrandItem = {
                brandNumber: brandNumber,
                brandName: brandName,
                productType: productType,
                packType: packType,
                packQtySize: `${packQty} ml`,
                qtyCasesDelivered: parseInt(cases),
                qtyBottlesDelivered: parseInt(bottles),
                unitRateBtlRate: unitRateBtlRate,
                rateCase: rateCase,
                totalAmount: total
            };

            brands.push(brand);
            console.log(`  ✓ Successfully extracted: ${brand.brandName}`);
        } catch (parseError) {
            console.warn(`  ✗ Error parsing data:`, parseError.message);
        }

        i++;
    }

    return brands;
}