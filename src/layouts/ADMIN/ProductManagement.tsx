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
} from "../../api/apiAdmin/productApiAdmin";
import axios from "axios";
import * as XLSX from 'xlsx';



import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



const { Option } = Select;

// Cấu hình Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dn2ot5mo6'; // Thay thế bằng Cloud name của bạn
const CLOUDINARY_UPLOAD_PRESET = 'urvibegs'; // Thay thế bằng Upload preset của bạn


export interface Product {
    productId: number;
    productName: string;
    description: string;
    price: number;
    typeFood: string;
    image: string;
    quantity: number;
    productStatus: "IN_STOCK" | "OUT_OF_STOCK" | "HIDDEN";
}

const ProductManagement: React.FC = () => {
    // Trạng thái cho các modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<number | null>(null);
    // Trạng thái dữ liệu
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Trạng thái tải dữ liệu
    const [savingProduct, setSavingProduct] = useState<boolean>(false);
    const [deletingProduct, setDeletingProduct] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0); // Chỉ số trang hiện tại (bắt đầu từ 0)
    const [totalProducts, setTotalProducts] = useState<number>(0); // Tổng số sản phẩm
    const [searchText, setSearchText] = useState<string>("");
    const [filterType, setFilterType] = useState<string>("");

    // Giá trị tìm kiếm sau khi debounce
    const debouncedSearchText = useDebounce<string>(searchText, 500);

    // Form
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Trạng thái upload ảnh
    const [addImageUrl, setAddImageUrl] = useState<string | null>(null);
    const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
    const [uploadingAddImage, setUploadingAddImage] = useState<boolean>(false);
    const [uploadingEditImage, setUploadingEditImage] = useState<boolean>(false);

    // Hàm xử lý lỗi API
    const handleApiError = useCallback((error: any, defaultMessage: string) => {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message || error.response?.statusText || defaultMessage;
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

    // Hàm lấy danh sách sản phẩm từ backend
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const { data, totalPages, totalElements } = await fetchProductList(
                currentPage,
                debouncedSearchText
                // Bạn có thể thêm filterType vào đây nếu API hỗ trợ
            );
            setProducts(data);
            setTotalProducts(totalElements);
        } catch (error) {
            handleApiError(error, "Không thể lấy danh sách sản phẩm.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchText, filterType, handleApiError]);

    // Reset trang hiện tại khi tìm kiếm hoặc lọc thay đổi
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchText, filterType]);

    // Lấy danh sách sản phẩm khi trang hiện tại, tìm kiếm hoặc lọc thay đổi
    useEffect(() => {
        fetchProducts();
    }, [currentPage, debouncedSearchText, filterType, fetchProducts]);

    // Hàm mở modal chỉnh sửa sản phẩm
    const openEditModal = useCallback(
        (product: Product) => {
            setEditProduct(product);
            setIsEditModalOpen(true);
            setEditImageUrl(product.image || null); // Khởi tạo với URL ảnh hiện tại
            editForm.setFieldsValue({
                ...product,
                productStatus: product.productStatus === "IN_STOCK",
            });
        },
        [editForm]
    );

    // Hàm mở modal thêm mới sản phẩm
    const openAddModal = useCallback(() => {
        setEditProduct(null);
        addForm.resetFields();
        setAddImageUrl(null);
        setIsAddModalOpen(true);
    }, [addForm]);

    // Hàm xử lý upload ảnh lên Cloudinary
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

    // Hàm xử lý thêm mới sản phẩm
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
            const newProduct: Omit<Product, "productId"> = {
                productName: newProductData.productName,
                description: newProductData.description,
                price: newProductData.price,
                typeFood: newProductData.typeFood,
                image: addImageUrl,
                quantity: newProductData.quantity,
                productStatus: newProductData.productStatus ? "IN_STOCK" : "HIDDEN",
            };
            const createdProduct = await createProduct(newProduct);
            setProducts((prev) => [createdProduct, ...prev]);
            setTotalProducts((prev) => prev + 1);
            notification.success({
                message: "Thêm sản phẩm",
                description: "Sản phẩm mới đã được thêm thành công!",
            });
            setIsAddModalOpen(false);
            addForm.resetFields();
            setAddImageUrl(null);
        } catch (error) {
            handleApiError(error, "Có lỗi xảy ra khi thêm sản phẩm.");
        } finally {
            setSavingProduct(false);
        }
    }, [addForm, addImageUrl, handleApiError]);

    // Hàm xử lý cập nhật sản phẩm
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
                const updatedProduct: Omit<Product, "productId"> = {
                    productName: updatedProductData.productName,
                    description: updatedProductData.description,
                    price: updatedProductData.price,
                    typeFood: updatedProductData.typeFood,
                    image: editImageUrl,
                    quantity: updatedProductData.quantity,
                    productStatus: updatedProductData.productStatus ? "IN_STOCK" : "HIDDEN",
                };
                const result = await updateProduct(editProduct.productId, updatedProduct);
                setProducts((prev) =>
                    prev.map((p) => (p.productId === editProduct.productId ? result : p))
                );
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

    // Hàm xử lý xóa sản phẩm
    const handleDeleteProduct = useCallback((productId: number) => {
        setConfirmDeleteProductId(productId);
        setConfirmDeleteModalVisible(true);
    }, []);

    // Hàm xác nhận xóa sản phẩm
    const handleConfirmDeleteProduct = useCallback(async () => {
        if (confirmDeleteProductId !== null) {
            try {
                setDeletingProduct(true);
                await deleteProduct(confirmDeleteProductId);
                setProducts((prev) => prev.filter((p) => p.productId !== confirmDeleteProductId));
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

    // Hàm cập nhật trạng thái sản phẩm
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
                handleApiError(error, "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.");
            }
        },
        [handleApiError]
    );

    // Định nghĩa các cột cho bảng
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
                render: (price: number) => `\$${price.toFixed(2)}`,
                width: 120,
            },
            {
                title: "Loại món ăn",
                dataIndex: "typeFood",
                key: "typeFood",
                filters: [
                    { text: "Mains", value: "Mains" },
                    { text: "Desserts", value: "Desserts" },
                    { text: "Drinks", value: "Drinks" },
                    // Thêm các loại khác nếu cần
                ],
                filteredValue: filterType ? [filterType] : null,
                width: 120,
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
                render: (status: "IN_STOCK" | "OUT_OF_STOCK" | "HIDDEN", record) => (
                    <Switch
                        checked={status === "IN_STOCK"}
                        onChange={(checked) => handleUpdateProductStatus(record.productId, checked)}
                        checkedChildren="Hiển thị"
                        unCheckedChildren="Ẩn"
                    />
                ),
                filters: [
                    { text: "Hiển thị", value: "IN_STOCK" },
                    { text: "Hết hàng", value: "OUT_OF_STOCK" },
                    { text: "Ẩn", value: "HIDDEN" },
                ],
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
        [filterType, handleUpdateProductStatus, openEditModal, handleDeleteProduct]
    );

    // Xử lý thay đổi của bảng (phân trang, lọc)
    const handleTableChange = useCallback(
        (pagination: any, filters: any, sorter: any) => {
            const newPage = pagination.current - 1;
            const newFilterType = filters.typeFood ? filters.typeFood[0] : "";

            if (newFilterType !== filterType) {
                setFilterType(newFilterType);
                setCurrentPage(0); // Reset về trang đầu khi lọc thay đổi
            } else if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }
        },
        [currentPage, filterType]
    );

    // Các hàm xuất dữ liệu
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(products);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

        // Tạo buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Lưu file
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.xlsx');
        document.body.appendChild(link);
        link.click();
    };

    const exportToCSV = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [
                ['Mã sản phẩm', 'Tên sản phẩm', 'Mô tả', 'Giá', 'Loại món ăn', 'Số lượng', 'Trạng thái'],
                ...products.map((item) => [
                    item.productId,
                    item.productName,
                    item.description,
                    item.price,
                    item.typeFood,
                    item.quantity,
                    item.productStatus,
                ]),
            ]
                .map((e) => e.join(','))
                .join('\n');

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'products.csv');
        document.body.appendChild(link);
        link.click();
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.addFont("font-times-new-roman-normal.ttf", "font-times-new-roman", "normal");
        doc.setFont("font-times-new-roman", "normal");


        const tableColumn = [
            'Mã sản phẩm',
            'Tên sản phẩm',
            'Mô tả',
            'Giá',
            'Loại món ăn',
            'Số lượng',
            'Trạng thái',
        ];



        // Thiết lập font chữ
        doc.setFont("PTSans-Regular", "normal");

        const tableRows: any[] = [];

        products.forEach((item) => {
            const rowData = [
                item.productId,
                item.productName,
                item.description,
                item.price,
                item.typeFood,
                item.quantity,
                item.productStatus,
            ];
            tableRows.push(rowData);
        });






        autoTable(doc,{
            head: [tableColumn],
            body: tableRows,
            startY: 20,

        });



        doc.save('products.pdf');
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
                            {/* Nếu muốn thêm bộ lọc bên ngoài, có thể thêm Select ở đây */}
                        </div>
                        <div className="btn-export-excel" style={{ display: 'flex', alignItems: 'center' }}>
                            <Button onClick={exportToExcel} style={{ marginRight: 8 }}>
                                Xuất Excel
                            </Button>
                            <Button onClick={exportToPDF} style={{ marginRight: 8 }}>
                                Xuất PDF
                            </Button>
                            <Button onClick={exportToCSV}>
                                Xuất CSV
                            </Button>
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
                        visible={isAddModalOpen}
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
                        <Form form={addForm} layout="vertical" initialValues={{ productStatus: true }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên sản phẩm"
                                        name="productName"
                                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
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
                                        <InputNumber placeholder="Nhập giá" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Loại món ăn"
                                        name="typeFood"
                                        rules={[{ required: true, message: "Vui lòng chọn loại món ăn!" }]}
                                    >
                                        <Select placeholder="Chọn loại món ăn">
                                            <Option value="Mains">Mains</Option>
                                            <Option value="Desserts">Desserts</Option>
                                            <Option value="Drinks">Drinks</Option>
                                            {/* Thêm các loại khác nếu cần */}
                                        </Select>
                                    </Form.Item>
                                </Col>
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
                                        <InputNumber placeholder="Nhập số lượng" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Mô tả"
                                        name="description"
                                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                                    >
                                        <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ảnh sản phẩm"
                                        name="image"
                                        rules={[{ required: true, message: "Vui lòng upload ảnh sản phẩm!" }]}
                                    >
                                        <Upload
                                            name="image"
                                            listType="picture"
                                            showUploadList={false}
                                            beforeUpload={(file) => {
                                                handleImageUpload(file, setAddImageUrl, setUploadingAddImage);
                                                return false; // Ngăn chặn upload tự động
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />} loading={uploadingAddImage}>
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
                                <Col span={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="productStatus"
                                        valuePropName="checked"
                                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                                    >
                                        <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>

                    {/* Modal chỉnh sửa sản phẩm */}
                    <Modal
                        title="Chỉnh sửa sản phẩm"
                        visible={isEditModalOpen}
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
                                    }
                                    : {}
                            }
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên sản phẩm"
                                        name="productName"
                                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
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
                                        <InputNumber placeholder="Nhập giá" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Loại món ăn"
                                        name="typeFood"
                                        rules={[{ required: true, message: "Vui lòng chọn loại món ăn!" }]}
                                    >
                                        <Select placeholder="Chọn loại món ăn">
                                            <Option value="Mains">Mains</Option>
                                            <Option value="Desserts">Desserts</Option>
                                            <Option value="Drinks">Drinks</Option>
                                            {/* Thêm các loại khác nếu cần */}
                                        </Select>
                                    </Form.Item>
                                </Col>
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
                                        <InputNumber placeholder="Nhập số lượng" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Mô tả"
                                        name="description"
                                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                                    >
                                        <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ảnh sản phẩm"
                                        name="image"
                                        rules={[{ required: true, message: "Vui lòng upload ảnh sản phẩm!" }]}
                                    >
                                        <Upload
                                            name="image"
                                            listType="picture"
                                            showUploadList={false}
                                            beforeUpload={(file) => {
                                                handleImageUpload(file, setEditImageUrl, setUploadingEditImage);
                                                return false; // Ngăn chặn upload tự động
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />} loading={uploadingEditImage}>
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
                                <Col span={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="productStatus"
                                        valuePropName="checked"
                                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                                    >
                                        <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>

                    {/* Modal xác nhận xóa */}
                    <Modal
                        visible={confirmDeleteModalVisible}
                        onCancel={() => setConfirmDeleteModalVisible(false)}
                        footer={null}
                        centered
                        width={400}
                    >
                        <div style={{ textAlign: "center" }}>
                            <ExclamationCircleOutlined style={{ fontSize: "48px", color: "#ff4d4f" }} />
                            <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>Xác nhận xóa</h3>
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
                                    current: currentPage + 1, // Ant Design pagination bắt đầu từ 1
                                    pageSize: 20, // Phù hợp với backend
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
