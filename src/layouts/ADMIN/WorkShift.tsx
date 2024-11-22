import React from "react";
import { Tabs, TabsProps, theme } from "antd";
import StickyBox from "react-sticky-box";
import Scheduleworkshifts from "./Scheduleworkshifts";
import WorkShiftCalendar from "./WorkShiftCalendar";

const items = [
  {
    label: "Danh sách nhân viên",
    key: "1",
    children: <WorkShiftCalendar />,
  },
  {
    label: "Lịch làm việc",
    key: "2",
    children: <Scheduleworkshifts />,
  },
];

const WorkShift: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderTabBar: TabsProps["renderTabBar"] = (
    props,
    DefaultTabBar: React.ComponentType<any>
  ) => (
    <StickyBox offsetTop={5} offsetBottom={0} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
    </StickyBox>
  );

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="main-content">
          <Tabs
            defaultActiveKey="1"
            renderTabBar={renderTabBar}
            items={items}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default WorkShift;
