/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ICustomer, TableColumn } from "../types/auth.type";
import { fetchCustomer, fetchCustomerLedger } from "../service/services";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ReusableTable } from "./Table";
import { 
  TrendingUp, 
  IndianRupee, 
  Receipt,
  RefreshCw 
} from "lucide-react";
import { Button } from "./ui/button";

type LedgerEntry = {
  date: string;
  type: "Sale" | "Payment" | "Return";
  amount: number;
};

export const CustomerLedger = () => {
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [totalLedgerCount, setTotalLedgerCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Calculate totals
  const totals = ledgerData.reduce(
    (acc, entry) => {
      if (entry.type === "Payment") {
        acc.payments += entry.amount;
      } else if (entry.type === "Sale") {
        acc.sales += entry.amount;
      } else if (entry.type === "Return") {
        acc.returns += entry.amount;
      }
      return acc;
    },
    { sales: 0, payments: 0, returns: 0 }
  );

  const balance = totals.sales - totals.payments - totals.returns;

  // Fetch all customers on mount
  useEffect(() => {
    async function getCustomers() {
      try {
        setIsLoading(true);
        const response = await fetchCustomer({ page: 1, limit: 1000 });
        setCustomers(response.data.data);
      } catch (err) {
        toast.error("Failed to fetch customers");
        console.error("Failed to fetch customers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getCustomers();
  }, []);

  // Fetch ledger data when selectedCustomer or currentPage changes
  useEffect(() => {
    if (!selectedCustomer) {
      setLedgerData([]);
      setTotalLedgerCount(0);
      return;
    }

    async function fetchLedger() {
      try {
        setIsLoading(true);
        const response = await fetchCustomerLedger(selectedCustomer, {
          limit: itemsPerPage,
          page: currentPage,
        });
        
        const formatted = response.data.data.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date).toISOString().split("T")[0],
        }));
        setLedgerData(formatted);
        setTotalLedgerCount(response.data.total);
      } catch (error) {
        toast.error("Failed to fetch customer ledger");
        console.error("Failed to fetch customer ledger:", error);
        setLedgerData([]);
        setTotalLedgerCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLedger();
  }, [selectedCustomer, currentPage]);

  const handleRefresh = async () => {
    if (!selectedCustomer) return;
    
    try {
      setIsRefreshing(true);
      const response = await fetchCustomerLedger(selectedCustomer, {
        limit: itemsPerPage,
        page: currentPage,
      });
      
      const formatted = response.data.data.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date).toISOString().split("T")[0],
      }));
      setLedgerData(formatted);
      setTotalLedgerCount(response.data.total);
      toast.success("Ledger refreshed");
    } catch (error) {
      toast.error("Failed to refresh ledger");
      console.error("Failed to refresh ledger:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const columns: TableColumn<LedgerEntry>[] = [
    {
      key: "date",
      header: "Date",
      render: (value) => (
        <span className="font-medium text-gray-700">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (value) => {
        const type = value as string;
        let bgColor = "";
        
        if (type === "Sale") bgColor = "bg-blue-100 text-blue-800";
        if (type === "Payment") bgColor = "bg-green-100 text-green-800";
        if (type === "Return") bgColor = "bg-amber-100 text-amber-800";
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
            {type}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ₹ {(value as number).toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <Card className="w-full shadow-sm border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IndianRupee className="h-6 w-6 text-blue-600 mr-2" />
            <CardTitle className="text-xl font-semibold text-gray-800">
              Customer Ledger
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || !selectedCustomer}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Customer Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Customer</label>
          <Select
            onValueChange={(value) => {
              setSelectedCustomer(value);
              setCurrentPage(1);
            }}
            value={selectedCustomer}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full md:w-[300px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Choose a customer" />
            </SelectTrigger>
            <SelectContent className="border-gray-200">
              {customers.map((customer) => (
                <SelectItem 
                  key={customer._id} 
                  value={customer.name}
                  className="focus:bg-blue-50"
                >
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        {selectedCustomer && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹ {totals.sales.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Payments</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹ {totals.payments.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Receipt className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Returns</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹ {totals.returns.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <IndianRupee className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Balance</p>
                  <p className={`text-lg font-semibold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    ₹ {balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ledger Table */}
        {selectedCustomer ? (
          <ReusableTable
            currentPage={currentPage}
            columns={columns}
            data={ledgerData}
            itemsPerPage={itemsPerPage}
            totalItems={totalLedgerCount}
            onPageChange={(page) => setCurrentPage(page)}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Select a customer to view ledger</h3>
            <p className="text-gray-500 mt-1">Choose a customer from the dropdown above to see their transaction history</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};