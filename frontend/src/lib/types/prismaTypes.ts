import type { CaseStats } from '$lib/types/types';

export type CountyModel = {
	countyUuid: string;
	countyName: string;
	averageBailSet?: number;
	caseCount?: number;
	medianIncome?: number;
	medianId?: string;
	casesBailSet?: number;
	casesRemand?: number;
	casesRor?: number;
	casesUnknown?: number;
	casesNmr?: number;
}

export type JudgeModel = {
	judgeName: string;
	judgeUuid: string;
	averageBailSet?: number;
	uniqueDistricts: string[];
	caseCount?: number;
	counties: string[];
	courtNames: string[];
	dispositionTypes: string[];
	remandToJailCount?: number;
	rorCount?: number;
	bailSetAndPostedCount?: number;
	bailSetAndNotPostedCount?: number;
	supervisionConditions: string[];
	averageSentenceSeverity?: number;
	rearrestRate?: number;
	casesBailSet?: number;
	casesRemand?: number;
	casesRor?: number;
	casesUnknown?: number;
	casesNmr?: number;
}

export type JudgeModelOrCountyModel = {
	averageBailSet?: number;
	caseCount?: number;
	casesBailSet?: number;
	casesRemand?: number;
	casesRor?: number;
	casesUnknown?: number;
	casesNmr?: number;
}


export type CaseModel = {
	internalCaseId: string;
	gender?: string;
	ethnicity?: string;
	ageAtCrime?: number;
	ageAtArrest?: number;
	offenseMonth?: string;
	offenseYear?: string;
	arrestMonth?: string;
	arrestYear?: string;
	arrestType?: string;
	topArrestLaw?: string;
	topArrestArticleSection?: string;
	topArrestAttemptIndicator?: string;
	topChargeSeverityAtArrest?: string;
	topChargeWeightAtArrest?: string;
	topChargeAtArrestViolentFelonyInd?: string;
	caseType?: string;
	firstArraignDate?: string;
	topArraignLaw?: string;
	topArraignArticleSection?: string;
	topArraignAttemptIndicator?: string;
	topChargeAtArraign?: string;
	topSeverityAtArraign?: string;
	topChargeWeightAtArraign?: string;
	topChargeAtArraignViolentFelonyInd?: string;
	arraignChargeCategory?: string;
	appCountArraignToDispoReleased?: string;
	appCountArraignToDispoDetained?: string;
	appCountArraignToDispoTotal?: string;
	defAttendedSchedPretrials?: string;
	remandedToJailAtArraign?: string;
	rorAtArraign?: string;
	bailSetAndPostedAtArraign?: string;
	bailSetAndNotPostedAtArraign?: string;
	nmrAtArraign?: string;
	releaseDecisionAtArraign?: string;
	representationAtSecuringOrder?: string;
	pretrialSupervisionAtArraign?: string;
	contactPretrialServiceAgency?: string;
	electronicMonitoring?: string;
	travelRestrictions?: string;
	passportSurrender?: string;
	noFirearmsOrWeapons?: string;
	maintainEmployment?: string;
	maintainHousing?: string;
	maintainSchool?: string;
	placementInMandatoryProgram?: string;
	removalToHospital?: string;
	obeyOrderOfProtection?: string;
	obeyCourtConditionsFamilyOffense?: string;
	otherNmr?: string;
	orderOfProtection?: string;
	firstBailSetCash?: string;
	firstBailSetCredit?: string;
	firstInsuranceCompanyBailBond?: string;
	firstSecuredSuretyBond?: string;
	firstSecuredAppBond?: string;
	firstUnsecuredSuretyBond?: string;
	firstUnsecuredAppBond?: string;
	firstPartiallySecuredSuretyBond?: string;
	partiallySecuredSuretyBondPerc?: string;
	firstPartiallySecuredAppBond?: string;
	partiallySecuredAppBondPerc?: string;
	bailMadeIndicator?: string;
	warrantOrderedBtwArraignAndDispo?: string;
	datWoWsPriorToArraign?: string;
	firstBenchWarrantDate?: string;
	nonStayedWo?: string;
	numOfStayedWo?: string;
	numOfRow?: string;
	docketStatus?: string;
	dispositionType?: string;
	dispositionDetail?: string;
	dismissalReason?: string;
	dispositionDate?: string;
	mostSevereSentence?: string;
	topConvictionLaw?: string;
	topConvictionArticleSection?: string;
	topConvictionAttemptIndicator?: string;
	topChargeAtConviction?: string;
	topChargeSeverityAtConviction?: string;
	topChargeWeightAtConviction?: string;
	topChargeAtConvictionViolentFelonyInd?: string;
	daysArraignRemandFirstReleased?: string;
	knownDaysInCustody?: string;
	daysArraignBailSetToFirstPosted?: string;
	daysArraignBailSetToFirstRelease?: string;
	daysArraignToDispo?: string;
	ucmslivedate?: string;
	priorVfoCnt?: string;
	priorNonvfoCnt?: string;
	priorMisdCnt?: string;
	pendVfo?: string;
	pendNonvfo?: string;
	pendMisd?: string;
	supervision?: string;
	rearrest?: string;
	rearrestDate?: string;
	rearrestFirearm?: string;
	rearrestDateFirearm?: string;
	arrCycleId?: string;
	raceId?: string;
	courtId?: string;
	countyId?: string;
	topChargeId?: string;
	representationId?: string;
	judgeId?: string;
	caseUuid: string;
	districtId?: string;
	counties?: CountyModel;
	courts?: CourtModel;
	districts?: DistrictModel;
	judges?: JudgeModel;
	races?: RaceModel;
	representation?: RepresentationModel;
	crimes?: CrimeModel;
}

export type CourtModel = {
	courtUuid: string;
	courtName: string;
	courtOri?: string;
	district?: string;
	region?: string;
	courtType?: string;
	averageBailAmount?: number;
	numberOfCases?: number;
}

export type CrimeModel = {
	crimeUuid: string;
	topChargeAtArrest: string;
	averageBailAmount?: number;
	numberOfCases?: number;
}

export type DistrictModel = {
	districtUuid: string;
	districtName: string;
	region?: string;
	countyId?: string;
}

export type RaceModel = {
	raceUuid: string;
	race: string;
	averageBailAmount?: number;
	numberOfCases?: number;
	averageKnownDaysInCustody?: number;
	remandedPercentage?: number;
	bailSetPercentage?: number;
	disposedAtArraignPercentage?: number;
	rorPercentage?: number;
	nonmonetaryReleasePercentage?: number;
}

export type RepresentationModel = {
	representationUuid: string;
	representationType: string;
	averageBailAmount?: number;
	numberOfCases?: number;
	averageKnownDaysInCustody?: number;
	remandedPercentage?: number;
	bailSetPercentage?: number;
	disposedAtArraignPercentage?: number;
	rorPercentage?: number;
	nonmonetaryReleasePercentage?: number;
}
