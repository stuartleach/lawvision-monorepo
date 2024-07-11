-- DROP ALL ROWS FROM arraignment_statistics
DELETE FROM pretrial_slim.arraignment_statistics;

-- Insert empty rows into arraignment_statistics for each judge, each stat_type, each severity, and each race
INSERT INTO pretrial_slim.arraignment_statistics (judge_id, stat_type, severity, race)
SELECT j.judge_id, s.stat_type, s.severity, r.race
FROM pretrial_slim.judges j
CROSS JOIN (
    SELECT 'remand_at_arraign' AS stat_type, s.severity
    FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
    UNION ALL
    SELECT 'ror_at_arraign' AS stat_type, s.severity
    FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
    UNION ALL
    SELECT 'nmr_at_arraign' AS stat_type, s.severity
    FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
    UNION ALL
    SELECT 'release_at_arraign' AS stat_type, s.severity
    FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
    UNION ALL
    SELECT 'bail_set_at_arraign' AS stat_type, s.severity
    FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
    UNION ALL
    SELECT 'unknown_at_arraign' AS stat_type, s.severity
    FROM (VALUES ('AF'), ('BF'), ('CF'), ('DF'), ('EF'), ('AM'), ('BM')) AS s(severity)
) AS s(stat_type, severity)
CROSS JOIN (
    VALUES
        ('Black'),
        ('American Indian/Alaskan Native'),
        ('Asian/Pacific Islander'),
        ('Other'),
        ('White'),
        ('Unknown')
) AS r(race);

