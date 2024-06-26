import express from "express";
// import {PrismaClient} from "@prisma/client";
import { PrismaClient } from "@shared/prisma";
// import {SupremeCourtCases} from "@shared/types";
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello from Express");
});
app.get("/random-case", async (req, res) => {
    const randomCases = await prisma.supreme_court_cases.findMany({
        orderBy: {
            id: "desc",
        },
        take: parseInt(req.query.numCases) || 10,
    });
    console.log(randomCases[0].name);
    res.json(randomCases);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
