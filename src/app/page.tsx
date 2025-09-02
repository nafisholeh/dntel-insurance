import DataTable, { TableColumn } from "../components/DataTable";
import { ClaimRowData } from "../components/ClaimRow";

export default function Home() {
  // Define columns with exact widths from your design
  const columns: TableColumn[] = [
    { key: 'patient', label: 'Patient', width: '72px' },
    { key: 'serviceDate', label: 'Service Date', width: '92px' },
    { key: 'insuranceCarrier', label: 'Insurance Carrier', width: '141px' },
    { key: 'amount', label: 'Amount', width: '49px' },
    { key: 'status', label: 'Status', width: '126px' },
    { key: 'lastUpdated', label: 'Last Updated', width: '92px' },
    { key: 'user', label: 'User', width: '30px' },
    { key: 'dateSent', label: 'Date Sent', width: '92px' },
    { key: 'dateSentOrig', label: 'Date Sent Orig', width: '91px' },
    { key: 'pmsSyncStatus', label: 'PMS Sync Status', width: '121px' },
    { key: 'provider', label: 'Provider', width: '95px' },
  ];

  const data: ClaimRowData[] = [
    {
      patient: {
        name: 'First Last',
        id: '11060'
      },
      serviceDate: 'July 00, 2025',
      insuranceCarrier: {
        carrierName: 'BCBS OF COLORADO FEP PPO INN',
        planCategory: 'Primary'
      },
      amount: '$00,000',
      status: 'NCOF - RESUBMITTED',
      lastUpdated: {
        date: 'May 28, 2030',
        time: '11:36 AM'
      },
      user: 'AA',
      dateSent: 'Aug 28, 2025',
      dateSentOrig: 'Aug 28, 2025',
      pmsSyncStatus: {
        status: 'Not synced',
        description: 'Status modified today',
        isSynced: false
      },
      provider: {
        name: 'Dr. First Last',
        id: '56712349911'
      }
    },
    {
      patient: {
        name: 'Jane Doe',
        id: '22051'
      },
      serviceDate: 'Aug 15, 2025',
      insuranceCarrier: {
        carrierName: 'AETNA PPO NETWORK',
        planCategory: 'Primary'
      },
      amount: '$150.00',
      status: 'PAID',
      lastUpdated: {
        date: 'Sep 01, 2025',
        time: '02:15 PM'
      },
      user: 'JD',
      dateSent: 'Aug 20, 2025',
      dateSentOrig: 'Aug 20, 2025',
      pmsSyncStatus: {
        status: 'Synced',
        description: 'Last sync: 2 hours ago',
        isSynced: true
      },
      provider: {
        name: 'Dr. Jane Smith',
        id: '98765432101'
      }
    },
    {
      patient: {
        name: 'Robert Wilson',
        id: '33042'
      },
      serviceDate: 'Sep 01, 2025',
      insuranceCarrier: {
        carrierName: 'HUMANA HMO NETWORK',
        planCategory: 'Secondary'
      },
      amount: '$75.00',
      status: 'PENDING',
      lastUpdated: {
        date: 'Sep 02, 2025',
        time: '09:30 AM'
      },
      user: 'RW',
      dateSent: 'Sep 01, 2025',
      dateSentOrig: 'Sep 01, 2025',
      pmsSyncStatus: {
        status: 'Syncing',
        description: 'Sync in progress',
        isSynced: false
      },
      provider: {
        name: 'Dr. Michael Brown',
        id: '11223344556'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
