import React from "react";
import { Button, Modal, Typography } from "antd";
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

type Custom = "blue" | "red";

export interface CustomUpdateStatusModalProps {
  custom?: Custom;
  isOpen?: boolean;
  title?: string;
  subTitle?: string[];
  textClose?: string;
  textConfirm?: string;
  handleClose?: () => void;
  handleConfirm?: () => void;
}

export default function CustomUpdateStatusModal(
  props: CustomUpdateStatusModalProps
) {
  const {
    custom,
    isOpen,
    textClose = "Back",
    textConfirm,
    subTitle,
    title,
    handleClose,
    handleConfirm,
  } = props;

  let icon;
  let confirmButtonStyle: "primary" | "default" | undefined;
  let confirmButtonText;
  let confirmButtonColor;

  switch (custom) {
    case "blue":
      icon = <InfoCircleOutlined style={{ fontSize: 48, color: "#1890ff" }} />;
      confirmButtonStyle = "primary";
      confirmButtonText = textConfirm || "Enable";
      confirmButtonColor = "#1890ff";
      break;
    case "red":
      icon = (
        <ExclamationCircleOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
      );
      confirmButtonStyle = "primary";
      confirmButtonText = textConfirm || "Disable";
      confirmButtonColor = "#ff4d4f";
      break;
    default:
      icon = null;
      confirmButtonStyle = "default";
      confirmButtonText = "Confirm";
  }

  return (
    <Modal
      visible={isOpen}
      footer={null}
      centered
      onCancel={handleClose}
      width={414}
      bodyStyle={{ padding: "24px", textAlign: "center" }}
    >
      <div style={{ marginBottom: 16 }}>{icon}</div>
      <Typography.Title level={4} style={{ color: "#000" }}>
        {title}
      </Typography.Title>
      {subTitle &&
        subTitle.map((line, index) => (
          <Typography.Text
            key={index}
            style={{ display: "block", color: "rgba(0, 0, 0, 0.65)" }}
          >
            {line}
          </Typography.Text>
        ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <Button onClick={handleClose} style={{ width: "48%" }}>
          {textClose}
        </Button>
        <Button
          type={confirmButtonStyle}
          onClick={handleConfirm}
          style={{
            width: "48%",
            backgroundColor: confirmButtonColor,
            color: "#ffffff !important",
            borderColor: confirmButtonColor,
          }}
        >
          {confirmButtonText}
        </Button>
      </div>
    </Modal>
  );
}
