import React, {Component} from "react";
import {HorizontalBar} from "react-chartjs-2";

const claimTypes = ["Accident", "Dental", "Disability", "Hospital", "Illness", "Life", "Vision"];

class BarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results2010: this.props.results2010,
            results2011: this.props.results2011,
            results2012: this.props.results2012,
            results2013: this.props.results2013,
            results2014: this.props.results2014
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.results2010 !== prevState.results2010) &&
            (nextProps.results2011 !== prevState.results2011) &&
            (nextProps.results2012 !== prevState.results2012) &&
            (nextProps.results2013 !== prevState.results2013) &&
            (nextProps.results2014 !== prevState.results2014)) {
            return {
                results2010: nextProps.results2010,
                results2011: nextProps.results2011,
                results2012: nextProps.results2012,
                results2013: nextProps.results2013,
                results2014: nextProps.results2014
            }
        } else {
            return null;
        }
    }

    prepareResults(results) {
        let json = JSON.parse(results);
        let filledClaimTypes = json.map((claimType) => claimType._id);
        return claimTypes.map(claimType => {
            const indexFilledData = filledClaimTypes.indexOf(claimType);
            if (indexFilledData !== -1) {
                return json[indexFilledData].total;
            } else {
                return null;
            }
        });
    }

    render() {
        const {results2010, results2011, results2012, results2013, results2014} = this.state;

        // let's be sure the data is formatted properly so the chart can be drawn
        // ensure there is at least a value for each claim type even if 0
        let array2010 = this.prepareResults(results2010);
        let array2011 = this.prepareResults(results2011);
        let array2012 = this.prepareResults(results2012);
        let array2013 = this.prepareResults(results2013);
        let array2014 = this.prepareResults(results2014);

        const data = {
            labels: claimTypes,
            datasets: [
                {
                    data: array2010,
                    label: '2010',
                    stack: 1,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    datalabels: {
                        color: 'white',
                        font: {
                            size: '12'
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                },
                {
                    data: array2011,
                    label: '2011',
                    stack: 2,
                    backgroundColor: 'rgba(175,255,27,0.2)',
                    borderColor: 'rgb(175,255,27)',
                    hoverBackgroundColor: 'rgba(175,255,27,0.4)',
                    hoverBorderColor: 'rgba(175,255,27,1)',
                    datalabels: {
                        color: 'white',
                        font: {
                            size: '12'
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                },
                {
                    data: array2012,
                    label: '2012',
                    stack: 3,
                    backgroundColor: 'rgba(20,109,255,0.2)',
                    borderColor: 'rgb(20,109,255)',
                    hoverBackgroundColor: 'rgba(20,109,255,0.4)',
                    hoverBorderColor: 'rgba(20,109,255,1)',
                    datalabels: {
                        color: 'white',
                        font: {
                            size: '12'
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                },
                {
                    data: array2013,
                    label: '2013',
                    stack: 4,
                    backgroundColor: 'rgba(255,15,227,0.2)',
                    borderColor: 'rgb(255,15,227)',
                    hoverBackgroundColor: 'rgba(255,15,227,0.4)',
                    hoverBorderColor: 'rgba(255,15,227,1)',
                    datalabels: {
                        color: 'white',
                        font: {
                            size: '12'
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                },
                {
                    data: array2014,
                    label: '2014',
                    stack: 5,
                    backgroundColor: 'rgba(255,9,34,0.2)',
                    borderColor: 'rgb(255,9,34)',
                    hoverBackgroundColor: 'rgba(255,9,34,0.4)',
                    hoverBorderColor: 'rgba(255,9,34,1)',
                    datalabels: {
                        color: 'white',
                        font: {
                            size: '12'
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                }
            ]
        };

        const options = {
            elements: {
                rectangle: {
                    borderWidth: 2,
                    borderSkipped: 'left'
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Claims Archive Results',
                fontColor: 'white',
                fontSize: 16
            },
            plugins: {},
            layout: {
                padding: {
                    bottom: 5,
                    top: 5,
                    left: 1,
                    right: 1
                }
            },
            legend: {
                position: 'top',
                labels: {
                    fontColor: 'white'
                }
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        fontColor: 'white',
                        fontSize: 16
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Claims',
                        fontColor: 'white'
                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        fontColor: 'white',
                        fontSize: 16
                    }
                }]
            }
        };

        return (
            <div style={{position: 'relative', backgroundColor: 'lt-gray'}}>
                <HorizontalBar data={data} options={options} width={400} height={700}/>
            </div>
        );
    }
}

export default BarChart;