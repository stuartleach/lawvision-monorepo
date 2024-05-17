// populate-citation-id.ts
import { PrismaClient } from '@shared/prisma';

const prisma = new PrismaClient();

async function populateCitationId() {
    const cases = await prisma.supreme_court_cases.findMany();

    for (const caseItem of cases) {
        if (caseItem.citation) {
            const citation = caseItem.citation as any;
            const citationId = `${citation.volume} U.S. ${citation.page}`;

            try {
                await prisma.supreme_court_cases.update({
                    where: { id: caseItem.id },
                    data: { citation_id: citationId }
                });

                console.log(`Updated case ${caseItem.name} with citation ID ${citationId}`);
            } catch (error) {
                console.error(`Error updating case ${caseItem.name} with ID ${caseItem.id}:`, error);
                // Optionally, you could add the failed cases to a list and save or log it after processing all cases
            }
        }
    }
}

populateCitationId()
    .then(() => {
        console.log('All cases processed successfully');
        prisma.$disconnect().then(() => process.exit(0));
    })
    .catch((error) => {
        console.error('Error processing cases:', error);
        prisma.$disconnect().then(() => process.exit(1));
    });
