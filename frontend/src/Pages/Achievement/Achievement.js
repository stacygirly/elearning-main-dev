import React, { useEffect, useState } from "react";
import "./Achievement.css";

import { useGetStudentAchievementsMutation } from "../../redux/api/studentsApi";
import { useSelector } from "react-redux";
import { useGetGroupAchievementsMutation } from "../../redux/api/groupsApi";
import { fullDate } from "../HelpFriend/HelpFriendDetails";

const Achievement = () => {
  const [activeTab, setActiveTab] = useState("individual");
  const [getStudentAchievements, { data: studentAchievementsData }] =
    useGetStudentAchievementsMutation();
  const [getGroupAchievements, { data: groupAchievementsData }] =
    useGetGroupAchievementsMutation();

    const student_details = JSON.parse(localStorage.getItem("student_details"));

  const userData = useSelector((state) => state.user.user);

  console.log("userData:", userData);

  useEffect(() => {
    getStudentAchievements({ student_id: userData?._id });
    getGroupAchievements({ group_id:  student_details?.group?._id});
  }, []);

  console.log(
    "student",
    studentAchievementsData,
    "group",
    groupAchievementsData
  );
  return (
    <div className="leader-board">
      <div className="">
        <div className="leaderbord-title">Achievements</div>
        <div className="tab-menu">
          <span
            onClick={() => setActiveTab("individual")}
            className={`${activeTab === "individual" && "active"}`}
          >
            Individual
          </span>
          <span
            onClick={() => setActiveTab("group")}
            className={`${activeTab === "group" && "active"}`}
          >
            Group
          </span>
        </div>
        {activeTab === "individual" ? (
          <div className="achievements-board-single-row">
            <div className="reason">Reason</div>
            <div>Date</div>
            <div className="amount">Amount</div>
          </div>
        ) : (
          <div className="achievements-board-single-row group-acheivement-rows">
            <div className="reason">Team Member</div>
            <div>Reason</div>
            <div>Date</div>
            <div className="amount">Amount</div>
          </div>
        )}
      </div>

      {activeTab === "individual" ? (
        <div className="tabmenu-content-table achivement-table">
          {studentAchievementsData?.data?.payload?.student_achievements?.map(
            (data) => (
              <div className="achievements-board-single-row-table">
                <div className="reason">{data?.reason}</div>
                <div>{fullDate(data.date)}</div>
                <div
                  className={`amount ${
                    data?.type === "credit"
                      ? "postive_amount"
                      : "nagative_amount"
                  }`}
                >
                  {`${
                    data?.type === "debit"
                      ? `-${data?.points}`
                      : `+${data?.points}`
                  }` || "-"}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="tabmenu-content-table achivement-table">
          {groupAchievementsData?.data?.payload?.group_achievements?.map(
            (data) => (
              <div className="achievements-board-single-row-table group-acheivement-rows">
                <div className="reason">{data?.team}</div>
                <div>{data?.reason}</div>
                <div>{fullDate(data?.date)}</div>
                <div
                  className={`amount ${
                    data?.type === "credit"
                      ? "postive_amount"
                      : "nagative_amount"
                  }`}
                >
                  {`${
                    data?.type === "debit"
                      ? `-${data?.points}`
                      : `+${data?.points}`
                  }` || "-"}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Achievement;
