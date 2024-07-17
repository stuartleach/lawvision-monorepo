import { Case } from '@prisma/client';

import { CaseSelection } from './utils'; // Import the Case type

export const filterByRace = (cases: CaseSelection[], raceName: string) => cases.filter(c => c.Defendant?.race === raceName);
export const filterByNotRace = (cases: CaseSelection[], raceName: string) => cases.filter(c => c.Defendant?.race !== raceName);
export const filterBailSetCases = (cases: CaseSelection[]) => cases.filter(c => c.Bail && Number(c.Bail?.first_bail_set_cash) > 1);
export const filterRemandedCases = (cases: CaseSelection[]) => cases.filter(c => c.ArraignmentOutcome?.remanded_to_jail_at_arraign === 'Y');
export const filterReleasedCases = (cases: CaseSelection[]) => cases.filter(c => c.ArraignmentOutcome?.ror_at_arraign === 'Y' || c.ArraignmentOutcome?.nmr_at_arraign === 'Y');
