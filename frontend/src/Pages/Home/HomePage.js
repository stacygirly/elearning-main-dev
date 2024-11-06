import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from "../../components/PageTitle";
import OutlineButton from "../../components/Button";
import { Button, Col, Container, Row } from "react-bootstrap";
import village from "../../Images/village.png";
import village2 from "../../Images/village2.png";
import trees from "../../Images/trees.png";
import shellColor from "../../Images/shell_color.png";
import Modal from "../../components/Model";
import villageMap from "../../Images/home/modal_image.svg";
import { useUpdateVillageLevelMutation } from "../../redux/api/groupsApi";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateVillageLevel,{data:updateVillageLevelData}]=useUpdateVillageLevelMutation()

  const userData = useSelector(state=>state.user.user);

  console.log(userData, "userData")

  const updateVillageMap = async() => {
    await updateVillageLevel({village_level: 5, group_id: userData?.group_id || "65e78093bd39e727b8872332", points_debited: userData?.grade})
  }

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
              <PageTitle text={"My Village"} />
              <div onClick={() => setIsModalOpen(true)}>
                <OutlineButton text={"View Village Map"} />
              </div>
            </div>
            <Row
              style={{
                backgroundColor: "white",
              }}
            >
              <Col sm={6}>
                <div>
                  <img src={village} alt="village" style={{ width: "100%" }} />
                  <p
                    style={{
                      fontSize: "30px",
                      fontWeight: "400",
                      color: "rgba(203, 94, 33, 1)",
                    }}
                  >
                    My current Village Level -{" "}
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: "600",
                      }}
                    >
                      Level 2
                    </span>
                  </p>
                </div>
              </Col>
              <Col className="offset-1" sm={5}>
                <div>
                  <div
                    style={{
                      backgroundColor: "rgba(241, 213, 179, 1)",
                      marginBottom: "3rem",
                      padding: "32px 20px 30px 20px",
                    }}
                    className="d-flex flex-column"
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(241, 213, 179, 1)",
                      }}
                      className="d-flex justify-content-around  align-items-center"
                    >
                      <div>
                        <img
                          width={"169px"}
                          height={"171px"}
                          src={trees}
                          alt="trees"
                        />
                      </div>
                      <div
                        style={{
                          color: "rgba(97, 41, 9, 1)",
                          fontSize: "20px",
                        }}
                      >
                        FOR
                      </div>
                      <div className="d-flex  align-items-center">
                        <img
                          width={"101.44px"}
                          height={"84.42px"}
                          src={shellColor}
                          alt="trees"
                        />
                        <span
                          style={{
                            color: "rgba(192, 73, 6, 1)",
                            fontSize: "48px",
                            fontWeight: "700",
                          }}
                        >
                          70
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "40px",
                        padding: "1rem",
                      }}
                    >
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#CB5E21",
                          padding: "11px",
                          fontSize: "32px",
                          border: "2px solid #8B3B0E",
                        }}
                        onClick={() => updateVillageMap()}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <img src={village2} alt="village" />
                    <p
                      style={{
                        color: "rgba(203, 94, 33, 1)",
                        fontSize: "20px",
                        fontWeight: "400",
                      }}
                    >
                      Your village will look like this - Level 3
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={"Village Map"}
        content={
          <div className="pt-4 pb-4">
            <img src={villageMap} alt="village-map" />
          </div>
        }
      />
    </>
  );
};

export default HomePage;
