import { TableColumn } from "../components/TableHeader";
import { getInsuranceClaims } from "../lib/insurance-service";
import ClaimsTableServer from "../components/server/ClaimsTableServer";
import type { ColumnKey, ClaimStatus } from "../components/ClaimRow";

interface PageSearchParams {
  page?: string;
  limit?: string;
  sortBy?: ColumnKey;
  sortDirection?: "asc" | "desc";
  patientName?: string;
  status?: ClaimStatus;
}

interface PageProps {
  searchParams: Promise<PageSearchParams>;
}

export default async function Home(props: PageProps) {
  const sp = await props.searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const limit = sp.limit ? parseInt(sp.limit, 10) : 10;
  const sortBy = sp.sortBy ?? undefined;
  const sortDirection = sp.sortDirection ?? "asc";
  const patientName = sp.patientName ?? undefined;
  const status = sp.status ?? undefined;

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

  const data = await getInsuranceClaims({
    page,
    limit,
    sortBy,
    sortDirection,
    patientName,
    status,
  });

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-none flex justify-center">
        <ClaimsTableServer columns={columns} data={data} />
      </div>
    </div>
  );
}
