import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import type { IItem } from "../types/auth.type";
import { useConfirmModal } from "../hook/useModal";
import { toast } from "sonner";
import { DashboardLayout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ReusableTable } from "../components/Table";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { addItem, deleteItem, editItem, fetchItems } from "../service/services";
import { itemValidationSchema } from "../utils/formik/schemas";
import { handleError } from "../utils/error-handler";

export const ItemManagement = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const location = useLocation();

  const confirmModal = useConfirmModal();

  useEffect(() => {
    const fetchItemList = async () => {
      const response = await fetchItems({
        limit: itemsPerPage,
        page: currentPage,
      });
      setItems(response.data.data || []);
      setTotalDataCount(response.data.total);
    };
    fetchItemList();
  }, [location, currentPage]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      quantity: 0,
      price: 0,
    },
    validationSchema: itemValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedItem) {
        try {
          const response = await editItem(selectedItem._id, {
            name: values.name,
            quantity: values.quantity,
            price: values.price,
            description: values.description,
          });
          setItems((prev) =>
            prev.map((item) =>
              item._id === selectedItem._id
                ? {
                    ...item,
                    name: values.name,
                    description: values.description,
                    quantity: values.quantity,
                    price: values.price,
                  }
                : item
            )
          );
          toast.success(response.message);
          resetForm();
          setSelectedItem(null);
        } catch (error) {
          handleError(error);
        }
      } else {
        try {
          const response = await addItem(values);
          setItems((prev) => [response.data, ...prev]);
          toast.success(response.message);
          resetForm();
          setSelectedItem(null);
        } catch (error) {
          console.log(error);
          handleError(error);
        }
      }
    },
  });

  const handleDelete = (item: IItem) => {
    confirmModal.openModal({
      title: "Delete Item",
      description: `Are you sure you want to delete "${item.name}"?`,
      onConfirm: async () => {
        const response = await deleteItem(item._id);
        toast.success(response.message);
        confirmModal.closeModal();
      },
    });
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
    { key: "quantity", header: "Quantity" },
    { key: "price", header: "Price" },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (row: IItem) => {
        formik.setValues(row);
        setSelectedItem(row);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
    },
  ];

  return (
    <>
      <DashboardLayout>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Item Management</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    name="description"
                    placeholder="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-sm text-red-500">
                      {formik.errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.quantity && formik.errors.quantity && (
                    <p className="text-sm text-red-500">
                      {formik.errors.quantity}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-sm text-red-500">
                      {formik.errors.price}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {selectedItem ? "Update Item" : "Add Item"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    formik.resetForm();
                  }}
                  variant="outline"
                >
                  Clear
                </Button>
              </div>
            </form>

            <ReusableTable
              currentPage={currentPage}
              columns={columns}
              data={items}
              actions={actions}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
              totalItems={totalDataCount}
            />
          </CardContent>
        </Card>
      </DashboardLayout>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.closeModal}
      />
    </>
  );
};
