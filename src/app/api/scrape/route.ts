// app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function getAddress(addressUrl: string) {
    try {
        const addressList: any = [];
        await axios.get(addressUrl).then((response) => {
            const $ = cheerio.load(response.data);
            $('address').each((addIndex: number, ul: any) => {
                const children: any = $(ul).children();
                if (children?.length && children[0]?.next?.name === 'div') {
                    const childResponse = $(children).text();
                    addressList.push(childResponse.replace(/^\s+|\s+$/gm, ''));
                } else if (children?.length && children[0]?.next?.name === 'ul') {
                    children.each((childIndex: number, li: any) => {
                        const liChildren = $(li).children();
                        liChildren.each((item: any) => {
                            const childResponse = $(item).text();
                            addressList.push(childResponse.replace(/^\s+|\s+$/gm, ''));
                        });
                    });
                } else {
                    const ulResponse = $(ul).text();
                    addressList.push(ulResponse.replace(/^\s+|\s+$/gm, ''));
                }
            });
            if (addressList?.length === 0) {
                $('div').each((index: number, ref: any) => {
                    const elem = $(ref);
                    const className: string | undefined = $(elem).attr('class');
                    const tmpClass = ['call', 'address', 'contact', 'contactus', 'Phone', 'description', 'phone', 'cont', 'widget', 'social', 'email', 'ph','contact_info'];
                    const findData = className ? tmpClass.find((list) => className?.includes(list) && !className.includes('container') && !className.includes('content')) : '';
                    const bySplitData: any = [];
                    if (findData) {
                        const splitData: any = className?.trim().split('-');
                        if (splitData && splitData?.length < 2) {
                            const text = $(`.${className}`, response.data)
                                .text()
                                .replace(/^\s+|\s+$/gm, '');
                            bySplitData.push(text.replace(/^\s+|\s+$/gm, ''));
                            addressList.push(text.replace(/^\s+|\s+$/gm, ''));
                        }
                    }
                });
            }
        });
        const tmpAddress: any = [];
        const newAddress: any = [];
        addressList.forEach((element: string) => {
            let address = element.replace(/\r?\n|\r/g, ' ');
            address = address.replace(/ /g, '');
            const findData = tmpAddress.find((list: string) => list === address);
            if (address && !findData && !address.startsWith('.')) {
                tmpAddress.push(address);
                newAddress.push(element);
            }
        });
        const parts = newAddress[0]?.split(',').map((part: any) => part.trim());
        let retrunObject: any = {};
        if (parts?.length > 0) {
            const phoneMatch = parts[parts.length - 1]?.match(/\+?\d[\d\s-]+/);
            const phoneNumber = phoneMatch ? phoneMatch[0] : '';
            if (phoneNumber) parts[parts.length - 1] = parts[parts.length - 1].replace(phoneNumber, '').trim();

            // Extract zip code using regex
            const zipCodeMatch = parts[parts.length - 2]?.match(/\b\d{5}(?:-\d{4})?\b/);
            const zipCode = zipCodeMatch ? zipCodeMatch[0] : '';

            // Remove zip code from city if present
            const cityPart = parts[parts.length - 2]?.replace(zipCode, '').trim();
            return {
                value: newAddress[0],
                addressLine1: parts[0],                          // First line (e.g., street number + street)
                addressLine2: parts[1] || '',                    // Second line if available
                city: cityPart || '',                           // City
                zipCode: zipCode,                               // Zip code
                country: parts[parts.length - 3] || '',          // Country
                phoneNumber: phoneNumber || '',                 // Phone number
            };
        }
        return retrunObject;
        // Extract phone number from the last part (if present)


        // Construct the return object
    } catch (ex) {
        console.error("Error scraping address:", ex);
        return {
            error: "Failed to scrape address information",
            details: ex instanceof Error ? ex.message : String(ex)
        };
    }
}

// Adjust the import path as needed

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const addressData = await getAddress(url);
        return NextResponse.json(addressData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            {
                error: "Failed to process request",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
