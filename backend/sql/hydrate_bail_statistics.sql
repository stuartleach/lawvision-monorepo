-- Merge bail statistics for overall
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'ALL' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);

-- Example for severity 'AF'
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'AF' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
      AND top_charge_weight_at_arraign = 'AF'
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);


-- Example for severity 'BF'
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'BF' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
      AND top_charge_weight_at_arraign = 'BF'
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);

-- Example for severity 'CF'
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'CF' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
      AND top_charge_weight_at_arraign = 'CF'
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);

-- Example for severity 'DF'
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'DF' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
      AND top_charge_weight_at_arraign = 'DF'
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);

-- Example for severity 'EF'
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'EF' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
      AND top_charge_weight_at_arraign = 'EF'
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);

-- Example for severity 'AM'
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'AM' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
      AND top_charge_weight_at_arraign = 'AM'
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);

-- Example for severity 'BM'
MERGE INTO pretrial_slim.bail_statistics AS bs
USING (
    SELECT j.judge_id,
           SUM(CAST(first_bail_set_cash AS NUMERIC)) AS total_bail_set,
           AVG(CAST(first_bail_set_cash AS NUMERIC)) AS average_bail_set,
           'BM' AS severity
    FROM pretrial_slim.cases c
    JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
    WHERE CAST(first_bail_set_cash AS NUMERIC) > 1
      AND CAST(first_bail_set_cash AS NUMERIC) < 9999999
      AND top_charge_weight_at_arraign = 'BM'
    GROUP BY j.judge_id
) AS src
ON bs.judge_id = src.judge_id AND bs.severity = src.severity
WHEN MATCHED THEN
    UPDATE SET total_bail_set = src.total_bail_set, average_bail_set = src.average_bail_set
WHEN NOT MATCHED THEN
    INSERT (judge_id, total_bail_set, average_bail_set, severity)
    VALUES (src.judge_id, src.total_bail_set, src.average_bail_set, src.severity);
