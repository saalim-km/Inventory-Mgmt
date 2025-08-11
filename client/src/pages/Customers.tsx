import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { customerValidationSchema } from "../utils/formik/schemas";
import { useConfirmModal } from "../hook/useModal";
import { DashboardLayout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ReusableTable } from "../components/Table";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { addCustomer, deleteCustomer, editCustomer, fetchCustomer } from "../service/services";
import { handleError } from "../utils/error-handler";

type Customer = {
  _id: string;
  name: string;
  address: string;
  mobile: string;
};

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [totalCustomerCount, setTotalCustomerCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const location = useLocation();
  const confirmModal = useConfirmModal();

  // Fetch customers when page or location changes
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetchCustomer({
          limit: itemsPerPage,
          page: currentPage,
        });
        console.log("fetchCustomer response:", response);
        setCustomers(response.data.data);
        setTotalCustomerCount(response.data.total);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers");
      }
    }
    fetchCustomers();
  }, [currentPage, location]);

  const formik = useFormik({
    initialValues: { name: "", address: "", mobile: "" },
    validationSchema: customerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let response;
        if (selectedCustomer) {
          response = await editCustomer(selectedCustomer._id, {
            name: values.name,
            address: values.address,
            mobile: parseInt(values.mobile),
          });
          // Update state directly instead of refetching
          setCustomers((prev) =>
            prev.map((customer) =>
              customer._id === selectedCustomer._id
                ? {
                    ...customer,
                    name: values.name,
                    address: values.address,
                    mobile: values.mobile,
                  }
                : customer
            )
          );
          toast.success(response.message || "Customer updated successfully");
          setSelectedCustomer(null);
          resetForm();
        } else {
          response = await addCustomer({
            name: values.name,
            address: values.address,
            mobile: parseInt(values.mobile),
          });
          toast.success(response.message || "Customer added successfully");
          resetForm();
          // Refresh customer list after add
          const responseData = await fetchCustomer({
            limit: itemsPerPage,
            page: currentPage,
          });
          setCustomers(responseData.data.data);
          setTotalCustomerCount(responseData.data.total);
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        handleError(error);
      }
    },
  });

  const columns = [
    { key: "name", header: "Name" },
    { key: "address", header: "Address" },
    { key: "mobile", header: "Mobile" },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (row: Customer) => {
        formik.setValues({
          name: row.name,
          address: row.address,
          mobile: row.mobile,
        });
        setSelectedCustomer(row);
      },
    },
    {
      label: "Delete",
      onClick: (row: Customer) => {
        confirmModal.openModal({
          title: "Delete Customer",
          description: `Are you sure you want to delete ${row.name}?`,
          onConfirm: async () => {
            try {
              const response = await deleteCustomer(row._id);
              setCustomers(customers.filter((c) => c._id !== row._id));
              setTotalCustomerCount((prev) => prev - 1);
              if (
                customers.length === 1 &&
                currentPage > 1 &&
                (currentPage - 1) * itemsPerPage >= totalCustomerCount - 1
              ) {
                setCurrentPage((prev) => prev - 1);
              }
              confirmModal.closeModal();
              toast.success(response.message || "Customer deleted successfully");
            } catch (error) {
              console.error("Error deleting customer:", error);
              toast.error("Failed to delete customer");
            }
          },
        });
      },
    },
  ];

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-red-500">{formik.errors.name}</p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-sm text-red-500">{formik.errors.address}</p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  name="mobile"
                  placeholder="Mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="text-sm text-red-500">{formik.errors.mobile}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={formik.isSubmitting}>
                {selectedCustomer ? "Update Customer" : "Add Customer"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  formik.resetForm();
                }}
                variant="outline"
                disabled={formik.isSubmitting}
              >
                Clear
              </Button>
            </div>
          </form>

          <ReusableTable
            columns={columns}
            currentPage={currentPage}
            data={customers}
            actions={actions}
            itemsPerPage={itemsPerPage}
            totalItems={totalCustomerCount}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </CardContent>
      </Card>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.closeModal}
      />
    </DashboardLayout>
  );
};