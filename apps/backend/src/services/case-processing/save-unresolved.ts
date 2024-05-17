// save-unresolved.ts
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs/promises';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function saveUnresolvedCitations(unresolvedCitations: Set<string>) {
    const filePath = path.join(__dirname, '../../unresolved_citations.json');
    await fs.writeFile(filePath, JSON.stringify(Array.from(unresolvedCitations), null, 2));
    console.log(`Unresolved citations saved to ${filePath}`);
}
