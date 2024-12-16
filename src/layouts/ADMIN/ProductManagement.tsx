// src/components/ProductManagement.tsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Button,
  Row,
  Col,
  notification,
  Table,
  Space,
  Image,
  InputNumber,
  Spin,
  Upload,
} from "antd";
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import useDebounce from "../customer/component/useDebounce";
import {
  fetchProductList,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  updateCategory,
} from "../../api/apiAdmin/productApiAdmin";
import {
  Category,
  fetchCategoryList,
} from "../../api/apiAdmin/categoryApiAdmin";
import axios from "axios";
import * as XLSX from "xlsx";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ProductInput } from "../../models/AdminModels/ProductInput";

const { Option } = Select;

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dn2ot5mo6";
const CLOUDINARY_UPLOAD_PRESET = "urvibegs";

const ProductManagement: React.FC = () => {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<
    number | null
  >(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingProduct, setSavingProduct] = useState<boolean>(false);
  const [deletingProduct, setDeletingProduct] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  // Debounced search
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  // Forms
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Image uploads
  const [addImageUrl, setAddImageUrl] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [uploadingAddImage, setUploadingAddImage] = useState<boolean>(false);
  const [uploadingEditImage, setUploadingEditImage] = useState<boolean>(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);

  const handleApiError = useCallback((error: any, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        defaultMessage;
      notification.error({
        message: "Lỗi",
        description: message,
      });
    } else {
      notification.error({
        message: "Lỗi",
        description: defaultMessage,
      });
    }
  }, []);

  const getCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await fetchCategoryList();
      setCategories(data);
    } catch (error) {
      handleApiError(error, "Không thể lấy danh sách danh mục.");
    } finally {
      setCategoriesLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, totalElements } = await fetchProductList(
        currentPage,
        debouncedSearchText
      );
      setProducts(data);
      setTotalProducts(totalElements);
    } catch (error) {
      handleApiError(error, "Không thể lấy danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchText, handleApiError]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchText]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openEditModal = useCallback(
    (product: Product) => {
      setEditProduct(product);
      setIsEditModalOpen(true);
      setEditImageUrl(product.image || null);
      editForm.setFieldsValue({
        ...product,
        productStatus: product.productStatus === "IN_STOCK",
        category: product.category.categoryId,
      });
    },
    [editForm]
  );

  const openAddModal = useCallback(() => {
    setEditProduct(null);
    addForm.resetFields();
    setAddImageUrl(null);
    setIsAddModalOpen(true);
  }, [addForm]);

  const handleImageUpload = async (
    file: File,
    setImageUrl: (url: string) => void,
    setUploading: (uploading: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setImageUrl(res.data.secure_url);
      notification.success({
        message: "Upload ảnh thành công",
        description: "Ảnh đã được upload thành công!",
      });
    } catch (error) {
      console.error("Lỗi khi upload ảnh lên Cloudinary:", error);
      notification.error({
        message: "Lỗi upload ảnh",
        description: "Có lỗi xảy ra khi upload ảnh.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNewProduct = useCallback(async () => {
    try {
      const newProductData = await addForm.validateFields();
      if (!addImageUrl) {
        notification.error({
          message: "Yêu cầu ảnh",
          description: "Vui lòng upload ảnh sản phẩm trước khi lưu.",
        });
        return;
      }

      setSavingProduct(true);

      const newProduct: ProductInput = {
        productName: newProductData.productName,
        description: newProductData.description,
        price: newProductData.price,
        typeFood: newProductData.typeFood,
        image: addImageUrl,
        quantity: newProductData.quantity,
        productStatus: newProductData.productStatus ? "IN_STOCK" : "HIDDEN",
        categoryId: newProductData.category,
      };

      const createdProduct = await createProduct(newProduct);

      // Nếu muốn cập nhật danh mục khác, gọi API updateCategory ở đây.

      setProducts((prev) => [...prev, createdProduct]);
      setTotalProducts((prev) => prev + 1);

      notification.success({
        message: "Thêm sản phẩm",
        description: "Sản phẩm mới đã được thêm thành công!",
      });
      window.location.reload();

      setIsAddModalOpen(false);
      addForm.resetFields();
      setAddImageUrl(null);
    } catch (error) {
      handleApiError(error, "Có lỗi xảy ra khi thêm sản phẩm.");
    } finally {
      setSavingProduct(false);
    }
  }, [addForm, addImageUrl, handleApiError]);

  const handleSaveEditProduct = useCallback(async () => {
    try {
      const updatedProductData = await editForm.validateFields();

      if (!editImageUrl) {
        notification.error({
          message: "Yêu cầu ảnh",
          description: "Vui lòng upload ảnh sản phẩm trước khi lưu.",
        });
        return;
      }

      if (editProduct) {
        setSavingProduct(true);

        const updatedProduct: Partial<ProductInput> = {
          productName: updatedProductData.productName,
          description: updatedProductData.description,
          price: updatedProductData.price,
          typeFood: updatedProductData.typeFood,
          image: editImageUrl,
          quantity: updatedProductData.quantity,
          productStatus: updatedProductData.productStatus
            ? "IN_STOCK"
            : "HIDDEN",
        };

        const result = await updateProduct(
          editProduct.productId,
          updatedProduct
        );

        // Nếu thay đổi danh mục:
        if (
          updatedProductData.category &&
          updatedProductData.category !== editProduct.category.categoryId
        ) {
          const categoryId = updatedProductData.category;
          await updateCategory(editProduct.productId, categoryId);
        }

        setProducts((prev) =>
          prev.map((product) =>
            product.productId === editProduct.productId
              ? { ...product, ...updatedProduct }
              : product
          )
        );

        window.location.reload();
        notification.success({
          message: "Cập nhật sản phẩm",
          description: "Sản phẩm đã được cập nhật thành công!",
        });

        setIsEditModalOpen(false);
        setEditImageUrl(null);
      }
    } catch (error) {
      handleApiError(error, "Có lỗi xảy ra khi cập nhật sản phẩm.");
    } finally {
      setSavingProduct(false);
    }
  }, [editForm, editProduct, editImageUrl, handleApiError]);

  const handleDeleteProduct = useCallback((productId: number) => {
    setConfirmDeleteProductId(productId);
    setConfirmDeleteModalVisible(true);
  }, []);

  const handleConfirmDeleteProduct = useCallback(async () => {
    if (confirmDeleteProductId !== null) {
      try {
        setDeletingProduct(true);
        await deleteProduct(confirmDeleteProductId);
        setProducts((prev) =>
          prev.filter((p) => p.productId !== confirmDeleteProductId)
        );
        setTotalProducts((prev) => prev - 1);
        notification.success({
          message: "Xóa sản phẩm",
          description: "Sản phẩm đã được xóa thành công!",
        });
        setConfirmDeleteModalVisible(false);
        setConfirmDeleteProductId(null);
      } catch (error) {
        console.error(error);
        handleApiError(error, "Có lỗi xảy ra khi xóa sản phẩm.");
      } finally {
        setDeletingProduct(false);
      }
    }
  }, [confirmDeleteProductId, handleApiError]);

  const handleUpdateProductStatus = useCallback(
    async (productId: number, checked: boolean) => {
      const newStatus: "IN_STOCK" | "HIDDEN" = checked ? "IN_STOCK" : "HIDDEN";
      try {
        const updatedStatus = { productStatus: newStatus };
        const updatedProduct = await updateProduct(productId, updatedStatus);
        setProducts((prev) =>
          prev.map((p) =>
            p.productId === productId
              ? { ...p, productStatus: updatedProduct.productStatus }
              : p
          )
        );
        notification.success({
          message: "Cập nhật trạng thái",
          description: `Sản phẩm đã được ${
            newStatus === "IN_STOCK" ? "kích hoạt" : "ẩn"
          } thành công!`,
        });
      } catch (error) {
        console.error(error);
        handleApiError(
          error,
          "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm."
        );
      }
    },
    [handleApiError]
  );

  const columns = useMemo<ColumnsType<Product>>(
    () => [
      {
        title: "Mã sản phẩm",
        dataIndex: "productId",
        key: "productId",
        sorter: (a, b) => a.productId - b.productId,
        width: 100,
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "productName",
        key: "productName",
        sorter: (a, b) => a.productName.localeCompare(b.productName),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        sorter: (a, b) => a.price - b.price,
        render: (price: number) => `$${price.toFixed(2)}`,
        width: 120,
      },
      {
        title: "Loại món ăn",
        dataIndex: "typeFood",
        key: "typeFood",
      },
      {
        title: "Danh mục",
        dataIndex: ["category", "categoryName"],
        key: "category",
        sorter: (a, b) =>
          a.category.categoryName.localeCompare(b.category.categoryName),
      },
      {
        title: "Ảnh",
        dataIndex: "image",
        key: "image",
        render: (image: string, record) => (
          <Image
            src={image}
            alt={`${record.productName} image`}
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
            fallback="https://via.placeholder.com/50"
          />
        ),
        width: 80,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        sorter: (a, b) => a.quantity - b.quantity,
        width: 100,
      },
      {
        title: "Trạng thái",
        dataIndex: "productStatus",
        key: "productStatus",
        render: (status: "IN_STOCK" | "OUT_OF_STOCK" | "HIDDEN") => {
          let displayText = "";
          switch (status) {
            case "IN_STOCK":
              displayText = "Hiển thị";
              break;
            case "OUT_OF_STOCK":
              displayText = "Hết hàng";
              break;
            case "HIDDEN":
              displayText = "Ẩn";
              break;
            default:
              displayText = "Không xác định";
          }
          return displayText;
        },
        filters: [
          { text: "Hiển thị", value: "IN_STOCK" },
          { text: "Hết hàng", value: "OUT_OF_STOCK" },
          { text: "Ẩn", value: "HIDDEN" },
        ],
        onFilter: (value, record) => record.productStatus === value,
        width: 150,
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              aria-label={`Chỉnh sửa ${record.productName}`}
            />
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteProduct(record.productId)}
              aria-label={`Xóa ${record.productName}`}
            />
          </Space>
        ),
        width: 120,
      },
    ],
    [handleUpdateProductStatus, openEditModal, handleDeleteProduct]
  );

  const handleTableChange = useCallback(
    (pagination: any, filters: any, sorter: any) => {
      const newPage = pagination.current - 1;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    },
    [currentPage]
  );

  // Export functions
  const exportToExcel = () => {
    const dataToExport = products.map((product) => ({
      "Mã sản phẩm": product.productId,
      "Tên sản phẩm": product.productName,
      "Mô tả": product.description,
      Giá: product.price,
      "Loại món ăn": product.typeFood,
      "Danh mục": product.category.categoryName,
      "Số lượng": product.quantity,
      "Trạng thái": product.productStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "Mã sản phẩm",
          "Tên sản phẩm",
          "Mô tả",
          "Giá",
          "Loại món ăn",
          "Danh mục",
          "Số lượng",
          "Trạng thái",
        ],
        ...products.map((item) => [
          item.productId,
          item.productName,
          item.description,
          item.price,
          item.typeFood,
          item.category.categoryName,
          item.quantity,
          item.productStatus,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  };

  const exportToPDF = async () => {
    const fontUrl = "/fonts/Roboto-Black.ttf";
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
      const customFont = await pdfDoc.embedFont(fontBytes);

      let page = pdfDoc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();
      const margin = 50;

      page.drawText("Danh Sách Sản Phẩm", {
        x: margin,
        y: height - margin,
        size: 18,
        font: customFont,
        color: rgb(0, 0.53, 0.71),
      });

      const tableHeader = [
        "Mã SP",
        "Tên SP",
        "Giá",
        "Loại",
        "Danh mục",
        "Số Lượng",
        "Trạng Thái",
      ];
      let yPosition = height - margin - 40;
      const cellWidth = [50, 100, 70, 100, 100, 70, 100];

      // Header row
      tableHeader.forEach((header, i) => {
        page.drawText(header, {
          x: margin + cellWidth.slice(0, i).reduce((a, b) => a + b, 0),
          y: yPosition,
          size: 10,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });

      yPosition -= 20;

      for (const product of products) {
        const rowData = [
          product.productId?.toString() || "N/A",
          product.productName || "N/A",
          product.price ? `$${product.price.toFixed(2)}` : "N/A",
          product.typeFood || "N/A",
          product.category.categoryName || "N/A",
          product.quantity?.toString() || "N/A",
          product.productStatus || "N/A",
        ];

        rowData.forEach((data, i) => {
          page.drawText(data, {
            x: margin + cellWidth.slice(0, i).reduce((a, b) => a + b, 0),
            y: yPosition,
            size: 10,
            font: customFont,
            color: rgb(0, 0, 0),
          });
        });

        yPosition -= 20;
        if (yPosition < 50) {
          yPosition = height - margin - 40;
          page = pdfDoc.addPage([595.28, 841.89]);
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "DanhSachSanPham.pdf";
      link.click();

      notification.success({
        message: "Xuất PDF thành công",
        description: "File PDF đã được tải xuống.",
      });
    } catch (error) {
      console.error("Error during PDF generation:", error);
      notification.error({
        message: "Lỗi xuất PDF",
        description: "Đã xảy ra lỗi khi tạo file PDF.",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="main-content">
        <div className="product-management">
          <h2>Quản lý sản phẩm</h2>
          <div
            className="search-filter"
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 300, marginRight: 16 }}
              />
            </div>
            <div
              className="btn-export-excel"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button onClick={exportToExcel} style={{ marginRight: 8 }}>
                Xuất Excel
              </Button>
              <Button onClick={exportToPDF} style={{ marginRight: 8 }}>
                Xuất PDF
              </Button>
              <Button onClick={exportToCSV}>Xuất CSV</Button>
            </div>
            <Button
              onClick={openAddModal}
              type="primary"
              style={{
                backgroundColor: "rgb(252, 71, 10)",
                borderColor: "rgb(252, 71, 10)",
              }}
            >
              Thêm sản phẩm
            </Button>
          </div>

          {/* Modal thêm sản phẩm */}
          <Modal
            title="Thêm sản phẩm mới"
            open={isAddModalOpen}
            onCancel={() => {
              setIsAddModalOpen(false);
              addForm.resetFields();
              setAddImageUrl(null);
            }}
            footer={[
              <Button key="cancel" onClick={() => setIsAddModalOpen(false)}>
                Đóng
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveNewProduct}
                loading={savingProduct}
                disabled={savingProduct}
              >
                Lưu
              </Button>,
            ]}
          >
            <Form
              form={addForm}
              layout="vertical"
              initialValues={{ productStatus: true }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tên sản phẩm"
                    name="productName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên sản phẩm!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Giá"
                    name="price"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá!" },
                      {
                        type: "number",
                        min: 0,
                        message: "Giá phải là số dương!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập giá"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Loại món ăn"
                    name="typeFood"
                    rules={[
                      { required: true, message: "Vui lòng chọn loại món ăn!" },
                    ]}
                  >
                    <Select placeholder="Chọn loại món ăn">
                      <Option value="hotpot">hotpot</Option>
                      <Option value="meat">meat</Option>
                      <Option value="seafood">seafood</Option>
                      <Option value="noodles">noodles</Option>
                      <Option value="mushroom">mushroom</Option>
                      <Option value="vegetables">vegetables</Option>
                      <Option value="meatballs">meatballs</Option>
                      <Option value="buffet_tickets">buffet_tickets</Option>
                      <Option value="soft_drinks">soft_drinks</Option>
                      <Option value="mixers">mixers</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Danh mục"
                    name="category"
                    rules={[
                      { required: true, message: "Vui lòng chọn danh mục!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      loading={categoriesLoading}
                      allowClear
                    >
                      {categories.map((category) => (
                        <Option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng!" },
                      {
                        type: "number",
                        min: 0,
                        message: "Số lượng phải là số dương!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập số lượng"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Trạng thái"
                    name="productStatus"
                    valuePropName="checked"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái!" },
                    ]}
                  >
                    <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                      { required: true, message: "Vui lòng nhập mô tả!" },
                    ]}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={addForm.getFieldValue("description") || ""}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        addForm.setFieldsValue({ description: data });
                      }}
                      config={{
                        toolbar: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "link",
                          "bulletedList",
                          "numberedList",
                          "blockQuote",
                          "undo",
                          "redo",
                        ],
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ảnh sản phẩm"
                    name="image"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng upload ảnh sản phẩm!",
                      },
                    ]}
                  >
                    <Upload
                      name="image"
                      listType="picture"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImageUpload(
                          file,
                          setAddImageUrl,
                          setUploadingAddImage
                        );
                        return false;
                      }}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        loading={uploadingAddImage}
                      >
                        {uploadingAddImage ? "Đang tải lên..." : "Chọn ảnh"}
                      </Button>
                    </Upload>
                    {addImageUrl && (
                      <Image
                        src={addImageUrl}
                        alt="Ảnh sản phẩm"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>

          {/* Modal chỉnh sửa sản phẩm */}
          <Modal
            title="Chỉnh sửa sản phẩm"
            open={isEditModalOpen}
            onCancel={() => {
              setIsEditModalOpen(false);
              editForm.resetFields();
              setEditImageUrl(null);
            }}
            footer={[
              <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
                Đóng
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveEditProduct}
                loading={savingProduct}
                disabled={savingProduct}
              >
                Lưu thay đổi
              </Button>,
            ]}
          >
            <Form
              form={editForm}
              layout="vertical"
              initialValues={
                editProduct
                  ? {
                      ...editProduct,
                      productStatus: editProduct.productStatus === "IN_STOCK",
                      category: editProduct.category.categoryId,
                    }
                  : {}
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tên sản phẩm"
                    name="productName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên sản phẩm!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Giá"
                    name="price"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá!" },
                      {
                        type: "number",
                        min: 0,
                        message: "Giá phải là số dương!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập giá"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Loại món ăn"
                    name="typeFood"
                    rules={[
                      { required: true, message: "Vui lòng chọn loại món ăn!" },
                    ]}
                  >
                    <Select placeholder="Chọn loại món ăn">
                      <Option value="hotpot">hotpot</Option>
                      <Option value="meat">meat</Option>
                      <Option value="seafood">seafood</Option>
                      <Option value="noodles">noodles</Option>
                      <Option value="mushroom">mushroom</Option>
                      <Option value="vegetables">vegetables</Option>
                      <Option value="meatballs">meatballs</Option>
                      <Option value="buffet_tickets">buffet_tickets</Option>
                      <Option value="soft_drinks">soft_drinks</Option>
                      <Option value="mixers">mixers</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Danh mục"
                    name="category"
                    rules={[
                      { required: true, message: "Vui lòng chọn danh mục!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      loading={categoriesLoading}
                      allowClear
                    >
                      {categories.map((category) => (
                        <Select.Option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng!" },
                      {
                        type: "number",
                        min: 0,
                        message: "Số lượng phải là số dương!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập số lượng"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Trạng thái"
                    name="productStatus"
                    valuePropName="checked"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái!" },
                    ]}
                  >
                    <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                      { required: true, message: "Vui lòng nhập mô tả!" },
                    ]}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={editForm.getFieldValue("description") || ""}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        editForm.setFieldsValue({ description: data });
                      }}
                      config={{
                        toolbar: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "link",
                          "bulletedList",
                          "numberedList",
                          "blockQuote",
                          "undo",
                          "redo",
                        ],
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ảnh sản phẩm"
                    name="image"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng upload ảnh sản phẩm!",
                      },
                    ]}
                  >
                    <Upload
                      name="image"
                      listType="picture"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImageUpload(
                          file,
                          setEditImageUrl,
                          setUploadingEditImage
                        );
                        return false;
                      }}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        loading={uploadingEditImage}
                      >
                        {uploadingEditImage ? "Đang tải lên..." : "Chọn ảnh"}
                      </Button>
                    </Upload>
                    {editImageUrl && (
                      <Image
                        src={editImageUrl}
                        alt="Ảnh sản phẩm"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>

          {/* Modal xác nhận xóa */}
          <Modal
            open={confirmDeleteModalVisible}
            onCancel={() => setConfirmDeleteModalVisible(false)}
            footer={null}
            centered
            width={400}
          >
            <div style={{ textAlign: "center" }}>
              <ExclamationCircleOutlined
                style={{ fontSize: "48px", color: "#ff4d4f" }}
              />
              <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>
                Xác nhận xóa
              </h3>
              <p style={{ fontSize: "16px" }}>
                Bạn có chắc chắn muốn xóa sản phẩm này không?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={() => setConfirmDeleteModalVisible(false)}
                  style={{ backgroundColor: "#f0f0f0", color: "#000" }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  onClick={handleConfirmDeleteProduct}
                  loading={deletingProduct}
                  disabled={deletingProduct}
                  style={{
                    backgroundColor: "rgb(252, 71, 10)",
                    borderColor: "rgb(252, 71, 10)",
                  }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </Modal>

          {/* Bảng sản phẩm */}
          <div className="table-container" style={{ overflow: "auto" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin tip="Đang tải sản phẩm..." />
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={products}
                rowKey="productId"
                pagination={{
                  current: currentPage + 1,
                  pageSize: 20,
                  total: totalProducts,
                  showSizeChanger: false,
                }}
                bordered
                onChange={handleTableChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
