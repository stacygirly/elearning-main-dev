import React, { useEffect, useState } from "react";
import { Container, Dropdown, Row } from "react-bootstrap";
import PageTitle from "../../components/PageTitle";
import "./HelpFriend.css";
import calender_icon from "../../Images/refer-friend/calender_icon.svg";
import search_icon from "../../Images/refer-friend/search_icon.svg";
import { useNavigate } from "react-router-dom";
import { useLazyGetAllQuestionsQuery } from "../../redux/api/questionsApi";
import { getFormattedDate } from "../PostQuestion/PostQuestion";
import { QUESTION_TOPICS } from "../../utils";
import { useSelector } from "react-redux";

const HelpFriend = () => {
  const navigate = useNavigate();
  const [getAllQuestions, { data: apiData, isLoading }] =
    useLazyGetAllQuestionsQuery();
  const [topicState, setTopicState] = useState(QUESTION_TOPICS[0]);
  useEffect(() => {
    getAllQuestions({ topic: topicState });
  }, [topicState]);
  const userData = useSelector((state) => state.user.user);
  console.log("user Data:", userData);
  const [data, setData] = useState();

  useEffect(() => {
    //Remove the object which created_by is the same as the student_id
    setData(
      apiData?.data?.filter((value) => {
        if (!value.created_by) return value;
        else if (value.created_by !== userData?._id) {
          return value;
        }
        return null;
      })
    );
  }, [apiData]);

  return (
    <Container
      style={{
        maxWidth: "95%",
      }}
    >
      <div>
        <div className="home-container">
          <div
            style={{
              marginBottom: "5rem",
            }}
            className="header mt-4 d-flex justify-content-between align-items-center "
          >
            <PageTitle text={"HELP A FRIEND"} />

            <div className="header-right-container">
              <Dropdown className="dropdown-main">
                <Dropdown.Toggle
                  variant="success"
                  className="dropdown-title"
                  id="dropdown-basic"
                >
                  Question Topic
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {QUESTION_TOPICS.map((topic) => (
                    <Dropdown.Item
                      name={topic}
                      onClick={(e) => {
                        setTopicState(e.target.name);
                      }}
                      active={topicState === topic}
                    >
                      {topic}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {/* <div
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/question-of-the-day")}
              >
                <img src={calender_icon} alt="calender" />
              </div>
              <div className="search-container">
                <img src={search_icon} alt="calender" className="search_icon" />
                <input placeholder="Search a student" />
              </div> */}
            </div>
          </div>
          <Row
            style={{
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {isLoading ? (
                <h4>Loading...</h4>
              ) : (
                data?.map((value) => {
                  return (
                    <div
                      key={value?._id}
                      style={{
                        background: "rgba(203, 94, 33, 0.5)",
                        marginBottom: "3rem",
                        flex: "0 0 30%",
                        boxSizing: "border-box",
                        padding: "10px 0 39px 20px",
                        border: "1px solid rgba(97, 41, 9, 1)",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(`/help-friend-details/${value?._id}`)
                      }
                    >
                      <div
                        style={{
                          textAlign: "left",
                        }}
                        className="card-content"
                      >
                        <p
                          style={{
                            color: " rgba(0, 0, 0, 1)",
                            marginBottom: "0px",
                            fontSize: "20px",
                            maxWidth: "303px",
                          }}
                        >
                          {" "}
                          {value?.question}
                        </p>
                        <span
                          style={{
                            color: "rgba(139, 59, 14, 1)",
                            fontSize: "18px",
                          }}
                        >
                          {getFormattedDate(value?.date_posted)}
                        </span>
                        <div
                          style={{
                            fontSize: "25px",
                          }}
                          className="mt-4"
                        >
                          Topic:{" "}
                          <span
                            style={{
                              fontWeight: "700",
                            }}
                          >
                            {value?.topic}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "25px",
                          }}
                        >
                          Answers: <span>{value?.answers?.length}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default HelpFriend;
