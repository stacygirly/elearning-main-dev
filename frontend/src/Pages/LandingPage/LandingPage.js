import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal } from "react-bootstrap";
import village1 from "../../Images/village1.png";
import village2 from "../../Images/village2.png";
import village3 from "../../Images/village3.png";
import village4 from "../../Images/village4.png";
import village5 from "../../Images/village5.png";
import village6 from "../../Images/village6.png";
import village7 from "../../Images/village7.png";
import village_map from "../../Images/village_map.png";
import drum from "../../Images/drum.png";
import grasses from "../../Images/grasses.png";
import hut from "../../Images/hut.png";
import river from "../../Images/river.png";
import shell from "../../Images/shell.png";
import shield from "../../Images/shield.png";
import trees from "../../Images/trees.png";
import { useMyContext } from "../../MyContextProvider";
import { toast } from "react-toastify";

const base_url = process.env.REACT_APP_BASE_URL;

function LandingPage() {
  const navigate = useNavigate()
  const { studentDetails, setStudentDetails } = useMyContext();
  const student_details = JSON.parse(localStorage.getItem("student_details"));
  useEffect(() => {
    setStudentDetails(student_details);
  }, []);

  const village_levels = {
    1: village1,
    2: village2,
    3: village3,
    4: village4,
    5: village5,
    6: village6,
    7: village7,
  };

  const next_item = {
    1: river,
    2: trees,
    3: hut,
    4: grasses,
    5: drum,
    6: shield,
  };

  const [show, setShow] = useState(false);

  const buyElement = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: student_details?.group?._id,
          points_debited: 50,
        }),
      };

      const response = await fetch(
        base_url + "/group/update_village_level",
        requestOptions
      );
      const data = await response.json();
      console.log("student details", data.data);

      const updatedStudentDetails = {
        student: student_details.student,
        group: data.data,
      };

      toast.success('Village level has been ungraded sucessfully')
      console.log("updated student details", updatedStudentDetails);

      setStudentDetails(updatedStudentDetails);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getStudentdetails = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: student_details.student._id,
        }),
      };

      const response = await fetch(
        base_url + "/student/get_student_details",
        requestOptions
      );
      const data = await response.json();
      console.log("student details", data.data);

      setStudentDetails(data.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if(!student_details) {
      navigate('/login')
    }
    getStudentdetails();
  }, []);

  return (
    <>
      <Container className="landing-heading" fluid>
        <Row className="row px-4 py-3">
          <Col className="left-col" xs={6}>
            <div className="heading">
              <h1>My Village</h1>
            </div>
          </Col>
          <Col xs={6} className="col-6 d-flex justify-content-end py-2">
            <button className="village-map-btn" onClick={() => setShow(true)}>
              View Village Map
            </button>
          </Col>
        </Row>
        {!studentDetails?.group && (
          <Row className="row px-4 py-3">
            <h3 className="mt-5">
              Join a group with your classmates to start your Village building
              Journey!!!
            </h3>
          </Row>
        )}

        {studentDetails?.group && (
          <Row className="landing-container ps-4">
            <Col xs={7} className="left-side">
              <img
                className="current-village"
                src={village_levels[studentDetails?.group?.village_level]}
                alt="eLearning Logo"
              />
              <p className="pt-3">
                My Current Village level -{" "}
                <span className="bold">
                  Level {studentDetails?.group?.village_level}
                </span>
              </p>
            </Col>
            {studentDetails?.group?.village_level < 7 && (
              <Col xs={5} className="right-side px-5">
                <div className="buy-element-div mx-3 pt-4">
                  <div className=" d-flex justify-content-around align-items-center">
                    {studentDetails?.group?.village_level == 1 && (
                      <img
                        className="next-element river"
                        src={next_item[studentDetails?.group?.village_level]}
                        alt="trees"
                      />
                    )}
                    {studentDetails?.group?.village_level != 1 && (
                      <img
                        className="next-element"
                        src={next_item[studentDetails?.group?.village_level]}
                        alt="trees"
                      />
                    )}
                    <span className="for">FOR</span>
                    <span>
                      <img className="shell me-1" src={shell} alt="Points" />
                      <span className="points mt-1">50</span>
                    </span>
                  </div>
                  <button
                    className="my-3 py-2 buy-btn"
                    onClick={buyElement}
                    disabled={studentDetails?.group?.current_points < 50}
                  >
                    BUY
                  </button>
                </div>
                <div className="mt-4">
                  <img
                    className="next-village"
                    src={
                      village_levels[studentDetails?.group?.village_level + 1]
                    }
                    alt="eLearning Logo"
                  />
                  <p className="pt-1">
                    Your village will look like this - Level{" "}
                    {studentDetails?.group?.village_level + 1}
                  </p>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Container>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        scrollable
        className="village-map-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Village Map
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <img className="p-3" src={village_map} alt="Village Map" />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LandingPage;
