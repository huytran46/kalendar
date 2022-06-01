import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import useAxios from "../../hooks/use-axios.hook";
import type { IStaff } from "../../shared/model/Staff";
import type { IStaffEvent } from "../../shared/model/StaffEvent";
import DayUtil from "../../shared/lib/day";

import "./Scheduling.scss";
import { useGlobalSetting } from "../../context/Setting.context";

interface ICreateEventForm {
  id: number;
  staff_id: number;
  name: string;
  hex_color: string;
  start_at: string;
  end_at: string;
}

const zodSchema = z.object({
  name: z.string().min(1, { message: "Event's name is required" }),
  hex_color: z.string().min(1, { message: "Hex color is required" }),
  start_at: z.string().min(1, { message: "Start time is required" }),
  end_at: z.string().min(1, { message: "End time is required" }),
});

const SchedulingPage: React.FC = () => {
  const settingContext = useGlobalSetting();

  const [selectedStaffId, setSelectedStaffId] = useState<number>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
    reset: resetForm,
    setError: setFormError,
  } = useForm<ICreateEventForm>({
    resolver: zodResolver(zodSchema),
  });

  const hexColorMemoized = watch("hex_color");

  const getStaffApiHook = useAxios<undefined, IStaff[]>("/staffs", "GET");

  const getSingleStaffApiHook = useAxios<undefined, IStaff>(
    `/staffs/${selectedStaffId}`,
    "GET"
  );

  const createStaffEventApiHook = useAxios<IStaffEvent, IStaffEvent>(
    "/events",
    "POST"
  );

  const getStaffEventsApiHook = useAxios<IStaffEvent, IStaffEvent>(
    "/events",
    "GET",
    null,
    false
  );

  const patchStaffAvailableEventNumbers = useAxios<Partial<IStaff>, IStaff>(
    `/staffs/${selectedStaffId}`,
    "PATCH"
  );

  const selectedStaffFullname = useMemo(() => {
    if (!getSingleStaffApiHook.data) return;
    return `${getSingleStaffApiHook.data.first_name} ${getSingleStaffApiHook.data.last_name}`;
  }, [getSingleStaffApiHook.data]);

  useEffect(() => {
    if (!getStaffApiHook.data || !getStaffApiHook.data.length) return;
    setSelectedStaffId(
      settingContext?.viewingStaffId ?? getStaffApiHook.data[0].id
    );
  }, [getStaffApiHook.data, settingContext?.viewingStaffId]);

  const onSubmit: SubmitHandler<ICreateEventForm> = async (payload) => {
    if (!selectedStaffId) return;
    try {
      const _startAt = DayUtil.parseSelectedDateTimeToUnix(payload.start_at);

      const _endAt = DayUtil.parseSelectedDateTimeToUnix(payload.end_at);

      if (_endAt <= _startAt) {
        setFormError("start_at", {
          message: "Start time must occur before the end time",
        });
        return;
      }

      const submitable: IStaffEvent = {
        id: Date.now(),
        name: payload.name,
        hex_color: payload.hex_color,
        staff_id: selectedStaffId,
        start_at: DayUtil.parseSelectedDateTimeToUnix(payload.start_at),
        end_at: DayUtil.parseSelectedDateTimeToUnix(payload.end_at),
      };
      await createStaffEventApiHook.execute(submitable);
      await getStaffEventsApiHook.execute(
        undefined,
        `/events?staff_id=${selectedStaffId}`
      );
      await patchStaffAvailableEventNumbers.execute({
        available_events: getSingleStaffApiHook?.data?.available_events + 1,
      });
      await getSingleStaffApiHook.execute();
      await getStaffApiHook.execute();
      resetForm();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="kalendar-scheduling-page">
      <div className="kalendar-scheduling-page-inner">
        <div className="kalendar-scheduling-page-title">
          <h1 className="kalendar-scheduling-page-title__text">
            Scheduling board
          </h1>
        </div>

        {/* ASIDE */}
        <aside className="kalendar-scheduling-page-sidebar">
          <h1 className="kalendar-scheduling-page-sidebar__title">Staffs</h1>
          {getStaffApiHook.loading ? (
            <p>Loading staff list...</p>
          ) : (
            getStaffApiHook.data?.map((staff) => (
              <div
                key={staff.id}
                className="kalendar-staff"
                onClick={() => setSelectedStaffId(staff.id)}
              >
                <div className="kalendar-staff__selection-section">
                  <div
                    className={`kalendar-staff__selection-section-icon ${
                      selectedStaffId === staff.id
                        ? "kalendar-staff__selection-section-icon__selected"
                        : ""
                    }`}
                  >
                    <i className="lni lni-checkmark-circle"></i>
                  </div>
                  <div className="kalendar-staff__info">
                    <div className="kalendar-staff__main">
                      <div className="kalendar-staff__main-name-section">
                        <span className="kalendar-staff__icon">
                          <i className="lni lni-user" />
                        </span>
                        <span className="kalendar-staff__name">
                          {staff.first_name + " " + staff.last_name}
                        </span>
                      </div>
                      <i className="lni lni-star"></i>
                    </div>
                    <small className="kalendar-staff__desc">
                      {staff.email}&nbsp;|&nbsp;
                      <i className="lni lni-calendar" />
                      &nbsp;:&nbsp;&nbsp;<span>{staff.available_events}</span>
                    </small>
                  </div>
                </div>
              </div>
            ))
          )}
        </aside>

        {/* MAIN */}
        <div className="kalendar-scheduling-page-main">
          <h2 className="kalendar-scheduling-page-main__title">
            Scheduling staff events
          </h2>
          {getSingleStaffApiHook.loading ? (
            <p>Loading staff information...</p>
          ) : (
            <div className="kalendar-scheduling-staff-form">
              <div className="kalendar-scheduling-staff-form__meta">
                <b>Fullname:</b> {selectedStaffFullname}
              </div>
              <div className="kalendar-scheduling-staff-form__meta">
                <b>Email:</b> {getSingleStaffApiHook.data?.email}
              </div>
              <div className="kalendar-scheduling-staff-form__meta">
                <b>Total available events:</b>{" "}
                {getSingleStaffApiHook.data?.available_events}
              </div>

              <form
                className="kalendar-scheduling-staff-form__body"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="kalendar-scheduling-staff-form__body-inner">
                  <span className="kalendar-scheduling-staff-form-group">
                    <label htmlFor="hex_color">Hex color:</label>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <input type="color" {...register("hex_color")} />
                      <small>&nbsp;{hexColorMemoized}</small>
                    </div>
                  </span>

                  <span className="kalendar-scheduling-staff-form-group">
                    <label htmlFor="name">Event name:</label>
                    <input
                      type="text"
                      placeholder="Ex: All-hands meeting"
                      style={{ minWidth: 240 }}
                      {...register("name")}
                    />
                  </span>

                  <span className="kalendar-scheduling-staff-form-group">
                    <label htmlFor="start_at">Start date & time:</label>
                    <input type="datetime-local" {...register("start_at")} />
                  </span>

                  <span className="kalendar-scheduling-staff-form-group">
                    <label htmlFor="end_at">End date & time:</label>
                    <input type="datetime-local" {...register("end_at")} />
                  </span>
                </div>

                <button
                  disabled={!selectedStaffId || createStaffEventApiHook.loading}
                  className="kalendar-scheduling-staff-form-action-button"
                  type="submit"
                >
                  Add event
                </button>
              </form>
              <code
                style={{
                  width: "100%",
                  color: "red",
                }}
              >
                {formErrors.name?.message && <p>{formErrors.name?.message}</p>}
                {formErrors.hex_color?.message && (
                  <p>{formErrors.hex_color?.message}</p>
                )}
                {formErrors.start_at?.message && (
                  <p>{formErrors.start_at?.message}</p>
                )}
                {formErrors.end_at?.message && (
                  <p>{formErrors.end_at?.message}</p>
                )}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulingPage;
