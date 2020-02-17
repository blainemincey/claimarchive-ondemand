import React, {Component} from 'react';
import './App.css';
import {Container, Row, Col, Button} from "reactstrap";
import {css} from '@emotion/core';
import {RingLoader} from "react-spinners";
import BarChart from "./BarChart";
import Moment from "react-moment";
import ClaimService from "./services/ClaimService";

// Load env variables
const CLAIMS_BY_YEAR_URL = process.env.REACT_APP_CLAIMS_BY_YEAR_URL;
const TOTAL_CLAIMS_ARCHIVED_URL = process.env.REACT_APP_TOTAL_CLAIMS_URL;

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class App extends Component {
    constructor() {
        super();

        this.state = {
            data2010: '',
            is2010Loading: true,

            data2011: '',
            is2011Loading: true,

            data2012: '',
            is2012Loading: true,

            data2013: '',
            is2013Loading: true,

            data2014: '',
            is2014Loading: true,

            totalArchived: '',
            isTotalArchivedLoading: true
        };

        this.onClick = this.onClick.bind(this);
        this.isUnmounted = false;

    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    async getClaims(year) {
        console.log(CLAIMS_BY_YEAR_URL + year);
        return await ClaimService.getClaimsForYear(CLAIMS_BY_YEAR_URL + "/" + year);
    }

    async getTotalClaimsArchived() {
        let totalClaimResult = await ClaimService.getTotalClaimsArchived(TOTAL_CLAIMS_ARCHIVED_URL);
        if(totalClaimResult.length > 0) {
            console.log("total: " + totalClaimResult);
            this.setState({
                totalArchived: totalClaimResult,
                isTotalArchivedLoading: false
            });
        }
    }

    getDataByYear(year) {
        let resultData = this.getClaims(year);
        resultData.then(claimResults => {
           console.log("Results received for year: " + year );

            // be sure there is result data
            if (claimResults.length > 0) {
                switch (year) {
                    case 2010:
                        this.setState({
                            is2010Loading: false,
                            data2010: claimResults
                        });
                        break;

                    case 2011:
                        this.setState({
                            is2011Loading: false,
                            data2011: claimResults
                        });
                        break;

                    case 2012:
                        this.setState({
                            is2012Loading: false,
                            data2012: claimResults
                        });
                        break;

                    case 2013:
                        this.setState({
                            is2013Loading: false,
                            data2013: claimResults
                        });
                        break;

                    case 2014:
                        this.setState({
                            is2014Loading: false,
                            data2014: claimResults
                        });
                        break;

                    default:
                        console.error("Invalid year passed: " + year);
                        break;
                }
            }
        }).catch(error => {
            console.error(error);
        });
    }

    onClick() {
        // get the aggregation for each year
        this.getDataByYear(2010);
        this.getDataByYear(2011);
        this.getDataByYear(2012);
        this.getDataByYear(2013);
        this.getDataByYear(2014);

        // grab a total count of claims archived
        this.getTotalClaimsArchived();
    }

    render() {
        const {
            data2010, is2010Loading,
            data2011, is2011Loading,
            data2012, is2012Loading,
            data2013, is2013Loading,
            data2014, is2014Loading,
            totalArchived, isTotalArchivedLoading
        } = this.state;
        let renderResults;
        let theDate;

        if (!is2010Loading && !is2011Loading && !is2012Loading && !is2013Loading && !is2014Loading && !isTotalArchivedLoading) {
            theDate = <Moment format="dddd, MMMM Do YYYY, h:mm:ss a">{new Date()}</Moment>;

            renderResults =
                <Container>
                    <Row>
                        <Col style={{textAlign: "left"}}>
                            <h6>Total Claims Archived: {totalArchived}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <BarChart
                                results2010={data2010}
                                results2011={data2011}
                                results2012={data2012}
                                results2013={data2013}
                                results2014={data2014}
                            />
                        </Col>
                    </Row>
                </Container>
        } else {
            renderResults =
                <div className="justify-content-center">
                    <RingLoader size={150} color={"red"} css={override}/>
                    <h5 className="display-5" style={{textAlign: "center"}}>Waiting for data to become available...</h5>
                </div>
        }
        return (
            <div className="App-header">
                <Container className="flex-grow-1 mt-3">
                    <Row xs={1}>
                        <Col>
                            <h3 className="display-5" style={{textAlign: "center"}}>MongoDB Claim Archive Results</h3>
                        </Col>
                    </Row>
                    <hr className="style15"/>
                    <Row>
                        <Col style={{textAlign: "left"}}>
                            <h6>Results Updated: {theDate}</h6>
                        </Col>
                        <Col style={{textAlign: "right"}}>
                            <Button outline color="success" onClick={() => this.onClick()}>Load Archive Data</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr className="style13"/>
                        </Col>
                    </Row>
                    {renderResults}
                </Container>
            </div>
        )
    }
}

export default App;
