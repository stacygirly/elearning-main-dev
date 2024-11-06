import React, { useEffect, useState } from "react";
import { Container, Dropdown, Row } from "react-bootstrap";
import PageTitle from "../../components/PageTitle";
import "../HelpFriend/HelpFriend.css";
import calender_icon from "../../Images/refer-friend/calender_icon.svg";
import post_question from "../../Images/modal/post_question.svg";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Model";
import {
  useLazyGetMyQuestionsQuery,
  usePostQuestionMutation,
} from "../../redux/api/questionsApi";
import { QUESTION_TOPICS } from "../../utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


export const getFormattedDate = (date) => {
  const newDate = new Date(date);
  return `${newDate.getDate()} ${newDate.toLocaleString("default", {
    month: "short",
  })}`;
};
const PostQuestion = () => {
  const [questionState, setQuestionState] = useState({
    question: "",
    description: "",
    topic: QUESTION_TOPICS[0],
  });
  const navigate = useNavigate();
  // const [getPostQuestionList,{data:postQustionsList}]=usePostQuestionMutation();
  // const [getAllQuestions,{data:getAllQuestion}]= useGetAllQuestionsMutation()
  const [getMyQuestions, { data: myQuestions ,isLoading:questionLoading}] = useLazyGetMyQuestionsQuery();
  const [postQuestion, { isLoading, isError }] = usePostQuestionMutation();
  const userData = useSelector((state) => state.user?.user);

  useEffect(() => {
    getMyQuestions({
      start_date: new Date("03-03-2023"),
      end_date: new Date(),
      topic: questionState?.topic,
      student_id: userData?._id,
    });
    // getPostQuestionList()
  }, [questionState?.topic]);

  console.log(myQuestions, "myQuestions");
  console.log("post quesiton res", isError, isLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuestionState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(questionState);
    postQuestion({ ...questionState, student_id: userData?._id })
      .then((res) => {
        console.log("res", res);
        toast.success('Question Posted Successfully')
        setIsModalOpen(false);
      })
      .catch((err) => {
        toast.error('Some Error Occured')
        console.log("err", err);
      });
  };
  return (
    <>
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
              <PageTitle text={"MY QUESTIONS"} />

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
                   { QUESTION_TOPICS.map((topic)=>(
                   <Dropdown.Item  name={topic} onClick={(e)=>{
                    setQuestionState((prevState) => ({
                      ...prevState,
                      topic: e.target.name,
                    }));
                   }} active={questionState.topic===topic} >{topic}</Dropdown.Item>))}
            
                  </Dropdown.Menu>
                </Dropdown>
                {/* <div
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/question-of-the-day")}
                >
                  <img src={calender_icon} alt="calender" />
                </div> */}
                <div
                  className="answer-posting"
                  style={{ margin: 0, padding: 0 }}
                >
                  <button
                    style={{ padding: "2px 16px" }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Post a Question
                  </button>
                </div>
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
              >{
                questionLoading && <h3 style={{display:'flex',justifyContent:'center'}}>Loading...</h3>
              }
                {myQuestions?.data?.map((value, index) => {
                  return (
                    <div
                      key={index}
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
                        navigate(`/post-question-details/${value?._id}`)
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
                })}
              </div>
            </Row>
          </div>
        </div>
      </Container>
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={
          <div className="post-que-modal-head">
            <img src={post_question} alt="post question" />
            <span>Post a Question</span>
          </div>
        }
        content={
          <>
            <div className="post-que-form">
              <div className="form-field-sec">
                <span>Add a Title for the Question</span>
                <input
                  name="question"
                  value={questionState?.question}
                  onChange={handleChange}
                  placeholder="Example : How to  handle send and Download postman using Karate framework"
                />
              </div>
              <div className="form-field-sec">
                <span>What are the details of your Question?</span>
                <input
                  name="description"
                  value={questionState?.description}
                  onChange={handleChange}
                  placeholder="Enter the details of your problem"
                />
              </div>
              
              <div className="form-field-sec">
                <span>What is the name of the Topic?</span>
                <Dropdown className="dropdon-main" >
                <Dropdown.Toggle
                    variant="success"
                    className="dropdown-title"
                    id="dropdown-basic"
                    style={{minWidth:'110px'}}
                  >
                     {questionState?.topic}
                  </Dropdown.Toggle>
                <Dropdown.Menu>
                   { QUESTION_TOPICS.slice(1).map((topic)=>(
                   <Dropdown.Item  name={topic} onClick={(e)=>{
                    const { name } = e.target;
                    setQuestionState((prevState) => ({
                      ...prevState,
                      topic: name,
                    }));
                   }} active={questionState.topic===topic} >{topic}</Dropdown.Item>))}
            
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <button className="form-submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </>
        }
      />
    </>
  );
};

export default PostQuestion;
