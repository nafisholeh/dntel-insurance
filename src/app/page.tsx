import DataTable, { TableColumn } from "../components/DataTable";
import { insuranceClaimsData } from "../data/insurance-data";

export default function Home() {
  // Define columns with exact widths from your design
  const columns: TableColumn[] = [
    { key: 'patient', label: 'Patient', width: '110px', sortable: true },
    { key: 'serviceDate', label: 'Service Date', width: '92px', sortable: true },
    { key: 'insuranceCarrier', label: 'Insurance Carrier', width: '141px' },
    { key: 'amount', label: 'Amount', width: '49px' },
    { key: 'status', label: 'Status', width: '126px', sortable: true },
    { key: 'lastUpdated', label: 'Last Updated', width: '92px', sortable: true },
    { key: 'user', label: 'User', width: '30px' },
    { key: 'dateSent', label: 'Date Sent', width: '92px' },
    { key: 'dateSentOrig', label: 'Date Sent Orig', width: '91px' },
    { key: 'pmsSyncStatus', label: 'PMS Sync Status', width: '121px' },
    { key: 'provider', label: 'Provider', width: '95px' },
  ];

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-none flex justify-center">
        <DataTable columns={columns} data={insuranceClaimsData} />
      </div>
    </div>
  );
}
