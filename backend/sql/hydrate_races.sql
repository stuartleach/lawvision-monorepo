-- Insert unique judges if they don't already exist
INSERT INTO pretrial_slim.races (race_name)
SELECT DISTINCT race
FROM pretrial_slim.cases

