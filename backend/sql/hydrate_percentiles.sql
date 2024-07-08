CREATE OR REPLACE PROCEDURE update_percentiles(percentile_type TEXT, condition TEXT, severity TEXT, group_by_column TEXT, is_numeric BOOLEAN)
LANGUAGE plpgsql
AS $$
BEGIN
    IF is_numeric THEN
        EXECUTE format('
            MERGE INTO pretrial_slim.percentiles AS target
            USING (
                SELECT j.judge_id, %L AS percentile_type, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CAST(%I AS NUMERIC)) AS percentile_value
                FROM pretrial_slim.cases c
                JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
                WHERE %s AND top_charge_weight_at_arraign = %L
                GROUP BY j.judge_id
            ) AS source
            ON target.judge_id = source.judge_id AND target.percentile_type = source.percentile_type
            WHEN MATCHED THEN
                UPDATE SET percentile_value = source.percentile_value
            WHEN NOT MATCHED THEN
                INSERT (judge_id, percentile_type, percentile_value)
                VALUES (source.judge_id, source.percentile_type, source.percentile_value);',
            percentile_type, group_by_column, condition, severity);
    ELSE
        EXECUTE format('
            MERGE INTO pretrial_slim.percentiles AS target
            USING (
                SELECT j.judge_id, %L AS percentile_type, AVG(CASE WHEN %s THEN 1 ELSE 0 END) AS percentile_value
                FROM pretrial_slim.cases c
                JOIN pretrial_slim.judges j ON c.judge_name = j.judge_name
                WHERE top_charge_weight_at_arraign = %L
                GROUP BY j.judge_id
            ) AS source
            ON target.judge_id = source.judge_id AND target.percentile_type = source.percentile_type
            WHEN MATCHED THEN
                UPDATE SET percentile_value = source.percentile_value
            WHEN NOT MATCHED THEN
                INSERT (judge_id, percentile_type, percentile_value)
                VALUES (source.judge_id, source.percentile_type, source.percentile_value);',
            percentile_type, condition, severity);
    END IF;
END;
$$;

-- Calculate and update percentiles for state bail set percentage by severity 'AF'
CALL update_percentiles('state_bail_set_percentage_AF',
                        'CAST(first_bail_set_cash AS NUMERIC) > 1 AND CAST(first_bail_set_cash AS NUMERIC) < 9999999',
                        'AF', 'first_bail_set_cash');

-- Repeat for other severities
CALL update_percentiles('state_bail_set_percentage_BF',
                        'CAST(first_bail_set_cash AS NUMERIC) > 1 AND CAST(first_bail_set_cash AS NUMERIC) < 9999999',
                        'BF', 'first_bail_set_cash');
CALL update_percentiles('state_bail_set_percentage_CF',
                        'CAST(first_bail_set_cash AS NUMERIC) > 1 AND CAST(first_bail_set_cash AS NUMERIC) < 9999999',
                        'CF', 'first_bail_set_cash');
CALL update_percentiles('state_bail_set_percentage_DF',
                        'CAST(first_bail_set_cash AS NUMERIC) > 1 AND CAST(first_bail_set_cash AS NUMERIC) < 9999999',
                        'DF', 'first_bail_set_cash');
CALL update_percentiles('state_bail_set_percentage_EF',
                        'CAST(first_bail_set_cash AS NUMERIC) > 1 AND CAST(first_bail_set_cash AS NUMERIC) < 9999999',
                        'EF', 'first_bail_set_cash');
CALL update_percentiles('state_bail_set_percentage_AM',
                        'CAST(first_bail_set_cash AS NUMERIC) > 1 AND CAST(first_bail_set_cash AS NUMERIC) < 9999999',
                        'AM', 'first_bail_set_cash');
CALL update_percentiles('state_bail_set_percentage_BM',
                        'CAST(first_bail_set_cash AS NUMERIC) > 1 AND CAST(first_bail_set_cash AS NUMERIC) < 9999999',
                        'BM', 'first_bail_set_cash');

