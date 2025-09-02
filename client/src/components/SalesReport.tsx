import { useState } from "react";
import { toast } from "sonner";
import type { ISale, TableColumn } from "../types/auth.type";
import { fetchSalesByDateRange } from "../service/services";
import { DatePicker } from "./ui/date-picker";
import { Button } from "./ui/button";
import { ReusableTable } from "./Table";

export const SalesReport = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [sales, setSales] = useState<ISale[]>([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const handleGenerate = async (currPage = 1) => {
    console.log('page no:',currPage);
    if (!fromDate || !toDate) {
      toast.error("Please select both from and to dates");
      return;
    }

    try {
      const from = fromDate.toISOString();
      const to = toDate.toISOString();

      const response = await fetchSalesByDateRange(from, to, {
        limit: itemsPerPage,
        page: currPage,
      });
      setSales(response.data.data);
      setTotalDataCount(response.data.total);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to fetch sales data");
    }
  };

  const columns: TableColumn<ISale>[] = [
    {
      key: "date",
      header: "Date",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "customerName",
      header: "Customer",
    },
    {
      key : 'paymentType',
      header : "Payment Type"
    },
    {
      key: "items",
      header: "Total Amount (₹)",
      render: (_, row) =>
        `₹ ${row.items
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
          .toFixed(2)}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <label className="text-sm font-medium">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date!)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">To Date</label>
          <DatePicker selected={toDate} onChange={(date) => setToDate(date!)} />
        </div>
        <div>
          <Button onClick={()=> handleGenerate(currentPage)}>Generate</Button>
        </div>
      </div>

      <ReusableTable
        currentPage={currentPage}
        columns={columns}
        data={sales}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          handleGenerate(page);
        }}
        totalItems={totalDataCount}
      />
    </div>
  );
};
