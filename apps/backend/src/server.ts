import express from "express";
import {PrismaClient} from "@shared/prisma"
import {SupremeCourtCase} from "@shared/prisma";


const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from Express");
});

app.get("/random-case", async (req, res) => {

    try {
        const randomCases: SupremeCourtCase[] = await prisma.supreme_court_cases.findMany({
            orderBy: {
                id: "desc",
            },
            take: parseInt(req.query.numCases as string) || 10,

        });
            console.log(randomCases[0])
        res.status(200).json(randomCases);
    } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({error: "Internal Server Error"}); // Return JSON error
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
