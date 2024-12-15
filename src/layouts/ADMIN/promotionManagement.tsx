// src/layouts/ADMIN/promotionManagement.tsx

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

import {
    fetchPromotionList,
    createPromotion,
    updatePromotion,
    deletePromotion,
} from "../../api/apiAdmin/promotionApi";
import axios from "axios";
import * as XLSX from 'xlsx';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PromotionInput } from "../../models/AdminModels/PromotionInput";
import PromotionAdmin from "../../models/AdminModels/Promotion"; // Đảm bảo đường dẫn chính xác
import dayjs from "dayjs";
import useDebounce from "../customer/component/useDebounce";
import FormatMoney from "../customer/component/FormatMoney";


const { Option } = Select;
const { confirm } = Modal;

// Cấu hình Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dn2ot5mo6'; // Thay thế bằng Cloud name của bạn
const CLOUDINARY_UPLOAD_PRESET = 'urvibegs'; // Thay thế bằng Upload preset của bạn

const PromotionManagement: React.FC = () => {
    // Trạng thái cho các modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [editPromotion, setEditPromotion] = useState<PromotionAdmin | null>(null);
    const [confirmDeletePromotionId, setConfirmDeletePromotionId] = useState<number | null>(null);
    
    // Trạng thái dữ liệu
    const [promotions, setPromotions] = useState<PromotionAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Trạng thái tải dữ liệu
    const [savingPromotion, setSavingPromotion] = useState<boolean>(false);
    const [deletingPromotion, setDeletingPromotion] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0); // Chỉ số trang hiện tại (bắt đầu từ 0)
    const [totalPromotions, setTotalPromotions] = useState<number>(0); // Tổng số khuyến mãi
    const [searchText, setSearchText] = useState<string>("");

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

    // Hàm lấy danh sách khuyến mãi từ backend
    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        try {
            const { data, totalPages, totalElements } = await fetchPromotionList(
                currentPage,
                debouncedSearchText,
            );

            setPromotions(data);
            setTotalPromotions(totalElements);
        } catch (error) {
            handleApiError(error, "Không thể lấy danh sách khuyến mãi.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchText, handleApiError]);

    // Reset trang hiện tại khi tìm kiếm hoặc lọc thay đổi
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchText]);

    // Lấy danh sách khuyến mãi khi trang hiện tại, tìm kiếm hoặc lọc thay đổi
    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    // Hàm mở modal chỉnh sửa khuyến mãi
    const openEditModal = useCallback(
        (promotion: PromotionAdmin) => {
            setEditPromotion(promotion);
            setIsEditModalOpen(true);
            setEditImageUrl(promotion.image || null); // Khởi tạo với URL ảnh hiện tại
            editForm.setFieldsValue({
                ...promotion,
                startDate: dayjs(promotion.startDate).format("YYYY-MM-DDTHH:mm"),
                endDate: dayjs(promotion.endDate).format("YYYY-MM-DDTHH:mm"),
            });
        },
        [editForm]
    );

    // Hàm mở modal thêm mới khuyến mãi
    const openAddModal = useCallback(() => {
        setEditPromotion(null);
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

    // Hàm xử lý thêm mới khuyến mãi
    const handleSaveNewPromotion = useCallback(async () => {
        try {
            // Xác thực form và lấy dữ liệu mới
            const newPromotionData = await addForm.validateFields();

            // Kiểm tra xem ảnh có được upload chưa
            if (!addImageUrl) {
                notification.error({
                    message: "Yêu cầu ảnh",
                    description: "Vui lòng upload ảnh khuyến mãi trước khi lưu.",
                });
                return;
            }

            setSavingPromotion(true);

            // Tạo đối tượng khuyến mãi mới
            const newPromotion: PromotionInput = {
                promotionName: newPromotionData.promotionName,
                description: newPromotionData.description,
                promotionType: newPromotionData.promotionType,
                promotionValue: newPromotionData.promotionValue,
                type_food: newPromotionData.type_food,
                startDate: newPromotionData.startDate,
                endDate: newPromotionData.endDate,
                promotionStatus: newPromotionData.promotionStatus,
                image: addImageUrl,
                unitPrice: newPromotionData.unitPrice, // Thêm đơn giá
            };

            // Gọi API để tạo khuyến mãi mới
            const createdPromotion = await createPromotion(newPromotion);

            // Cập nhật lại danh sách khuyến mãi sau khi tạo mới thành công
            setPromotions((prev) => [createdPromotion, ...prev]);

            // Cập nhật tổng số khuyến mãi
            setTotalPromotions((prev) => prev + 1);

            // Hiển thị thông báo thành công
            notification.success({
                message: "Thêm khuyến mãi",
                description: "Khuyến mãi mới đã được thêm thành công!",
            });

            // Đóng modal và reset form
            setIsAddModalOpen(false);
            addForm.resetFields();
            setAddImageUrl(null);
        } catch (error) {
            handleApiError(error, "Có lỗi xảy ra khi thêm khuyến mãi.");
        } finally {
            setSavingPromotion(false);
        }
    }, [addForm, addImageUrl, handleApiError]);

    // Hàm xử lý cập nhật khuyến mãi
    const handleSaveEditPromotion = useCallback(async () => {
        try {
            const updatedPromotionData = await editForm.validateFields();

            if (!editImageUrl) {
                notification.error({
                    message: "Yêu cầu ảnh",
                    description: "Vui lòng upload ảnh khuyến mãi trước khi lưu.",
                });
                return;
            }

            if (editPromotion) {
                setSavingPromotion(true);

                // Tạo đối tượng updatedPromotion
                const updatedPromotion: Partial<PromotionInput> = {
                    promotionName: updatedPromotionData.promotionName,
                    description: updatedPromotionData.description,
                    promotionType: updatedPromotionData.promotionType,
                    type_food: updatedPromotionData.type_food,
                    promotionValue: updatedPromotionData.promotionValue,
                    startDate: updatedPromotionData.startDate,
                    endDate: updatedPromotionData.endDate,
                    promotionStatus: updatedPromotionData.promotionStatus,
                    image: editImageUrl,
                    unitPrice: updatedPromotionData.unitPrice, // Thêm đơn giá
                };

                // Cập nhật thông tin khuyến mãi
                const result = await updatePromotion(editPromotion.promotion, updatedPromotion);

                // Cập nhật lại danh sách khuyến mãi sau khi sửa thành công
                setPromotions((prev) =>
                    prev.map((promo) =>
                        promo.promotion === editPromotion.promotion ? { ...promo, ...result } : promo
                    )
                );

                notification.success({
                    message: "Cập nhật khuyến mãi",
                    description: "Khuyến mãi đã được cập nhật thành công!",
                });

                setIsEditModalOpen(false);
                setEditImageUrl(null);
            }
        } catch (error) {
            handleApiError(error, "Có lỗi xảy ra khi cập nhật khuyến mãi.");
        } finally {
            setSavingPromotion(false);
        }
    }, [editForm, editPromotion, editImageUrl, handleApiError]);

    // Hàm xử lý xóa khuyến mãi
    const handleDeletePromotion = useCallback((promotionId: number) => {
        setConfirmDeletePromotionId(promotionId);
        setConfirmDeleteModalVisible(true);
    }, []);

    // Hàm xác nhận xóa khuyến mãi
    const handleConfirmDeletePromotion = useCallback(async () => {
        if (confirmDeletePromotionId !== null) {
            try {
                setDeletingPromotion(true);
                await deletePromotion(confirmDeletePromotionId);
                setPromotions((prev) => prev.filter((p) => p.promotion !== confirmDeletePromotionId));
                setTotalPromotions((prev) => prev - 1);
                notification.success({
                    message: "Xóa khuyến mãi",
                    description: "Khuyến mãi đã được xóa thành công!",
                });
                setConfirmDeleteModalVisible(false);
                setConfirmDeletePromotionId(null);
            } catch (error) {
                console.error(error);
                handleApiError(error, "Có lỗi xảy ra khi xóa khuyến mãi.");
            } finally {
                setDeletingPromotion(false);
            }
        }
    }, [confirmDeletePromotionId, handleApiError, deletePromotion]);

    // Hàm cập nhật trạng thái khuyến mãi
    const handleUpdatePromotionStatus = useCallback(
        async (promotionId: number, checked: boolean) => {
            const newStatus = checked;
            try {
                const updatedPromotion = { promotionStatus: newStatus };
                const result = await updatePromotion(promotionId, updatedPromotion);
                setPromotions((prev) =>
                    prev.map((promo) =>
                        promo.promotion === promotionId ? { ...promo, ...result } : promo
                    )
                );
                notification.success({
                    message: "Cập nhật trạng thái",
                    description: `Khuyến mãi đã được ${newStatus ? "kích hoạt" : "ẩn"} thành công!`,
                });
            } catch (error) {
                console.error(error);
                handleApiError(error, "Có lỗi xảy ra khi cập nhật trạng thái khuyến mãi.");
            }
        },
        [handleApiError, updatePromotion]
    );

    // Định nghĩa các cột cho bảng
    const columns = useMemo<ColumnsType<PromotionAdmin>>(
        () => [
            {
                title: "Mã khuyến mãi",
                dataIndex: "promotion",
                key: "promotion",
                sorter: (a, b) => a.promotion - b.promotion,
                width: 100,
            },
            {
                title: "Tên khuyến mãi",
                dataIndex: "promotionName",
                key: "promotionName",
                sorter: (a, b) => a.promotionName.localeCompare(b.promotionName),
                width: 150,
            },
            {
                title: "Mô tả",
                dataIndex: "description",
                key: "description",
                ellipsis: true,
                width: 200,
            },
            {
                title: "Giá trị khuyến mãi (%)",
                dataIndex: "promotionValue",
                key: "promotionValue",
                sorter: (a, b) => a.promotionValue - b.promotionValue,
                render: (value: number) => `${value}%`,
                width: 150,
            },
            {
                title: "Đơn Giá (VNĐ)",
                dataIndex: "unitPrice",
                key: "unitPrice",
                sorter: (a, b) => a.unitPrice - b.unitPrice,
                render: (value: number) => `${FormatMoney(value)}`,
                width: 120,
            },
            {
                title: "Loại món ăn",
                dataIndex: "type_food",
                key: "type_food",
                width: 150,
            },
            {
                title: "Loại khuyến mãi",
                dataIndex: "promotionType",
                key: "promotionType",
                width: 200,
                render: (type: string) => {
                    switch(type) {
                        case 'DISCOUNT%':
                            return 'Giảm Giá theo phần trăm';
                        case 'DISCOUNT-':
                            return 'Trừ tiền trực tiếp';
                        default:
                            return type;
                    }
                }
            },
            {
                title: "Ảnh",
                dataIndex: "image",
                key: "image",
                render: (image: string, record) => (
                    <Image  
                        src={image || "https://via.placeholder.com/100"}
                        alt={`${record.promotionName} image`}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        width={100}
                        height={100}
                        fallback="https://via.placeholder.com/100"
                    />
                ),
                width: 100,
            },
            {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                key: "startDate",
                render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
                sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
                width: 150,
            },
            {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                key: "endDate",
                render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
                sorter: (a, b) => dayjs(a.endDate).unix() - dayjs(b.endDate).unix(),
                width: 150,
            },
            {
                title: "Trạng thái",
                dataIndex: "promotionStatus",
                key: "promotionStatus",
                render: (status: boolean, record: PromotionAdmin) => (
                    <Switch
                        checked={status}
                        onChange={(checked) => handleUpdatePromotionStatus(record.promotion, checked)}
                        checkedChildren="Hiển thị"
                        unCheckedChildren="Ẩn"
                    />
                ),
                filters: [
                    { text: "Hiển thị", value: true },
                    { text: "Ẩn", value: false },
                ],
                onFilter: (value, record) => record.promotionStatus === value,
                width: 100,
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
                            aria-label={`Chỉnh sửa ${record.promotionName}`}
                        />
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeletePromotion(record.promotion)}
                            aria-label={`Xóa ${record.promotionName}`}
                        />
                    </Space>
                ),
                width: 100,
            },
        ],
        [handleUpdatePromotionStatus, openEditModal, handleDeletePromotion]
    );

    // Xử lý thay đổi của bảng (phân trang, lọc)
    const handleTableChange = useCallback(
        (pagination: any, filters: any, sorter: any) => {
            const newPage = pagination.current - 1;

            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }
        },
        [currentPage]
    );

    // Các hàm xuất dữ liệu
    const exportToExcel = () => {
        const dataToExport = promotions.map((promo) => ({
            "Mã khuyến mãi": promo.promotion,
            "Tên khuyến mãi": promo.promotionName,
            "Mô tả": promo.description,
            "Giá trị khuyến mãi (%)": promo.promotionValue,
            "Đơn Giá (VNĐ)": promo.unitPrice, // Thêm Đơn Giá
            "Loại món ăn": promo.type_food,
            "Loại khuyến mãi": promo.promotionType,
            "Ngày bắt đầu": dayjs(promo.startDate).format("YYYY-MM-DD HH:mm"),
            "Ngày kết thúc": dayjs(promo.endDate).format("YYYY-MM-DD HH:mm"),
            "Trạng thái": promo.promotionStatus ? "Hiển thị" : "Ẩn",
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Promotions');

        // Tạo buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Lưu file
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'promotions.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        notification.success({
            message: 'Xuất Excel thành công',
            description: 'File Excel đã được tải xuống.',
        });
    };

    const exportToCSV = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [
                ['Mã khuyến mãi', 'Tên khuyến mãi', 'Mô tả', 'Giá trị khuyến mãi (%)', 'Đơn Giá (VNĐ)', 'Loại món ăn', 'Loại khuyến mãi', 'Ngày bắt đầu', 'Ngày kết thúc', 'Trạng thái'],
                ...promotions.map((item) => [
                    item.promotion,
                    item.promotionName,
                    item.description,
                    item.promotionValue,
                    item.unitPrice, // Thêm Đơn Giá
                    item.type_food,
                    item.promotionType,
                    dayjs(item.startDate).format("YYYY-MM-DD HH:mm"),
                    dayjs(item.endDate).format("YYYY-MM-DD HH:mm"),
                    item.promotionStatus ? "Hiển thị" : "Ẩn",
                ]),
            ]
                .map((e) => e.join(','))
                .join('\n');

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'promotions.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        notification.success({
            message: 'Xuất CSV thành công',
            description: 'File CSV đã được tải xuống.',
        });
    };

    const exportToPDF = async () => {
        const fontUrl = '/fonts/Roboto-Black.ttf'; // Đảm bảo đường dẫn font đúng
        try {
            const pdfDoc = await PDFDocument.create();
            pdfDoc.registerFontkit(fontkit); // Đăng ký fontkit
            const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
            const customFont = await pdfDoc.embedFont(fontBytes);

            let page = pdfDoc.addPage([595.28, 841.89]); // Kích thước A4
            const { width, height } = page.getSize();
            const margin = 50;

            // Tiêu đề
            page.drawText('Danh Sách Khuyến Mãi', {
                x: margin,
                y: height - margin,
                size: 18,
                font: customFont,
                color: rgb(0, 0.53, 0.71),
            });

            // Bảng dữ liệu
            const tableHeader = ['Mã KM', 'Tên KM', 'Giá trị (%)', 'Đơn Giá (VNĐ)', 'Loại món ăn', 'Loại KM', 'Ngày bắt đầu', 'Ngày kết thúc', 'Trạng thái'];
            let yPosition = height - margin - 40;
            const cellWidth = [60, 100, 80, 100, 100, 100, 100, 100, 80];

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

            // Data rows
            for (const promo of promotions) {
                const rowData = [
                    promo.promotion.toString(),
                    promo.promotionName || '',
                    promo.promotionValue.toString(),
                    FormatMoney(promo.unitPrice), // Thêm Đơn Giá
                    promo.type_food || '',
                    promo.promotionType || '',
                    dayjs(promo.startDate).format("YYYY-MM-DD HH:mm"),
                    dayjs(promo.endDate).format("YYYY-MM-DD HH:mm"),
                    promo.promotionStatus ? 'Hiển thị' : 'Ẩn',
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
                if (yPosition < margin + 20) {
                    page = pdfDoc.addPage([595.28, 841.89]);
                    yPosition = height - margin - 40;

                    // Redraw headers on new page
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
                }
            }

            const pdfBytes = await pdfDoc.save();

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "DanhSachKhuyenMai.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();

            notification.success({
                message: 'Xuất PDF thành công',
                description: 'File PDF đã được tải xuống.',
            });
        } catch (error) {
            console.error('Error during PDF generation:', error);
            notification.error({
                message: 'Lỗi xuất PDF',
                description: 'Đã xảy ra lỗi khi tạo file PDF.',
            });
        }
    };

    return (
        <div className="container-fluid">
            <div className="main-content">
                <div className="promotion-management">
                    <h2>Quản lý khuyến mãi</h2>
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
                                placeholder="Tìm kiếm khuyến mãi..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                style={{ width: 300, marginRight: 16 }}
                            />
                        </div>
                        <div className="btn-export-excel" style={{ display: 'flex', alignItems: "center" }}>
                            <Button onClick={exportToExcel} style={{ marginRight: 8 }}>
                                Xuất Excel
                            </Button>
                            <Button onClick={exportToCSV} style={{ marginRight: 8 }}>
                                Xuất CSV
                            </Button>
                            <Button onClick={exportToPDF}>
                                Xuất PDF
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
                            Thêm khuyến mãi
                        </Button>
                    </div>

                    {/* Modal thêm khuyến mãi */}
                    <Modal
                        title="Thêm khuyến mãi mới"
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
                                onClick={handleSaveNewPromotion}
                                loading={savingPromotion}
                                disabled={savingPromotion}
                            >
                                Lưu
                            </Button>,
                        ]}
                        destroyOnClose={true} // Đảm bảo modal bị unmount khi đóng
                        width={800}
                        style={{ maxWidth: '90%' }}
                    >
                        <Form form={addForm} layout="vertical" initialValues={{ promotionStatus: true }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên khuyến mãi"
                                        name="promotionName"
                                        rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi!" }]}
                                    >
                                        <Input placeholder="Nhập tên khuyến mãi" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Loại khuyến mãi"
                                        name="promotionType"
                                        rules={[{ required: true, message: "Vui lòng chọn loại khuyến mãi!" }]}
                                    >
                                        <Select placeholder="Chọn loại khuyến mãi">
                                            <Option value="DISCOUNT%">Giảm Giá theo phần trăm</Option>
                                            <Option value="DISCOUNT-">Trừ tiền trực tiếp</Option>
                                            {/* Thêm các loại khác nếu cần */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Loại món ăn"
                                        name="type_food"
                                        rules={[{ required: true, message: "Vui lòng chọn loại món ăn!" }]}
                                    >
                                        <Select placeholder="Chọn loại món ăn">
                                            <Option value="hotpot">Hotpot</Option>
                                            <Option value="meat">Meat</Option>
                                            <Option value="seafood">Seafood</Option>
                                            <Option value="noodles">Noodles</Option>
                                            <Option value="mushroom">Mushroom</Option>
                                            <Option value="vegetables">Vegetables</Option>
                                            <Option value="meatballs">Meatballs</Option>
                                            <Option value="buffet_tickets">Buffet Tickets</Option>
                                            <Option value="soft_drinks">Soft Drinks</Option>
                                            <Option value="mixers">Mixers</Option>
                                            {/* Thêm các loại khác nếu cần */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Giá trị khuyến mãi (%)"
                                        name="promotionValue"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập giá trị khuyến mãi!" },
                                            {
                                                type: "number",
                                                min: 1,
                                                message: "Giá trị khuyến mãi phải từ 1",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá trị khuyến mãi (%)"
                                            style={{ width: "100%" }}
                                            min={1}
                                            
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Đơn Giá (VNĐ)"
                                        name="unitPrice"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập đơn giá!" },
                                            {
                                                type: "number",
                                                min: 0,
                                                message: "Đơn giá phải là số không âm!",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập đơn giá (VNĐ)"
                                            style={{ width: "100%" }}
                                            formatter={(value) =>
                                                value ? `VNĐ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
                                            }
                                            parser={(value?: string) => value ? value.replace(/VNĐ\s?|(,*)/g, "") : ''}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày bắt đầu"
                                        name="startDate"
                                        rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                                    >
                                        <Input type="datetime-local" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày kết thúc"
                                        name="endDate"
                                        rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
                                    >
                                        <Input type="datetime-local" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="promotionStatus"
                                        valuePropName="checked"
                                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                                    >
                                        <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ảnh khuyến mãi"
                                        name="image"
                                        rules={[{ required: true, message: "Vui lòng upload ảnh khuyến mãi!" }]}
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
                                        <Image
                                            src={addImageUrl || "https://via.placeholder.com/100"}
                                            alt="Ảnh khuyến mãi"
                                            style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                                            width={100}
                                            height={100}
                                            fallback="https://via.placeholder.com/100"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Mô tả"
                                        name="description"
                                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                                    >
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={addForm.getFieldValue('description') || ''}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                addForm.setFieldsValue({ description: data });
                                            }}
                                            config={{
                                                toolbar: [
                                                    'heading',
                                                    '|',
                                                    'bold',
                                                    'italic',
                                                    'link',
                                                    'bulletedList',
                                                    'numberedList',
                                                    'blockQuote',
                                                    'undo',
                                                    'redo'
                                                ],
                                                
                                            }}
                                           
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>

                    {/* Modal chỉnh sửa khuyến mãi */}
                    <Modal
                        title="Chỉnh sửa khuyến mãi"
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
                                onClick={handleSaveEditPromotion}
                                loading={savingPromotion}
                                disabled={savingPromotion}
                            >
                                Lưu thay đổi
                            </Button>,
                        ]}
                        destroyOnClose={true} // Đảm bảo modal bị unmount khi đóng
                        width={800}
                        style={{ maxWidth: '90%' }}
                    >
                        <Form
                            form={editForm}
                            layout="vertical"
                            initialValues={
                                editPromotion
                                    ? {
                                        ...editPromotion,
                                        startDate: dayjs(editPromotion.startDate).format("YYYY-MM-DDTHH:mm"),
                                        endDate: dayjs(editPromotion.endDate).format("YYYY-MM-DDTHH:mm"),
                                    }
                                    : {}
                            }
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên khuyến mãi"
                                        name="promotionName"
                                        rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi!" }]}
                                    >
                                        <Input placeholder="Nhập tên khuyến mãi" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Loại khuyến mãi"
                                        name="promotionType"
                                        rules={[{ required: true, message: "Vui lòng chọn loại khuyến mãi!" }]}
                                    >
                                        <Select placeholder="Chọn loại khuyến mãi">
                                            <Option value="DISCOUNT%">Giảm Giá theo phần trăm</Option>
                                            <Option value="DISCOUNT-">Trừ tiền trực tiếp</Option>
                                            {/* Thêm các loại khác nếu cần */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Loại món ăn"
                                        name="type_food"
                                        rules={[{ required: true, message: "Vui lòng chọn loại món ăn!" }]}
                                    >
                                        <Select placeholder="Chọn loại món ăn">
                                            <Option value="hotpot">Hotpot</Option>
                                            <Option value="meat">Meat</Option>
                                            <Option value="seafood">Seafood</Option>
                                            <Option value="noodles">Noodles</Option>
                                            <Option value="mushroom">Mushroom</Option>
                                            <Option value="vegetables">Vegetables</Option>
                                            <Option value="meatballs">Meatballs</Option>
                                            <Option value="buffet_tickets">Buffet Tickets</Option>
                                            <Option value="soft_drinks">Soft Drinks</Option>
                                            <Option value="mixers">Mixers</Option>
                                            {/* Thêm các loại khác nếu cần */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Giá trị khuyến mãi (%)"
                                        name="promotionValue"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập giá trị khuyến mãi!" },
                                            {
                                                type: "number",
                                                min: 1,
                                                message: "Giá trị khuyến mãi phải từ 1",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá trị khuyến mãi (%)"
                                            style={{ width: "100%" }}
                                            min={1}
                                            
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Đơn Giá (VNĐ)"
                                        name="unitPrice"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập đơn giá!" },
                                            {
                                                type: "number",
                                                min: 0,
                                                message: "Đơn giá phải là số không âm!",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập đơn giá (VNĐ)"
                                            style={{ width: "100%" }}
                                            formatter={(value) =>
                                                value ? `VNĐ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
                                            }
                                            parser={(value?: string) => value ? value.replace(/VNĐ\s?|(,*)/g, "") : ''}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày bắt đầu"
                                        name="startDate"
                                        rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                                    >
                                        <Input type="datetime-local" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày kết thúc"
                                        name="endDate"
                                        rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
                                    >
                                        <Input type="datetime-local" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="promotionStatus"
                                        valuePropName="checked"
                                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                                    >
                                        <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ảnh khuyến mãi"
                                        name="image"
                                        rules={[{ required: true, message: "Vui lòng upload ảnh khuyến mãi!" }]}
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
                                        <Image
                                            src={editImageUrl || "https://via.placeholder.com/100"}
                                            alt="Ảnh khuyến mãi"
                                            style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                                            width={100}
                                            height={100}
                                            fallback="https://via.placeholder.com/100"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Mô tả"
                                        name="description"
                                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                                    >
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editForm.getFieldValue('description') || ''}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                editForm.setFieldsValue({ description: data });
                                            }}
                                            config={{
                                                toolbar: [
                                                    'heading',
                                                    '|',
                                                    'bold',
                                                    'italic',
                                                    'link',
                                                    'bulletedList',
                                                    'numberedList',
                                                    'blockQuote',
                                                    'undo',
                                                    'redo'
                                                ],
                                                
                                            }}
                                           
                                        />
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
                        destroyOnClose={true} // Đảm bảo modal bị unmount khi đóng
                    >
                        <div style={{ textAlign: "center" }}>
                            <ExclamationCircleOutlined style={{ fontSize: "48px", color: "#ff4d4f" }} />
                            <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>Xác nhận xóa</h3>
                            <p style={{ fontSize: "16px" }}>
                                Bạn có chắc chắn muốn xóa khuyến mãi này không?
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
                                    onClick={handleConfirmDeletePromotion}
                                    loading={deletingPromotion}
                                    disabled={deletingPromotion}
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

                    {/* Bảng khuyến mãi */}
                    <div className="table-container" style={{ overflow: "auto" }}>
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <Spin tip="Đang tải khuyến mãi..." />
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={promotions}
                                rowKey="promotion" // Đảm bảo rằng 'promotion' là khóa duy nhất
                                pagination={{
                                    current: currentPage + 1, // Ant Design pagination bắt đầu từ 1
                                    pageSize: 20, // Phù hợp với backend
                                    total: totalPromotions,
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

export default PromotionManagement;
