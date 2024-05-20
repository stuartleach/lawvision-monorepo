import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const directoryPath = '~/supreme'; // Update this to your directory path

async function scrapeAndSave() {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);

        // Extract case information
        const title = $('h1').text().trim();
        const year = parseInt($('meta[name="year"]').attr('content') || '0', 10);
        const volume = parseInt($('meta[name="volume"]').attr('content') || '0', 10);
        const page = parseInt($('meta[name="page"]').attr('content') || '0', 10);

        // Extract citations
        const citations: string[] = [];
        $('p').each((i, el) => {
            const text = $(el).text();
            const citationRegex = /\b\d+\sU\.S\.\s\d+\b/g;
            const matches = text.match(citationRegex);
            if (matches) {
                matches.forEach(match => citations.push(match));
            }
        });

        // Save to database
        try {
            const caseData = await prisma.case.create({
                data: {
                    title,
                    year,
                    volume,
                    page,
                    citations: {
                        create: citations.map(citation => ({
                            citation
                        }))
                    }
                }
            });

            console.log(`Saved case: ${caseData.title}`);
        } catch (error) {
            console.error(`Failed to save case: ${title}`, error);
        }
    }
}

scrapeAndSave().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
