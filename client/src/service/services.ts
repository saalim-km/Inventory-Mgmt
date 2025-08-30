import { AxiosInstance } from "../api/axios-instance";
import type { ICustomer, IItem, ISale } from "../types/auth.type";


// CUSTOMER SERVICES
export const addCustomer = async (data: Omit<ICustomer, "_id">) => {
    const response = await AxiosInstance.post("/customer", data);
    return response.data;
}

export const editCustomer = async (id: string, data: Partial<ICustomer>) => {
    const response = await AxiosInstance.patch(`/customer/${id}`, data);
    return response.data;
}

export const deleteCustomer = async (id: string) => {
    const response = await AxiosInstance.delete(`/customer/${id}`);
    return response.data;
}


export const fetchCustomer = async (
    options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        limit?: number; page?: number; search?: any
    }
) => {
    const response = await AxiosInstance.get("/customer", {
        params: options,
    });
    return response.data
}

//ITEMS SERVICES
export const addItem = async (data: Omit<IItem, "_id">) => {
    const response = await AxiosInstance.post("/item", data);
    return response.data;
}

export const editItem = async (id: string, data: Partial<IItem>) => {
    const response = await AxiosInstance.patch(`/item/${id}`, data);
    return response.data;
}

export const deleteItem = async (id: string) => {
    const response = await AxiosInstance.delete(`/item/${id}`);
    return response.data;
}

export const fetchItems = async (
    options: {
        limit: number; page: number;search?:string
    }
) => {
    const response = await AxiosInstance.get("/item", {
        params: options,
    });
    return response.data
}

// SALE SERVICES

export const addSale = async (data: Omit<ISale, "_id">) => {
    const response = await AxiosInstance.post("/sale", data);
    return response.data;
}

export const deleteSale = async (id: string) => {
    const response = await AxiosInstance.delete(`/sale/${id}`);
    return response.data;
}

export const fetchAllSale = async () => {
    const response = await AxiosInstance.get("/sale/all");
    return response.data;
}

export const fetchSale = async (
    options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        limit: number; page : number
    }
) => {
    const response = await AxiosInstance.get("/sale", {
        params: options,
    });
    return response.data
}

export const fetchCustomerLedger = async (customerName: string, options: { limit?: number, page?: number }) => {
    const response = await AxiosInstance.get(`/sale/ledger/${customerName}`, {
        params: options,
    });
    return response.data
};

export const fetchSalesByDateRange = async (from: string, to: string, options: { limit: number, page: number }) => {
    const response = await AxiosInstance.get(`/sale/dateRange?from=${from}&to=${to}`,{
        params : options
    });
    return response.data;
};

export const fetchItemSalesAndStock = async (options: { limit: number, page: number }) => {
    const response = await AxiosInstance.get("/item/report", {
        params: options
    });
    return response.data;
};

export const exportSalesToExcel = async (from: string, to: string, customer?: string) => {
    const response = await AxiosInstance.get("/sale/export/excel", {
        params: { from, to, customer },
        responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// Fetch and download PDF
export const exportSalesToPDF = async (from: string, to: string, customer?: string) => {
    const response = await AxiosInstance.get("/sale/export/pdf", {
        params: { from, to, customer },
        responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
};


// Get Printable HTML
export const getPrintableSalesReport = async (from: string, to: string, customer?: string) => {
    const response = await AxiosInstance.get("/sale/export/print", {
        params: { from, to, customer },
    });
    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(response.data);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
};