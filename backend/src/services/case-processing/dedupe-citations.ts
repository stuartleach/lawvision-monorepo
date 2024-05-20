// dedupe-citations.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dedupeCaseCitations() {
    await prisma.$executeRaw`
        WITH ranked_citations AS (
            SELECT 
                id,
                self_citation,
                target_citation,
                ROW_NUMBER() OVER (PARTITION BY self_citation, target_citation ORDER BY id) AS rn
            FROM 
                cases_citations
        )
        DELETE FROM cases_citations
        WHERE id IN (
            SELECT id
            FROM ranked_citations
            WHERE rn > 1
        );
    `;
}

dedupeCaseCitations()
    .then(() => {
        console.log('Duplicates removed successfully');
        prisma.$disconnect().then(() => process.exit(0));
    })
    .catch((error) => {
        console.error('Error removing duplicates:', error);
        prisma.$disconnect().then(() => process.exit(1));
    });
