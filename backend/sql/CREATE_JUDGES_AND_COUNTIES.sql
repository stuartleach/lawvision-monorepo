-- -- Add primary key columns
-- ALTER TABLE judges
--     ADD COLUMN IF NOT EXISTS judge_id uuid default gen_random_uuid() PRIMARY KEY;
-- ALTER TABLE counties
--     ADD COLUMN IF NOT EXISTS county_id uuid default gen_random_uuid() PRIMARY KEY;

-- Add columns to judges table
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS case_count INTEGER DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS remand_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS ror_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS nmr_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS release_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS bail_set_at_arraign INTEGER DEFAULT 0;

-- Add columns to county table
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS case_count INTEGER DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS remand_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS ror_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS nmr_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS release_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS bail_set_at_arraign INTEGER DEFAULT 0;

-- Add columns to judges table
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS total_bail_set NUMERIC DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS average_bail_set NUMERIC DEFAULT 0;

-- Add columns to county table
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS total_bail_set NUMERIC DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS average_bail_set NUMERIC DEFAULT 0;

-- Add percentage columns to judges table
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percent_ror NUMERIC DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percent_nmr NUMERIC DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percent_release NUMERIC DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percent_remand NUMERIC DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percent_bail_set NUMERIC DEFAULT 0;

-- Add percentage columns to county table
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percent_ror NUMERIC DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percent_nmr NUMERIC DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percent_release NUMERIC DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percent_remand NUMERIC DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percent_bail_set NUMERIC DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS counties TEXT[];
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS judges TEXT[];

-- Add percentile columns to judges table
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_bail_set NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_bail_set NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_bail_amount NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_bail_amount NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_remand NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_remand NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_ror NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_ror NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_nmr NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_nmr NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_release NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_release NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_unknown NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_unknown NUMERIC;

-- Add percentile columns to county table
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_bail_set NUMERIC;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_bail_amount NUMERIC;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_remand NUMERIC;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_ror NUMERIC;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_nmr NUMERIC;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_release NUMERIC;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_unknown NUMERIC;

-- Add primary_county column to judges table
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS primary_county TEXT;

ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_county_case_count NUMERIC;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percentile_state_case_count NUMERIC;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percentile_state_case_count NUMERIC;

-- Add unknown and percent_unknown columns to judges table
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS unknown_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges
    ADD COLUMN IF NOT EXISTS percent_unknown NUMERIC DEFAULT 0;

-- Add unknown and percent_unknown columns to county table
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS unknown_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties
    ADD COLUMN IF NOT EXISTS percent_unknown NUMERIC DEFAULT 0;

-- Update judges table with counts
UPDATE judges
SET case_count          = sub.case_count,
    remand_at_arraign   = sub.remand_at_arraign,
    ror_at_arraign      = sub.ror_at_arraign,
    nmr_at_arraign      = sub.nmr_at_arraign,
    release_at_arraign  = sub.release_at_arraign,
    bail_set_at_arraign = sub.bail_set
