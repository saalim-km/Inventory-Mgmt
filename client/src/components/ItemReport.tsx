import { useEffect, useState } from "react";
import { fetchItemSalesAndStock } from "../service/services";
import type { TableColumn } from "../types/auth.type";
import { ReusableTable } from "./Table";

type ItemReportData = {
  name: string;
  sold: number;
  stock: number;
  price: number;
  totalSales: number;
};

export const ItemsReport = () => {
  const [itemData, setItemData] = useState<ItemReportData[]>([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchItemSalesAndStock({
          limit: itemsPerPage,
          page: currentPage,
        });
        setItemData(response.data.data);
        setTotalDataCount(response.data.total);
      } catch (error) {
        console.error("Error fetching item report:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const columns: TableColumn<ItemReportData>[] = [
    { key: "name", header: "Item" },
    { key: "sold", header: "Total Sold" },
    { key: "stock", header: "Stock Left" },
    { key: "price", header: "Price" },
    { key: "totalSales", header: "Total" },
  ];

  return (
    <ReusableTable
      currentPage={currentPage}
      columns={columns}
      data={itemData}
      itemsPerPage={itemsPerPage}
      onPageChange={(page) => setCurrentPage(page)}
      totalItems={totalDataCount}
    />
  );
};