CALL update_percentiles('state_remand_at_arraign_percentage_AF', 'remanded_to_jail_at_arraign = ''Y''', 'AF',
                        'remanded_to_jail_at_arraign', FALSE);
CALL update_percentiles('state_remand_at_arraign_percentage_BF', 'remanded_to_jail_at_arraign = ''Y''', 'BF',
                        'remanded_to_jail_at_arraign', FALSE);
CALL update_percentiles('state_remand_at_arraign_percentage_CF', 'remanded_to_jail_at_arraign = ''Y''', 'CF',
                        'remanded_to_jail_at_arraign', FALSE);
CALL update_percentiles('state_remand_at_arraign_percentage_DF', 'remanded_to_jail_at_arraign = ''Y''', 'DF',
                        'remanded_to_jail_at_arraign', FALSE);
CALL update_percentiles('state_remand_at_arraign_percentage_EF', 'remanded_to_jail_at_arraign = ''Y''', 'EF',
                        'remanded_to_jail_at_arraign', FALSE);
CALL update_percentiles('state_remand_at_arraign_percentage_AM', 'remanded_to_jail_at_arraign = ''Y''', 'AM',
                        'remanded_to_jail_at_arraign', FALSE);
CALL update_percentiles('state_remand_at_arraign_percentage_BM', 'remanded_to_jail_at_arraign = ''Y''', 'BM',
                        'remanded_to_jail_at_arraign', FALSE);

CALL update_percentiles('state_ror_at_arraign_percentage_AF', 'ror_at_arraign = ''Y''', 'AF',
                        'ror_at_arraign', FALSE);
CALL update_percentiles('state_ror_at_arraign_percentage_BF', 'ror_at_arraign = ''Y''', 'BF',
                        'ror_at_arraign', FALSE);
CALL update_percentiles('state_ror_at_arraign_percentage_CF', 'ror_at_arraign = ''Y''', 'CF',
                        'ror_at_arraign', FALSE);
CALL update_percentiles('state_ror_at_arraign_percentage_DF', 'ror_at_arraign = ''Y''', 'DF',
                        'ror_at_arraign', FALSE);
CALL update_percentiles('state_ror_at_arraign_percentage_EF', 'ror_at_arraign = ''Y''', 'EF',
                        'ror_at_arraign', FALSE);
CALL update_percentiles('state_ror_at_arraign_percentage_AM', 'ror_at_arraign = ''Y''', 'AM',
                        'ror_at_arraign', FALSE);
CALL update_percentiles('state_ror_at_arraign_percentage_BM', 'ror_at_arraign = ''Y''', 'BM',
                        'ror_at_arraign', FALSE);

CALL update_percentiles('state_nmr_at_arraign_percentage_AF', 'nmr_at_arraign = ''Y''', 'AF',
                        'nmr_at_arraign', FALSE);
CALL update_percentiles('state_nmr_at_arraign_percentage_BF', 'nmr_at_arraign = ''Y''', 'BF',
                        'nmr_at_arraign', FALSE);
CALL update_percentiles('state_nmr_at_arraign_percentage_CF', 'nmr_at_arraign = ''Y''', 'CF',
                        'nmr_at_arraign', FALSE);
CALL update_percentiles('state_nmr_at_arraign_percentage_DF', 'nmr_at_arraign = ''Y''', 'DF',
                        'nmr_at_arraign', FALSE);
CALL update_percentiles('state_nmr_at_arraign_percentage_EF', 'nmr_at_arraign = ''Y''', 'EF',
                        'nmr_at_arraign', FALSE);
CALL update_percentiles('state_nmr_at_arraign_percentage_AM', 'nmr_at_arraign = ''Y''', 'AM',
                        'nmr_at_arraign', FALSE);
CALL update_percentiles('state_nmr_at_arraign_percentage_BM', 'nmr_at_arraign = ''Y''', 'BM',
                        'nmr_at_arraign', FALSE);
