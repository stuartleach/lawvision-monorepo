/*
  Warnings:

  - You are about to drop the column `arraign_charge_category` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `case_type` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `hate_crime_ind` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `top_arraign_article_section` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `top_arraign_attempt_indicator` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `top_arraign_law` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `top_charge_at_arraign` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `top_charge_at_arraign_violent_felony_ind` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `top_charge_weight_at_arraign` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `top_severity_at_arraign` on the `arraignments` table. All the data in the column will be lost.
  - You are about to drop the column `judge_name` on the `courts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[representation_type,app_count_arraign_to_dispo_released,app_count_arraign_to_dispo_detained,app_count_arraign_to_dispo_total,def_attended_sched_pretrials,remanded_to_jail_at_arraign,ror_at_arraign,bail_set_and_posted_at_arraign,bail_set_and_not_posted_at_arraign,nmr_at_arraign,release_decision_at_arraign,representation_at_securing_order]` on the table `appearances` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[county_name]` on the table `counties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[court_name]` on the table `courts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[court_name,court_ori,county_name,district,region,court_type]` on the table `courts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gender,race,ethnicity,age_at_crime,age_at_arrest]` on the table `defendants` will be added. If there are existing duplicate values, this will fail.
  - Made the column `case_count` on table `judges` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pretrial_slim"."arraignments" DROP COLUMN "arraign_charge_category",
DROP COLUMN "case_type",
DROP COLUMN "hate_crime_ind",
DROP COLUMN "top_arraign_article_section",
DROP COLUMN "top_arraign_attempt_indicator",
DROP COLUMN "top_arraign_law",
DROP COLUMN "top_charge_at_arraign",
DROP COLUMN "top_charge_at_arraign_violent_felony_ind",
DROP COLUMN "top_charge_weight_at_arraign",
DROP COLUMN "top_severity_at_arraign",
ADD COLUMN     "arraignChargeArraign_charge_id" UUID;

-- AlterTable
ALTER TABLE "pretrial_slim"."cases" ADD COLUMN     "arrest_id" UUID,
ADD COLUMN     "raceRace_id" UUID;

-- AlterTable
ALTER TABLE "pretrial_slim"."courts" DROP COLUMN "judge_name";

-- AlterTable
ALTER TABLE "pretrial_slim"."defendants" ADD COLUMN     "case_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "race" DROP NOT NULL,
ALTER COLUMN "ethnicity" DROP NOT NULL,
ALTER COLUMN "age_at_crime" DROP NOT NULL,
ALTER COLUMN "age_at_arrest" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pretrial_slim"."judges" ALTER COLUMN "case_count" SET NOT NULL;

-- AlterTable
ALTER TABLE "pretrial_slim"."races" ADD COLUMN     "case_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "pretrial_slim"."arraign_charges" (
    "arraign_charge_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "case_type" TEXT,
    "top_arraign_law" TEXT,
    "top_arraign_article_section" TEXT,
    "top_arraign_attempt_indicator" TEXT,
    "top_charge_at_arraign" TEXT,
    "top_severity_at_arraign" TEXT,
    "top_charge_weight_at_arraign" TEXT,
    "top_charge_at_arraign_violent_felony_ind" TEXT,
    "hate_crime_ind" TEXT,
    "arraign_charge_category" TEXT,

    CONSTRAINT "arraign_charges_pkey" PRIMARY KEY ("arraign_charge_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appearances_representation_type_app_count_arraign_to_dispo__key" ON "pretrial_slim"."appearances"("representation_type", "app_count_arraign_to_dispo_released", "app_count_arraign_to_dispo_detained", "app_count_arraign_to_dispo_total", "def_attended_sched_pretrials", "remanded_to_jail_at_arraign", "ror_at_arraign", "bail_set_and_posted_at_arraign", "bail_set_and_not_posted_at_arraign", "nmr_at_arraign", "release_decision_at_arraign", "representation_at_securing_order");

-- CreateIndex
CREATE UNIQUE INDEX "counties_county_name_key1" ON "pretrial_slim"."counties"("county_name");

-- CreateIndex
CREATE UNIQUE INDEX "courts_court_name_key1" ON "pretrial_slim"."courts"("court_name");

-- CreateIndex
CREATE UNIQUE INDEX "courts_court_name_court_ori_county_name_district_region_cou_key" ON "pretrial_slim"."courts"("court_name", "court_ori", "county_name", "district", "region", "court_type");

-- CreateIndex
CREATE UNIQUE INDEX "defendants_gender_race_ethnicity_age_at_crime_age_at_arrest_key" ON "pretrial_slim"."defendants"("gender", "race", "ethnicity", "age_at_crime", "age_at_arrest");

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_arrest_id_fkey" FOREIGN KEY ("arrest_id") REFERENCES "pretrial_slim"."arrests"("arrest_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_raceRace_id_fkey" FOREIGN KEY ("raceRace_id") REFERENCES "pretrial_slim"."races"("race_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."arraignments" ADD CONSTRAINT "arraignments_arraignChargeArraign_charge_id_fkey" FOREIGN KEY ("arraignChargeArraign_charge_id") REFERENCES "pretrial_slim"."arraign_charges"("arraign_charge_id") ON DELETE SET NULL ON UPDATE CASCADE;
