import { Query } from "react-apollo";
import gql from "graphql-tag";
import React, { Component } from "react";
import CreatePosition from "./CreatePosition";
import "font-awesome/css/font-awesome.min.css";
import FontAwesome from "react-fontawesome";

const RESUME_QUERY = gql`
  query {
    resume {
      id
      name
      address
      positions {
        id
        position
        description
        year
      }
    }
  }
`;

class Resume extends Component {
  state = {
    showForm: false
  };

  updatePositions = (cache, { data: { createPosition } }) => {
    const { resume } = cache.readQuery({ query: RESUME_QUERY });
    cache.writeQuery({
      query: RESUME_QUERY,
      data: {
        resume: {
          ...resume,
          positions: resume.positions.concat(createPosition.position)
        }
      }
    });
  };

  handleAddRecord = _ => {
    this.setState(prevState => ({ showForm: !prevState.showForm }));
  };

  render() {
    const { showForm } = this.state;

    return (
      <Query query={RESUME_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching..</div>;
          if (error) return <div>Error!</div>;
          return (
            <div
              className="container rounded shadow-lg h-100 main-div"
              style={{ padding: "3% 7%" }}
            >
              <div className="row justify-content-center align-items-center">
                <img
                  src="https://d1qb2nb5cznatu.cloudfront.net/users/1817833-large?1465999996"
                  className="img-fluid img-shape"
                  alt="usman-asif-img"
                />
              </div>
              <h1 className="name row justify-content-center align-items-center pt-4 m-0">
                {data.resume.name}
              </h1>

              <span className="email row justify-content-center align-items-centers">
                {data.resume.address}
              </span>

              <h5 className="row p-3 m-0" style={{ display: "inline-block" }}>
                Experience
              </h5>
              {!showForm && (
                <FontAwesome
                  name="plus"
                  style={{
                    backgroundColor: "#008000bf",
                    padding: "4px 15px",
                    borderRadius: 15,
                    color: "white",
                    cursor: "pointer"
                  }}
                  onClick={this.handleAddRecord}
                />
              )}
              {showForm && (
                <FontAwesome
                  name="times"
                  style={{
                    backgroundColor: "#db2b2b",
                    padding: "4px 15px",
                    borderRadius: 15,
                    color: "white",
                    cursor: "pointer"
                  }}
                  onClick={this.handleAddRecord}
                />
              )}
              {showForm && (
                <CreatePosition
                  onCreatePosition={this.updatePositions}
                  closeForm={this.handleAddRecord}
                />
              )}

              {data.resume.positions.map(position => (
                <div
                  key={position.id}
                  className="card"
                  style={{
                    border: "none",
                    borderTop: "1px #D2D2D2 solid",
                    borderRadius: 0
                  }}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{ display: "inline-block", verticalAlign: "sub" }}
                    >
                      {position.position}
                    </h5>
                    <h6
                      className="card-subtitle mb-2 text-muted"
                      style={{
                        display: "inline-block",
                        float: "right",
                        marginTop: 5
                      }}
                    >
                      {position.year}
                    </h6>
                    <p className="card-text">{position.description}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}
export default Resume;
