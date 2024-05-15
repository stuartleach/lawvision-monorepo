"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {PrismaClient} from "@prisma/client";
const prisma_1 = require("@shared/prisma");
// import {SupremeCourtCases} from "@shared/types";
const app = (0, express_1.default)();
const prisma = new prisma_1.PrismaClient();
app.use(express_1.default.json());
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