FROM (SELECT judge_id,
             COUNT(*)                                                                      AS case_count,
             SUM(CASE WHEN remanded_to_jail_at_arraign = 'Y' THEN 1 ELSE 0 END)            AS remand_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS ror_at_arraign,
             SUM(CASE WHEN nmr_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS nmr_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' OR nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS release_at_arraign,
             SUM(CASE WHEN release_decision_at_arraign = 'Bail-set' THEN 1 ELSE 0 END)     AS bail_set
      FROM cases
      GROUP BY judge_id) AS sub
WHERE judges.judge_id = sub.judge_id;

-- Update county table with counts
UPDATE counties
SET case_count          = sub.case_count,
    remand_at_arraign   = sub.remand_at_arraign,
    ror_at_arraign      = sub.ror_at_arraign,
    nmr_at_arraign      = sub.nmr_at_arraign,
    release_at_arraign  = sub.release_at_arraign,
    bail_set_at_arraign = sub.bail_set
FROM (SELECT county_id,
             COUNT(*)                                                                      AS case_count,
             SUM(CASE WHEN remanded_to_jail_at_arraign = 'Y' THEN 1 ELSE 0 END)            AS remand_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS ror_at_arraign,
             SUM(CASE WHEN nmr_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS nmr_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' OR nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS release_at_arraign,
             SUM(CASE WHEN release_decision_at_arraign = 'Bail-set' THEN 1 ELSE 0 END)     AS bail_set
      FROM cases
      GROUP BY county_id) AS sub
WHERE counties.county_id = sub.county_id;


-- Update judges table with percentages
UPDATE judges
SET percent_ror      = (ror_at_arraign::NUMERIC / case_count) * 100,
    percent_nmr      = (nmr_at_arraign::NUMERIC / case_count) * 100,
    percent_release  = (release_at_arraign::NUMERIC / case_count) * 100,
    percent_remand   = (remand_at_arraign::NUMERIC / case_count) * 100,
    percent_bail_set = (bail_set_at_arraign::NUMERIC / case_count) * 100
WHERE case_count > 0;

-- Update county table with percentages
UPDATE counties
SET percent_ror      = (ror_at_arraign::NUMERIC / case_count) * 100,
    percent_nmr      = (nmr_at_arraign::NUMERIC / case_count) * 100,
    percent_release  = (release_at_arraign::NUMERIC / case_count) * 100,
    percent_remand   = (remand_at_arraign::NUMERIC / case_count) * 100,
    percent_bail_set = (bail_set_at_arraign::NUMERIC / case_count) * 100
WHERE case_count > 0;


-- Update judges table with unknown and percent_unknown
UPDATE judges
SET unknown_at_arraign = sub.unknown_at_arraign,
    percent_unknown    = sub.percent_unknown
FROM (SELECT judge_id,
             COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown') AS unknown_at_arraign,
             (COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown')::NUMERIC / COUNT(*)) *
             100                                                             AS percent_unknown
      FROM cases
      GROUP BY judge_id) AS sub
WHERE judges.judge_id = sub.judge_id;

-- Update county table with unknown and percent_unknown
UPDATE counties
SET unknown_at_arraign = sub.unknown_at_arraign,
    percent_unknown    = sub.percent_unknown
FROM (SELECT county_id,
             COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown') AS unknown_at_arraign,
             (COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown')::NUMERIC / COUNT(*)) *
             100                                                             AS percent_unknown
      FROM cases
      GROUP BY county_id) AS sub
WHERE counties.county_id = sub.county_id;

-- Update judges table with list of counties
UPDATE judges
SET counties = sub.counties
FROM (SELECT judge_id,
             ARRAY_AGG(DISTINCT county_name) AS counties
      FROM cases
      GROUP BY judge_id) AS sub
WHERE judges.judge_id = sub.judge_id;

-- Update counties table with list of judges
UPDATE counties
SET judges = sub.judges
FROM (SELECT county_id,
             ARRAY_AGG(DISTINCT judge_name) AS judges
      FROM cases
      GROUP BY county_id) AS sub
WHERE counties.county_id = sub.county_id;


-- Update judges table with total_bail_set and average_bail_set
UPDATE judges
SET total_bail_set   = sub.total_bail_set,
    average_bail_set = sub.average_bail_set
FROM (SELECT judge_id,
             SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
             AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set
      FROM cases
      WHERE first_bail_set_cash IS NOT NULL
        AND CAST(first_bail_set_cash AS NUMERIC) > 1
      GROUP BY judge_id) AS sub
WHERE judges.judge_id = sub.judge_id;

-- Update county table with total_bail_set and average_bail_set
UPDATE counties
SET total_bail_set   = sub.total_bail_set,
    average_bail_set = sub.average_bail_set
FROM (SELECT county_id,
             SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
             AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set
      FROM cases
      WHERE first_bail_set_cash IS NOT NULL
        AND CAST(first_bail_set_cash AS NUMERIC) > 1
      GROUP BY county_id) AS sub
WHERE counties.county_id = sub.county_id;


-- Update judges table with counts
UPDATE judges
SET case_count          = sub.case_count,
    remand_at_arraign   = sub.remand_at_arraign,
    ror_at_arraign      = sub.ror_at_arraign,
    nmr_at_arraign      = sub.nmr_at_arraign,
    release_at_arraign  = sub.release_at_arraign,
    bail_set_at_arraign = sub.bail_set
FROM (SELECT judge_id,
             COUNT(*)                                                                      AS case_count,
             SUM(CASE WHEN remanded_to_jail_at_arraign = 'Y' THEN 1 ELSE 0 END)            AS remand_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS ror_at_arraign,
             SUM(CASE WHEN nmr_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS nmr_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' OR nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS release_at_arraign,
             SUM(CASE WHEN release_decision_at_arraign = 'Bail-set' THEN 1 ELSE 0 END)     AS bail_set
      FROM cases
      GROUP BY judge_id) AS sub
WHERE judges.judge_id = sub.judge_id;


-- Update county table with counts
UPDATE counties
SET case_count          = sub.case_count,
    remand_at_arraign   = sub.remand_at_arraign,
    ror_at_arraign      = sub.ror_at_arraign,
    nmr_at_arraign      = sub.nmr_at_arraign,
    release_at_arraign  = sub.release_at_arraign,
    bail_set_at_arraign = sub.bail_set
FROM (SELECT county_id,
             COUNT(*)                                                                      AS case_count,
             SUM(CASE WHEN remanded_to_jail_at_arraign = 'Y' THEN 1 ELSE 0 END)            AS remand_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS ror_at_arraign,
             SUM(CASE WHEN nmr_at_arraign = 'Y' THEN 1 ELSE 0 END)                         AS nmr_at_arraign,
             SUM(CASE WHEN ror_at_arraign = 'Y' OR nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS release_at_arraign,
             SUM(CASE WHEN release_decision_at_arraign = 'Bail-set' THEN 1 ELSE 0 END)     AS bail_set
      FROM cases
      GROUP BY county_id) AS sub
WHERE counties.county_id = sub.county_id;

-- Update judges table with percentages
UPDATE judges
SET percent_ror      = (ror_at_arraign::NUMERIC / case_count) * 100,
    percent_nmr      = (nmr_at_arraign::NUMERIC / case_count) * 100,
    percent_release  = (release_at_arraign::NUMERIC / case_count) * 100,
    percent_remand   = (remand_at_arraign::NUMERIC / case_count) * 100,
    percent_bail_set = (bail_set_at_arraign::NUMERIC / case_count) * 100
WHERE case_count > 0;

-- Update county table with percentages
UPDATE counties
SET percent_ror      = (ror_at_arraign::NUMERIC / case_count) * 100,
    percent_nmr      = (nmr_at_arraign::NUMERIC / case_count) * 100,
    percent_release  = (release_at_arraign::NUMERIC / case_count) * 100,
    percent_remand   = (remand_at_arraign::NUMERIC / case_count) * 100,
    percent_bail_set = (bail_set_at_arraign::NUMERIC / case_count) * 100
WHERE case_count > 0;


-- Update judges table with unknown and percent_unknown
UPDATE judges
SET unknown_at_arraign = sub.unknown,
    percent_unknown    = sub.percent_unknown
FROM (SELECT judge_id,
             COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown') AS unknown,
             (COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown')::NUMERIC / COUNT(*)) *
             100                                                             AS percent_unknown
      FROM cases
      GROUP BY judge_id) AS sub
WHERE judges.judge_id = sub.judge_id;

-- Update county table with unknown and percent_unknown
UPDATE counties
SET unknown_at_arraign = sub.unknown,
    percent_unknown    = sub.percent_unknown
FROM (SELECT county_id,
             COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown') AS unknown,
             (COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown')::NUMERIC / COUNT(*)) *
             100                                                             AS percent_unknown
      FROM cases
      GROUP BY county_id) AS sub
WHERE counties.county_id = sub.county_id;

UPDATE counties
SET unknown_at_arraign = case_count - (remand_at_arraign + ror_at_arraign + nmr_at_arraign + bail_set_at_arraign);
UPDATE counties
SET percent_unknown = (unknown_at_arraign::NUMERIC / case_count) * 100;
UPDATE judges
SET unknown_at_arraign = case_count - (remand_at_arraign + ror_at_arraign + nmr_at_arraign + bail_set_at_arraign);
UPDATE judges
SET percent_unknown = (unknown_at_arraign::NUMERIC / case_count) * 100;

-- Calculate state-level percentiles for counties
WITH state_bail_set_percentile AS (SELECT county_id,
                                          PERCENT_RANK() OVER (ORDER BY bail_set_at_arraign) AS percentile_state_bail_set
                                   FROM counties)
UPDATE counties
SET percentile_state_bail_set = sbsp.percentile_state_bail_set
FROM state_bail_set_percentile sbsp
WHERE counties.county_id = sbsp.county_id;

-- Calculate state-level percentiles for judges
WITH state_bail_set_percentile_judges AS (SELECT judge_id,
                                                 PERCENT_RANK() OVER (ORDER BY bail_set_at_arraign) AS percentile_state_bail_set
                                          FROM judges)
UPDATE judges
SET percentile_state_bail_set = sbspj.percentile_state_bail_set
FROM state_bail_set_percentile_judges sbspj
WHERE judges.judge_id = sbspj.judge_id;


-- Create a temporary table to store the primary county for each judge
WITH judge_primary_county AS (SELECT judge_id,
                                     county_name,
                                     COUNT(*)                                                   AS case_count,
                                     RANK() OVER (PARTITION BY judge_id ORDER BY COUNT(*) DESC) AS rank
                              FROM cases
                              GROUP BY judge_id, county_name)
SELECT judge_id, county_name
INTO TEMP TABLE judge_primary_county_temp
FROM judge_primary_county
WHERE rank = 1;

-- Update the judges table with the primary county
UPDATE judges
SET primary_county = jpc.county_name
FROM judge_primary_county_temp jpc
WHERE judges.judge_id = jpc.judge_id;


-- Calculate state-level percentiles for counties
WITH state_bail_set_percentile AS (SELECT county_id,
                                          PERCENT_RANK() OVER (ORDER BY case_count) * 100         AS percentile_state_case_count,
                                          PERCENT_RANK() OVER (ORDER BY total_bail_set) * 100     AS percentile_state_bail_set,
                                          PERCENT_RANK() OVER (ORDER BY average_bail_set) * 100   AS percentile_state_bail_amount,
                                          PERCENT_RANK() OVER (ORDER BY percent_remand) * 100  AS percentile_state_remand,
                                          PERCENT_RANK() OVER (ORDER BY percent_ror) * 100     AS percentile_state_ror,
                                          PERCENT_RANK() OVER (ORDER BY percent_nmr) * 100     AS percentile_state_nmr,
                                          PERCENT_RANK() OVER (ORDER BY percent_release) * 100 AS percentile_state_release,
                                          PERCENT_RANK() OVER (ORDER BY percent_unknown) * 100 AS percentile_state_unknown
                                   FROM counties)
UPDATE counties
SET percentile_state_bail_set    = sbsp.percentile_state_bail_set,
    percentile_state_bail_amount = sbsp.percentile_state_bail_amount,
    percentile_state_case_count  = sbsp.percentile_state_case_count,
    percentile_state_remand      = sbsp.percentile_state_remand,
    percentile_state_ror         = sbsp.percentile_state_ror,
    percentile_state_nmr         = sbsp.percentile_state_nmr,
    percentile_state_release     = sbsp.percentile_state_release,
    percentile_state_unknown     = sbsp.percentile_state_unknown
FROM state_bail_set_percentile sbsp
WHERE counties.county_id = sbsp.county_id;


-- Calculate state-level percentiles for counties
WITH state_bail_set_percentile AS (SELECT county_id,
                                          PERCENT_RANK() OVER (ORDER BY case_count) * 100         AS percentile_state_case_count,
                                          PERCENT_RANK() OVER (ORDER BY total_bail_set) * 100     AS percentile_state_bail_set,
                                          PERCENT_RANK() OVER (ORDER BY average_bail_set) * 100   AS percentile_state_bail_amount,
                                          PERCENT_RANK() OVER (ORDER BY percent_remand) * 100  AS percentile_state_remand,
                                          PERCENT_RANK() OVER (ORDER BY percent_ror) * 100     AS percentile_state_ror,
                                          PERCENT_RANK() OVER (ORDER BY percent_nmr) * 100     AS percentile_state_nmr,
                                          PERCENT_RANK() OVER (ORDER BY percent_release) * 100 AS percentile_state_release,
                                          PERCENT_RANK() OVER (ORDER BY percent_unknown) * 100 AS percentile_state_unknown
                                   FROM counties)
UPDATE counties
SET percentile_state_bail_set    = sbsp.percentile_state_bail_set,
    percentile_state_bail_amount = sbsp.percentile_state_bail_amount,
    percentile_state_case_count  = sbsp.percentile_state_case_count,
    percentile_state_remand      = sbsp.percentile_state_remand,
    percentile_state_ror         = sbsp.percentile_state_ror,
    percentile_state_nmr         = sbsp.percentile_state_nmr,
    percentile_state_release     = sbsp.percentile_state_release,
    percentile_state_unknown     = sbsp.percentile_state_unknown
FROM state_bail_set_percentile sbsp
WHERE counties.county_id = sbsp.county_id;


-- Calculate state-level percentiles for judges
WITH state_bail_set_percentile_judges AS (SELECT judge_id,
                                                 PERCENT_RANK() OVER (ORDER BY case_count) * 100         AS percentile_state_case_count,
                                                 PERCENT_RANK() OVER (ORDER BY total_bail_set) * 100     AS percentile_state_bail_set,
                                                 PERCENT_RANK() OVER (ORDER BY average_bail_set) * 100   AS percentile_state_bail_amount,
                                                 PERCENT_RANK() OVER (ORDER BY percent_remand) * 100  AS percentile_state_remand,
                                                 PERCENT_RANK() OVER (ORDER BY percent_ror) * 100     AS percentile_state_ror,
                                                 PERCENT_RANK() OVER (ORDER BY percent_nmr) * 100     AS percentile_state_nmr,
                                                 PERCENT_RANK() OVER (ORDER BY percent_release) * 100 AS percentile_state_release,
                                                 PERCENT_RANK() OVER (ORDER BY percent_unknown) * 100 AS percentile_state_unknown
                                          FROM judges)
UPDATE judges
SET percentile_state_bail_set    = sbspj.percentile_state_bail_set,
    percentile_state_case_count  = sbspj.percentile_state_case_count,
    percentile_state_bail_amount = sbspj.percentile_state_bail_amount,
    percentile_state_remand      = sbspj.percentile_state_remand,
    percentile_state_ror         = sbspj.percentile_state_ror,
    percentile_state_nmr         = sbspj.percentile_state_nmr,
    percentile_state_release     = sbspj.percentile_state_release,
    percentile_state_unknown     = sbspj.percentile_state_unknown
FROM state_bail_set_percentile_judges sbspj
WHERE judges.judge_id = sbspj.judge_id;

-- Calculate county-level percentiles for judges based on their primary county
WITH county_bail_set_percentile_judges AS (
    SELECT
        judges.judge_id,
        judges.primary_county AS county_id,  -- Use primary_county to partition
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.case_count) * 100 AS percentile_county_case_count,
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.total_bail_set) * 100 AS percentile_county_bail_set,
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.average_bail_set) * 100 AS percentile_county_bail_amount,
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.percent_remand) * 100 AS percentile_county_remand,
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.percent_ror) * 100 AS percentile_county_ror,
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.percent_nmr) * 100 AS percentile_county_nmr,
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.percent_release) * 100 AS percentile_county_release,
        PERCENT_RANK() OVER (PARTITION BY judges.primary_county ORDER BY judges.percent_unknown) * 100 AS percentile_county_unknown
    FROM judges
)
UPDATE judges
SET
    percentile_county_bail_set    = cbspj.percentile_county_bail_set,
    percentile_county_bail_amount = cbspj.percentile_county_bail_amount,
    percentile_county_case_count  = cbspj.percentile_county_case_count,
    percentile_county_remand      = cbspj.percentile_county_remand,
    percentile_county_ror         = cbspj.percentile_county_ror,
    percentile_county_nmr         = cbspj.percentile_county_nmr,
    percentile_county_release     = cbspj.percentile_county_release,
    percentile_county_unknown     = cbspj.percentile_county_unknown
FROM county_bail_set_percentile_judges cbspj
WHERE judges.judge_id = cbspj.judge_id;
