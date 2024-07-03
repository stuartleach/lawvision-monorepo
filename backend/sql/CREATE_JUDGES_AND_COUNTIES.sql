-- Add columns to judges table
ALTER TABLE judges ADD COLUMN case_count INTEGER DEFAULT 0;
ALTER TABLE judges ADD COLUMN remand_to_jail_count INTEGER DEFAULT 0;
ALTER TABLE judges ADD COLUMN ror_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges ADD COLUMN nmr_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges ADD COLUMN release_at_arraign INTEGER DEFAULT 0;
ALTER TABLE judges ADD COLUMN bail_set INTEGER DEFAULT 0;

-- Add columns to county table
ALTER TABLE counties ADD COLUMN case_count INTEGER DEFAULT 0;
ALTER TABLE counties ADD COLUMN remand_to_jail_count INTEGER DEFAULT 0;
ALTER TABLE counties ADD COLUMN ror_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties ADD COLUMN nmr_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties ADD COLUMN release_at_arraign INTEGER DEFAULT 0;
ALTER TABLE counties ADD COLUMN bail_set INTEGER DEFAULT 0;

-- Update judges table with counts
UPDATE judges
SET case_count = sub.case_count,
    remand_to_jail_count = sub.remand_to_jail_count,
    ror_at_arraign = sub.ror_at_arraign,
    nmr_at_arraign = sub.nmr_at_arraign,
    release_at_arraign = sub.release_at_arraign,
    bail_set = sub.bail_set
FROM (
    SELECT
        judge_id,
        COUNT(*) AS case_count,
        SUM(CASE WHEN remanded_to_jail_at_arraign = 'Y' THEN 1 ELSE 0 END) AS remand_to_jail_count,
        SUM(CASE WHEN ror_at_arraign = 'Y' THEN 1 ELSE 0 END) AS ror_at_arraign,
        SUM(CASE WHEN nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS nmr_at_arraign,
        SUM(CASE WHEN ror_at_arraign = 'Y' OR nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS release_at_arraign,
        SUM(CASE WHEN release_decision_at_arraign = 'Bail-set' THEN 1 ELSE 0 END) AS bail_set
    FROM cases
    GROUP BY judge_id
) AS sub
WHERE judges.judge_id = sub.judge_id;

-- Update county table with counts
UPDATE counties
SET case_count = sub.case_count,
    remand_to_jail_count = sub.remand_to_jail_count,
    ror_at_arraign = sub.ror_at_arraign,
    nmr_at_arraign = sub.nmr_at_arraign,
    release_at_arraign = sub.release_at_arraign,
    bail_set = sub.bail_set
FROM (
    SELECT
        county_id,
        COUNT(*) AS case_count,
        SUM(CASE WHEN remanded_to_jail_at_arraign = 'Y' THEN 1 ELSE 0 END) AS remand_to_jail_count,
        SUM(CASE WHEN ror_at_arraign = 'Y' THEN 1 ELSE 0 END) AS ror_at_arraign,
        SUM(CASE WHEN nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS nmr_at_arraign,
        SUM(CASE WHEN ror_at_arraign = 'Y' OR nmr_at_arraign = 'Y' THEN 1 ELSE 0 END) AS release_at_arraign,
        SUM(CASE WHEN release_decision_at_arraign = 'Bail-set' THEN 1 ELSE 0 END) AS bail_set
    FROM cases
    GROUP BY county_id
) AS sub
WHERE counties.county_id = sub.county_id;

-- Add columns to judges table
ALTER TABLE judges ADD COLUMN total_bail_set NUMERIC DEFAULT 0;
ALTER TABLE judges ADD COLUMN average_bail_set NUMERIC DEFAULT 0;

-- Add columns to county table
ALTER TABLE counties ADD COLUMN total_bail_set NUMERIC DEFAULT 0;
ALTER TABLE counties ADD COLUMN average_bail_set NUMERIC DEFAULT 0;


-- Add percentage columns to judges table
ALTER TABLE judges ADD COLUMN percent_ror NUMERIC DEFAULT 0;
ALTER TABLE judges ADD COLUMN percent_nmr NUMERIC DEFAULT 0;
ALTER TABLE judges ADD COLUMN percent_release NUMERIC DEFAULT 0;
ALTER TABLE judges ADD COLUMN percent_remand NUMERIC DEFAULT 0;
ALTER TABLE judges ADD COLUMN percent_bail_set NUMERIC DEFAULT 0;

-- Add percentage columns to county table
ALTER TABLE counties ADD COLUMN percent_ror NUMERIC DEFAULT 0;
ALTER TABLE counties ADD COLUMN percent_nmr NUMERIC DEFAULT 0;
ALTER TABLE counties ADD COLUMN percent_release NUMERIC DEFAULT 0;
ALTER TABLE counties ADD COLUMN percent_remand NUMERIC DEFAULT 0;
ALTER TABLE counties ADD COLUMN percent_bail_set NUMERIC DEFAULT 0;

-- Update judges table with percentages
UPDATE judges
SET percent_ror = (ror_at_arraign::NUMERIC / case_count) * 100,
    percent_nmr = (nmr_at_arraign::NUMERIC / case_count) * 100,
    percent_release = (release_at_arraign::NUMERIC / case_count) * 100,
    percent_remand = (remand_to_jail_count::NUMERIC / case_count) * 100,
    percent_bail_set = (bail_set::NUMERIC / case_count) * 100
WHERE case_count > 0;

-- Update county table with percentages
UPDATE counties
SET percent_ror = (ror_at_arraign::NUMERIC / case_count) * 100,
    percent_nmr = (nmr_at_arraign::NUMERIC / case_count) * 100,
    percent_release = (release_at_arraign::NUMERIC / case_count) * 100,
    percent_remand = (remand_to_jail_count::NUMERIC / case_count) * 100,
    percent_bail_set = (bail_set::NUMERIC / case_count) * 100
WHERE case_count > 0;

-- Add unknown and percent_unknown columns to judges table
ALTER TABLE judges ADD COLUMN unknown INTEGER DEFAULT 0;
ALTER TABLE judges ADD COLUMN percent_unknown NUMERIC DEFAULT 0;

-- Add unknown and percent_unknown columns to county table
ALTER TABLE counties ADD COLUMN unknown INTEGER DEFAULT 0;
ALTER TABLE counties ADD COLUMN percent_unknown NUMERIC DEFAULT 0;


-- Update judges table with unknown and percent_unknown
UPDATE judges
SET unknown = sub.unknown,
    percent_unknown = sub.percent_unknown
FROM (
    SELECT
        judge_id,
        COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown') AS unknown,
        (COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown')::NUMERIC / COUNT(*)) * 100 AS percent_unknown
    FROM cases
    GROUP BY judge_id
) AS sub
WHERE judges.judge_id = sub.judge_id;

-- Update county table with unknown and percent_unknown
UPDATE counties
SET unknown = sub.unknown,
    percent_unknown = sub.percent_unknown
FROM (
    SELECT
        county_id,
        COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown') AS unknown,
        (COUNT(*) FILTER (WHERE release_decision_at_arraign = 'Unknown')::NUMERIC / COUNT(*)) * 100 AS percent_unknown
    FROM cases
    GROUP BY county_id
) AS sub
WHERE counties.county_id = sub.county_id;
