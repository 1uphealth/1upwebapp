const fhirVersions = {
  DSTU2: 'dstu2',
  STU3: 'stu3',
  R4: 'r4',
};

const availableResources = [
  {
    resourceType: 'AllergyIntolerance',
    resourceVersions: [fhirVersions.DSTU2],
  },
  {
    resourceType: 'Condition',
    resourceVersions: [fhirVersions.DSTU2],
  },
  {
    resourceType: 'Coverage',
    resourceVersions: [fhirVersions.STU3],
  },
  {
    resourceType: 'Encounter',
    resourceVersions: [fhirVersions.DSTU2],
  },
  {
    resourceType: 'ExplanationOfBenefit',
    resourceVersions: [fhirVersions.STU3],
  },
  {
    resourceType: 'MedicationOrder',
    resourceVersions: [fhirVersions.DSTU2, fhirVersions.STU3],
  },
  {
    resourceType: 'MedicationDispense',
    resourceVersions: [fhirVersions.STU3],
  },
  {
    resourceType: 'MedicationStatement',
    resourceVersions: [fhirVersions.STU3],
  },
  {
    resourceType: 'Observation',
    resourceVersions: [fhirVersions.DSTU2],
  },
  {
    resourceType: 'Patient',
    resourceVersions: [fhirVersions.DSTU2, fhirVersions.STU3],
  },
  {
    resourceType: 'ReferralRequest',
    resourceVersions: [fhirVersions.STU3],
  },
];

const displayInOrder = [
  'Patient',
  'Practitioner',
  'AllergyIntolerance',
  'MedicationOrder',
  'MedicationStatement',
  'Condition',
  'Observation',
  'FamilyMemberHistory',
  'DiagnosticReport',
  'Immunization',
  'Encounter',
  'CarePlan',
  'Goal',
  'Procedure',
  'Device',
  'DocumentReference',
  'Binary',
];

module.exports = {
  availableResources,
  fhirVersions,
  displayInOrder,
};
