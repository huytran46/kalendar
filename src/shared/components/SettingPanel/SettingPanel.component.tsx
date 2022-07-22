import React, { useEffect, useMemo } from "react";
import Select from "react-select";
import { useGlobalSetting } from "../../../context/Setting.context";
import useAxios from "../../../hooks/use-axios.hook";
import { IStaff } from "../../model/Staff";
import "./SettingPanel.scss";

const SettingPanel: React.FC = () => {
  const { setSetting, minutesPerRow, viewingStaffId, rowHeightInPx } =
    useGlobalSetting();

  const getStaffsApiHook = useAxios<undefined, IStaff[]>("/staffs", "GET");

  const staffOptions = useMemo(() => {
    if (
      !getStaffsApiHook.data?.length ||
      getStaffsApiHook.loading ||
      getStaffsApiHook.error
    )
      return [];
    return getStaffsApiHook.data.map((staff) => ({
      label: `🙎🏻‍♂️ ${staff.first_name} ${staff.last_name}`,
      value: staff,
    }));
  }, [getStaffsApiHook]);

  const currentSelectedStaff = useMemo(() => {
    if (!staffOptions?.length) return;
    return staffOptions.find((opt) => opt.value.id === viewingStaffId);
  }, [staffOptions, viewingStaffId]);

  // set default staff
  useEffect(() => {
    if (!staffOptions.length || viewingStaffId || !setSetting) return;
    setSetting?.((prev) => ({
      ...prev,
      viewingStaffId: staffOptions[0].value.id,
    }));
  }, [viewingStaffId, staffOptions]);

  return (
    <div className="kalendar-setting-panel">
      <h3>
        <b style={{ textTransform: "uppercase" }}>Simplaq Website 2</b>
      </h3>
      <h4>📡&nbsp;Control panel</h4>
      <span>|</span>

      <label htmlFor="viewingStaffId">
        <h5>Viewing</h5>
      </label>
      <Select
        options={staffOptions ?? []}
        value={currentSelectedStaff}
        isLoading={getStaffsApiHook.loading}
        onChange={(newSelectedStaff) =>
          setSetting?.((prev) => ({
            ...prev,
            viewingStaffId: newSelectedStaff?.value?.id,
          }))
        }
        styles={{
          input: (base) => ({
            ...base,
            width: 160,
          }),
        }}
      />

      <label htmlFor="minutesPerRow">
        <h5>Minutes per row:</h5>
      </label>
      <input
        name="minutesPerRow"
        type="number"
        min={0}
        max={60}
        step={15}
        value={minutesPerRow}
        onChange={(e) => {
          const _value =
            parseInt(e.target.value, 10) < 1 ? 1 : parseInt(e.target.value, 10);
          setSetting?.((prev) => ({ ...prev, minutesPerRow: _value }));
        }}
      />
      <small>minute(s)</small>

      <label htmlFor="rowHeightInPx">
        <h5>Row height ( in px ):</h5>
      </label>
      <input
        name="rowHeightInPx"
        type="number"
        min={16}
        value={rowHeightInPx}
        style={{ width: 80 }}
        onChange={(e) => {
          const _value =
            parseInt(e.target.value, 10) <= 1
              ? 16
              : parseInt(e.target.value, 10);

          setSetting?.((prev) => ({
            ...prev,
            rowHeightInPx: _value,
          }));
        }}
      />
      <small>px</small>
      {/* 
      <label htmlFor="daysToShow">
        <h5># of days to show:</h5>
      </label>
      <input
        name="daysToShow"
        type="number"
        min={7}
        max={30}
        value={daysToShow}
        style={{ width: 80 }}
        onChange={(e) => {
          const _value =
            parseInt(e.target.value, 10) === 0
              ? 16
              : parseInt(e.target.value, 10);
          setSetting((prev) => ({ ...prev, daysToShow: _value }));
        }}
      />
      <small>day(s)</small> */}
    </div>
  );
};

export default SettingPanel;
