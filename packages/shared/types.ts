type SupremeCourtCase = {
    caseCitation: string;
    title: string;
    citations: string[];
    childCases: SupremeCourtCase[];
};
export { SupremeCourtCase };