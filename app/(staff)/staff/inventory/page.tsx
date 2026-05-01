import { auth } from "@/auth";
import { requireAdmin, requireStaff } from "@/lib/auth-guard";
import {
  getLowStockMonitoring,
  getCriticalStockAlert,
} from "@/lib/actions/staff.actions";
import LowStockMonitoringUI from "./low-stock-ui";

export const metadata = {
  title: "Low Stock Monitoring",
};

const LowStockPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  await requireStaff();
  const session = await auth();

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const lowStockData = await getLowStockMonitoring({
    query: searchText,
  });
  const criticalAlert = await getCriticalStockAlert();

  console.log("critical", criticalAlert.data?.criticalProducts);

  return (
    <LowStockMonitoringUI
      initialData={lowStockData.success ? lowStockData.data : undefined}
      criticalAlert={criticalAlert.success ? criticalAlert.data : undefined}
      query={searchText}
    />
  );
};

export default LowStockPage;
