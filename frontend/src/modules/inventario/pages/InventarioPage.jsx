import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import { showToast } from "../../../components/feedback/Toast";
import FormActions from "../../../components/forms/FormActions";
import FormField from "../../../components/forms/FormField";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import Input from "../../../components/ui/Input";
import LoaderButton from "../../../components/ui/LoaderButton";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import StatusBadge from "../../../components/ui/StatusBadge";
import { inventoryApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { inventoryMovementSchema, inventoryProductSchema } from "../../../utils/validators";

export default function InventarioPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const fetchProducts = useCallback(
    () => inventoryApi.listProducts({ search, category }),
    [category, search]
  );
  const productsState = useFetch(fetchProducts);
  const movementsState = useFetch(useCallback(() => inventoryApi.listMovements(), []));

  const productForm = useForm({
    resolver: zodResolver(inventoryProductSchema),
    defaultValues: {
      name: "",
      category: "Farmacia",
      sku: "",
      stock: 0,
      minStock: 0,
      price: 0,
      status: "active",
    },
  });

  const movementForm = useForm({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      productId: "",
      type: "in",
      quantity: 1,
      reason: "",
    },
  });

  const productColumns = useMemo(
    () => [
      {
        key: "name",
        header: "Producto",
        render: (product) => (
          <div>
            <p className="font-medium text-slate-950">{product.name}</p>
            <p className="text-xs text-slate-500">{product.sku}</p>
          </div>
        ),
      },
      { key: "category", header: "Categoria" },
      {
        key: "stock",
        header: "Stock",
        render: (product) => (
          <StatusBadge
            variant={product.stock === 0 ? "danger" : product.stock <= product.minStock ? "warning" : "success"}
          >
            {product.stock} unidades
          </StatusBadge>
        ),
      },
      { key: "minStock", header: "Minimo" },
      {
        key: "price",
        header: "Precio",
        render: (product) => formatCurrency(product.price),
      },
    ],
    []
  );

  const movementColumns = useMemo(
    () => [
      { key: "product", header: "Producto", render: (movement) => movement.product?.name },
      {
        key: "type",
        header: "Tipo",
        render: (movement) => (
          <StatusBadge variant={movement.type === "in" ? "success" : "warning"}>
            {movement.type === "in" ? "Entrada" : "Salida"}
          </StatusBadge>
        ),
      },
      { key: "quantity", header: "Cantidad" },
      { key: "reason", header: "Motivo" },
      { key: "date", header: "Fecha", render: (movement) => formatDate(movement.date) },
    ],
    []
  );

  const onCreateProduct = async (values) => {
    await inventoryApi.createProduct(values);
    productForm.reset();
    await productsState.reload();
    showToast({ title: "Producto creado" });
  };

  const onCreateMovement = async (values) => {
    await inventoryApi.createMovement(values);
    movementForm.reset();
    await productsState.reload();
    await movementsState.reload();
    showToast({ title: "Movimiento registrado" });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Inventario"
        description="Productos, categorias, stock, movimientos y alertas."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onClear={() => setSearch("")}
              placeholder="Buscar producto o SKU"
            />
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Todas las categorias</option>
              <option value="Vacunas">Vacunas</option>
              <option value="Farmacia">Farmacia</option>
              <option value="Insumos">Insumos</option>
              <option value="Cuidado">Cuidado</option>
            </Select>
          </div>

          {productsState.isLoading && (
            <div className="rounded-xl border border-slate-200 bg-white py-16">
              <Loader label="Cargando inventario" />
            </div>
          )}

          {productsState.error && (
            <ErrorState
              title="No se pudo cargar inventario"
              description="Intenta nuevamente."
              onRetry={productsState.reload}
            />
          )}

          {!productsState.isLoading && !productsState.error && (
            <DataTable
              columns={productColumns}
              data={productsState.data ?? []}
              emptyMessage="No se encontraron productos"
            />
          )}

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Movimientos recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {movementsState.isLoading && <Loader label="Cargando movimientos" />}
              {!movementsState.isLoading && (
                <DataTable
                  columns={movementColumns}
                  data={movementsState.data ?? []}
                  emptyMessage="Sin movimientos"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Nuevo producto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={productForm.handleSubmit(onCreateProduct)} className="space-y-4">
                <FormField label="Nombre" error={productForm.formState.errors.name?.message}>
                  <Input {...productForm.register("name")} />
                </FormField>
                <FormField label="Categoria" error={productForm.formState.errors.category?.message}>
                  <Input {...productForm.register("category")} />
                </FormField>
                <FormField label="SKU" error={productForm.formState.errors.sku?.message}>
                  <Input {...productForm.register("sku")} />
                </FormField>
                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField label="Stock" error={productForm.formState.errors.stock?.message}>
                    <Input type="number" {...productForm.register("stock")} />
                  </FormField>
                  <FormField label="Minimo" error={productForm.formState.errors.minStock?.message}>
                    <Input type="number" {...productForm.register("minStock")} />
                  </FormField>
                  <FormField label="Precio" error={productForm.formState.errors.price?.message}>
                    <Input type="number" step="0.01" {...productForm.register("price")} />
                  </FormField>
                </div>
                <FormActions>
                  <LoaderButton type="submit" isLoading={productForm.formState.isSubmitting}>
                    Crear producto
                  </LoaderButton>
                </FormActions>
              </form>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Movimiento de stock</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={movementForm.handleSubmit(onCreateMovement)} className="space-y-4">
                <FormField label="Producto" error={movementForm.formState.errors.productId?.message}>
                  <Select {...movementForm.register("productId")}>
                    <option value="">Selecciona producto</option>
                    {(productsState.data ?? []).map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Tipo" error={movementForm.formState.errors.type?.message}>
                  <Select {...movementForm.register("type")}>
                    <option value="in">Entrada</option>
                    <option value="out">Salida</option>
                  </Select>
                </FormField>
                <FormField label="Cantidad" error={movementForm.formState.errors.quantity?.message}>
                  <Input type="number" {...movementForm.register("quantity")} />
                </FormField>
                <FormField label="Motivo" error={movementForm.formState.errors.reason?.message}>
                  <Input {...movementForm.register("reason")} />
                </FormField>
                <FormActions>
                  <LoaderButton type="submit" isLoading={movementForm.formState.isSubmitting}>
                    Registrar movimiento
                  </LoaderButton>
                </FormActions>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