-- Create the procedure to update arraignment statistics
CREATE OR REPLACE PROCEDURE update_arraignment_statistics(stat_type TEXT, condition TEXT, severity TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    EXECUTE format('
        WITH total_cases AS (
            SELECT j.judge_id, c.race, COUNT(*)::NUMERIC AS total_count
            FROM pretrial_slim.cases c
            JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
            WHERE top_charge_weight_at_arraign = %L
            GROUP BY j.judge_id, c.race
        ),
        matched_cases AS (
            SELECT j.judge_id, c.race, COUNT(*)::NUMERIC AS matched_count
            FROM pretrial_slim.cases c
            JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
            WHERE %s AND top_charge_weight_at_arraign = %L
            GROUP BY j.judge_id, c.race
        )
        MERGE INTO pretrial_slim.arraignment_statistics AS target
        USING (
            SELECT m.judge_id, m.race, %L AS stat_type, %L AS severity, m.matched_count AS count,
                   CASE WHEN t.total_count = 0 THEN 0 ELSE m.matched_count * 100.0 / t.total_count END AS percentage
            FROM matched_cases m
            JOIN total_cases t ON m.judge_id = t.judge_id AND m.race = t.race
        ) AS source
        ON target.judge_id = source.judge_id AND target.stat_type = source.stat_type AND target.severity = source.severity AND target.race = source.race
        WHEN MATCHED THEN
            UPDATE SET count = source.count, percentage = source.percentage
        WHEN NOT MATCHED THEN
            INSERT (judge_id, stat_type, severity, race, count, percentage)
            VALUES (source.judge_id, source.stat_type, source.severity, source.race, source.count, source.percentage);',
    severity, condition, severity, stat_type, severity);
END;
$$;

-- REMAND AT ARRAIGN
CALL update_arraignment_statistics('remand_at_arraign', 'remanded_to_jail_at_arraign = ''Y''', 'AF');
CALL update_arraignment_statistics('remand_at_arraign', 'remanded_to_jail_at_arraign = ''Y''', 'BF');
CALL update_arraignment_statistics('remand_at_arraign', 'remanded_to_jail_at_arraign = ''Y''', 'CF');
CALL update_arraignment_statistics('remand_at_arraign', 'remanded_to_jail_at_arraign = ''Y''', 'DF');
CALL update_arraignment_statistics('remand_at_arraign', 'remanded_to_jail_at_arraign = ''Y''', 'EF');
CALL update_arraignment_statistics('remand_at_arraign', 'remanded_to_jail_at_arraign = ''Y''', 'AM');
CALL update_arraignment_statistics('remand_at_arraign', 'remanded_to_jail_at_arraign = ''Y''', 'BM');

-- BAIL SET AT ARRAIGN
CALL update_arraignment_statistics('bail_set_at_arraign', 'release_decision_at_arraign = ''Bail-set''', 'AF');
CALL update_arraignment_statistics('bail_set_at_arraign', 'release_decision_at_arraign = ''Bail-set''', 'BF');
CALL update_arraignment_statistics('bail_set_at_arraign', 'release_decision_at_arraign = ''Bail-set''', 'CF');
CALL update_arraignment_statistics('bail_set_at_arraign', 'release_decision_at_arraign = ''Bail-set''', 'DF');
CALL update_arraignment_statistics('bail_set_at_arraign', 'release_decision_at_arraign = ''Bail-set''', 'EF');
CALL update_arraignment_statistics('bail_set_at_arraign', 'release_decision_at_arraign = ''Bail-set''', 'AM');
CALL update_arraignment_statistics('bail_set_at_arraign', 'release_decision_at_arraign = ''Bail-set''', 'BM');

-- ROR AT ARRAIGN
CALL update_arraignment_statistics('ror_at_arraign', 'ror_at_arraign = ''Y''', 'AF');
CALL update_arraignment_statistics('ror_at_arraign', 'ror_at_arraign = ''Y''', 'BF');
CALL update_arraignment_statistics('ror_at_arraign', 'ror_at_arraign = ''Y''', 'CF');
CALL update_arraignment_statistics('ror_at_arraign', 'ror_at_arraign = ''Y''', 'DF');
CALL update_arraignment_statistics('ror_at_arraign', 'ror_at_arraign = ''Y''', 'EF');
CALL update_arraignment_statistics('ror_at_arraign', 'ror_at_arraign = ''Y''', 'AM');
CALL update_arraignment_statistics('ror_at_arraign', 'ror_at_arraign = ''Y''', 'BM');

-- NMR AT ARRAIGN
CALL update_arraignment_statistics('nmr_at_arraign', 'nmr_at_arraign = ''Y''', 'AF');
CALL update_arraignment_statistics('nmr_at_arraign', 'nmr_at_arraign = ''Y''', 'BF');
CALL update_arraignment_statistics('nmr_at_arraign', 'nmr_at_arraign = ''Y''', 'CF');
CALL update_arraignment_statistics('nmr_at_arraign', 'nmr_at_arraign = ''Y''', 'DF');
CALL update_arraignment_statistics('nmr_at_arraign', 'nmr_at_arraign = ''Y''', 'EF');
CALL update_arraignment_statistics('nmr_at_arraign', 'nmr_at_arraign = ''Y''', 'AM');
CALL update_arraignment_statistics('nmr_at_arraign', 'nmr_at_arraign = ''Y''', 'BM');

-- RELEASE AT ARRAIGN
CALL update_arraignment_statistics('release_at_arraign', 'nmr_at_arraign = ''Y'' OR ror_at_arraign = ''Y''', 'AF');
CALL update_arraignment_statistics('release_at_arraign', 'nmr_at_arraign = ''Y'' OR ror_at_arraign = ''Y''', 'BF');
CALL update_arraignment_statistics('release_at_arraign', 'nmr_at_arraign = ''Y'' OR ror_at_arraign = ''Y''', 'CF');
CALL update_arraignment_statistics('release_at_arraign', 'nmr_at_arraign = ''Y'' OR ror_at_arraign = ''Y''', 'DF');
CALL update_arraignment_statistics('release_at_arraign', 'nmr_at_arraign = ''Y'' OR ror_at_arraign = ''Y''', 'EF');
CALL update_arraignment_statistics('release_at_arraign', 'nmr_at_arraign = ''Y'' OR ror_at_arraign = ''Y''', 'AM');
CALL update_arraignment_statistics('release_at_arraign', 'nmr_at_arraign = ''Y'' OR ror_at_arraign = ''Y''', 'BM');

-- UNKNOWN AT ARRAIGN
CALL update_arraignment_statistics('unknown_at_arraign', 'release_decision_at_arraign = ''Unknown''', 'AF');
CALL update_arraignment_statistics('unknown_at_arraign', 'release_decision_at_arraign = ''Unknown''', 'BF');
CALL update_arraignment_statistics('unknown_at_arraign', 'release_decision_at_arraign = ''Unknown''', 'CF');
CALL update_arraignment_statistics('unknown_at_arraign', 'release_decision_at_arraign = ''Unknown''', 'DF');
CALL update_arraignment_statistics('unknown_at_arraign', 'release_decision_at_arraign = ''Unknown''', 'EF');
CALL update_arraignment_statistics('unknown_at_arraign', 'release_decision_at_arraign = ''Unknown''', 'AM');
CALL update_arraignment_statistics('unknown_at_arraign', 'release_decision_at_arraign = ''Unknown''', 'BM');
