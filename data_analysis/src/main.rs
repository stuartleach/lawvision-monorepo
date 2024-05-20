use polars::prelude::*;
use std::error::Error;
use std::fs::File;

fn main() -> std::result::Result<(), Box<dyn Error>> {
    // new variable for path
    let path = "./data/SCDB_2023_01_caseCentered_LegalProvision.csv";
    // Load the data
    let df = CsvReader::from_path(path)?
        .infer_schema(None)
        .has_header(true)
        .finish()?;

    // Create a variable for any concurrence
    let df = df
        .lazy()
        .with_column(
            when(col("vote").eq(lit(3)).or(col("vote").eq(lit(4))))
                .then(lit(1))
                .otherwise(lit(0))
                .alias("concurrences"),
        )
        .group_by(&[col("caseId"), col("term")])
        .agg([
            col("concurrences").sum().alias("concurrences"),
        ])
        .with_column(
            when(col("concurrences").gt(lit(0)))
                .then(lit(1))
                .otherwise(lit(0))
                .alias("concurDummy"),
        )
        .select([
            col("caseId"),
            col("term"),
            col("concurDummy"),
        ])
        .group_by(&[col("term")])
        .agg([
            col("concurDummy").sum().alias("concurCount"),
            col("term").count().alias("cases"),
        ])
        .with_column(
            (col("concurCount") / col("cases") * lit(100)).alias("concurPercent"),
        )
        .collect()?;

    // Save the resulting data to a new CSV file
    let mut file = File::create("concurrences.csv")?;
    let mut df = df; // Make the DataFrame mutable
    CsvWriter::new(&mut file)
        .finish(&mut df)?;

    Ok(())
}
