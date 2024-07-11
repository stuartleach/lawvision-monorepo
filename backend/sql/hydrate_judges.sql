-- Insert unique judges if they don't already exist
INSERT INTO pretrial_slim.judges (judge_name, primary_county)
SELECT DISTINCT judge_name, county_name
FROM (SELECT judge_name, county_name, ROW_NUMBER() OVER (PARTITION BY judge_name ORDER BY county_name) AS rn
      FROM pretrial_slim.cases) sub
WHERE rn = 1
ON CONFLICT (judge_name) DO NOTHING;

-- Update total cases for each judge
UPDATE pretrial_slim.judges j
SET case_count = sub.case_count
FROM (SELECT judge_name, COUNT(*) AS case_count
      FROM pretrial_slim.cases
      GROUP BY judge_name) sub
WHERE j.judge_name = sub.judge_name;


-- Insert empty rows into bail_statistics for each judge and each severity
INSERT INTO pretrial_slim.bail_statistics (judge_id, severity)
SELECT j.judge_id, s.severity
FROM pretrial_slim.judges j
         CROSS JOIN (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity);

--
-- -- Insert empty rows into arraignment_statistics for each judge and each stat_type and severity
-- INSERT INTO pretrial_slim.arraignment_statistics (judge_id, stat_type, severity)
-- SELECT j.judge_id, s.stat_type, s.severity
-- FROM pretrial_slim.judges j
-- CROSS JOIN (
--     SELECT 'remand_at_arraign' AS stat_type, s.severity
--     FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
--     UNION ALL
--     SELECT 'ror_at_arraign' AS stat_type, s.severity
--     FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
--     UNION ALL
--     SELECT 'nmr_at_arraign' AS stat_type, s.severity
--     FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
--     UNION ALL
--     SELECT 'release_at_arraign' AS stat_type, s.severity
--     FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
--     UNION ALL
--     SELECT 'bail_set_at_arraign' AS stat_type, s.severity
--     FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
--     UNION ALL
--     SELECT 'unknown_at_arraign' AS stat_type, s.severity
--     FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
-- ) AS s(stat_type, severity);


