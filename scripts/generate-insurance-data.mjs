import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the types and enums that match the TypeScript definitions
const PLAN_CATEGORIES = ['Primary', 'Secondary'];
const CLAIM_STATUSES = ['PAID', 'NCOF - RESUBMITTED', 'PENDING', 'DENIED', 'PROCESSING'];
const SYNC_STATUSES = ['Synced', 'Not synced', 'Syncing', 'Error'];

// Common insurance carrier names for realism
const INSURANCE_CARRIERS = [
  'Blue Cross Blue Shield',
  'Aetna',
  'Cigna',
  'UnitedHealthcare',
  'Anthem',
  'Humana',
  'Kaiser Permanente',
  'Molina Healthcare',
  'Centene',
  'Independence Blue Cross'
];

// Generate a realistic time string in 12-hour format
function generateTimeString() {
  const hour = faker.number.int({ min: 1, max: 12 });
  const minute = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');
  const ampm = faker.helpers.arrayElement(['AM', 'PM']);
  return `${hour}:${minute} ${ampm}`;
}

// Generate a realistic currency amount
function generateCurrencyAmount() {
  const amount = faker.number.float({ 
    min: 50, 
    max: 15000, 
    precision: 0.01 
  }).toFixed(2);
  return `$${amount}`;
}

// Generate PMS sync status with realistic descriptions
function generatePmsSyncStatus() {
  const status = faker.helpers.arrayElement(SYNC_STATUSES);
  let description = '';
  let isSynced = false;

  switch (status) {
    case 'Synced':
      description = 'Successfully synced to PMS';
      isSynced = true;
      break;
    case 'Not synced':
      description = faker.helpers.arrayElement([
        'Pending manual review',
        'Waiting for authorization',
        'Missing required fields'
      ]);
      break;
    case 'Syncing':
      description = 'Currently syncing...';
      break;
    case 'Error':
      description = faker.helpers.arrayElement([
        'Connection timeout',
        'Invalid patient ID',
        'System maintenance',
        'Authentication failed'
      ]);
      break;
  }

  return { status, description, isSynced };
}

// Generate user initials (2-3 characters)
function generateUserInitials() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const middleInitial = faker.datatype.boolean() ? faker.person.middleName().charAt(0) : '';
  
  return middleInitial 
    ? `${firstName.charAt(0)}${middleInitial}${lastName.charAt(0)}`
    : `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

// Generate a single insurance claim record
function generateClaimRecord() {
  const serviceDate = faker.date.recent({ days: 180 });
  const sentDate = faker.date.between({ 
    from: serviceDate, 
    to: new Date() 
  });
  const originalSentDate = faker.datatype.boolean() 
    ? faker.date.between({ from: serviceDate, to: sentDate })
    : sentDate;

  return {
    patient: {
      name: faker.person.fullName(),
      id: `PAT-${faker.number.int({ min: 10000, max: 99999 })}`
    },
    serviceDate: serviceDate.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    }),
    insuranceCarrier: {
      carrierName: faker.helpers.arrayElement(INSURANCE_CARRIERS),
      planCategory: faker.helpers.arrayElement(PLAN_CATEGORIES)
    },
    amount: generateCurrencyAmount(),
    status: faker.helpers.arrayElement(CLAIM_STATUSES),
    lastUpdated: {
      date: faker.date.recent({ days: 30 }).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      time: generateTimeString()
    },
    user: generateUserInitials(),
    dateSent: sentDate.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    }),
    dateSentOrig: originalSentDate.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    }),
    pmsSyncStatus: generatePmsSyncStatus(),
    provider: {
      name: `${faker.person.lastName()} ${faker.helpers.arrayElement(['Medical Group', 'Healthcare', 'Clinic', 'Associates', 'Family Practice'])}`,
      id: `PROV-${faker.number.int({ min: 1000, max: 9999 })}`
    }
  };
}

// Generate the full dataset
function generateInsuranceData() {
  console.log('🏥 Generating insurance claims data...');
  
  const data = [];
  const targetCount = 300;
  
  for (let i = 0; i < targetCount; i++) {
    data.push(generateClaimRecord());
    
    // Show progress every 50 records
    if ((i + 1) % 50 === 0) {
      console.log(`✓ Generated ${i + 1}/${targetCount} records`);
    }
  }
  
  // Ensure output directory exists
  const outputDir = path.join(path.dirname(__dirname), 'src', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the data to a TypeScript file for better type safety
  const tsContent = `// Auto-generated insurance claims data
// Generated on: ${new Date().toISOString()}
// Total records: ${data.length}

import { ClaimRowData } from '../components/ClaimRow';

export const insuranceClaimsData: ClaimRowData[] = ${JSON.stringify(data, null, 2)};

export default insuranceClaimsData;
`;
  
  const outputPath = path.join(outputDir, 'insurance-data.ts');
  fs.writeFileSync(outputPath, tsContent);
  
  console.log(`✅ Successfully generated ${data.length} insurance claims records`);
  console.log(`📁 Data saved to: ${outputPath}`);
  console.log(`📊 Data distribution:`);
  
  // Show some statistics
  const statusCounts = data.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {});
  
  const syncCounts = data.reduce((acc, record) => {
    acc[record.pmsSyncStatus.status] = (acc[record.pmsSyncStatus.status] || 0) + 1;
    return acc;
  }, {});
  
  console.log('   Claim Statuses:', statusCounts);
  console.log('   Sync Statuses:', syncCounts);
  
  return data;
}

// Run the generator
generateInsuranceData();
