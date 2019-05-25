import React, { Component } from "react";
import './App.css'
import './bootstrap.css'

import Dropdown from 'react-dropdown'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label
} from 'recharts';

import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    // Initialize state here
    this.state = {
      drugNames: [],
      drugSelected: "ACETAMINOPHEN",
      deliveryMethods: [],
      deliverySelected: null,
      dosageAmounts: [],
      dosageSelected: null,
      data: [],
      viewportWidth: 0,
      viewportHeight: 0,
      screenOrientation: window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape'
    };

    // Bind event listening methods here
    this.handleDrugChange = this.handleDrugChange.bind(this);
    this.handleDeliveryChange = this.handleDeliveryChange.bind(this);
    this.handleDosageChange = this.handleDosageChange.bind(this);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.setScreenOrientation = this.setScreenOrientation.bind(this);
  }

  updateWindowDimensions() {
    let root = document.getElementById("root");
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0)

    this.setState({
      viewportWidth: Math.max(width, 1000),
      viewportHeight: Math.max(height, 600)
    });
  }

  setScreenOrientation = () => {
    this.updateWindowDimensions();

    if (window.matchMedia("(orientation: portrait)").matches) {
      this.setState({
        screenOrientation: 'landscape'
      });
    }

    else if (window.matchMedia("(orientation: landscape)").matches) {
      this.setState({
        screenOrientation: 'portrait'
      });
    }

  }

  componentDidMount() {
    // Get list of Drugs
    axios.get("/api/getDrugNames")
      .then(
        res => {
          let new_data = res.data.data.sort();
          this.setState({ drugNames: new_data })
        })
      .catch(err => console.log(err));

    // Fill in delivery method for the default drug
    axios.get("/api/getDeliveryMethods/" + this.state.drugSelected)
      .then(res => {
        let new_delivery = res.data.data.sort();
        this.setState({ deliveryMethods: new_delivery })
      })
      .catch(err => console.log(err));


    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('orientationchange', this.setScreenOrientation);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('orientationchange', this.setScreenOrientation);

  }

  handleDrugChange = (event) => {
    const drugName = event.value;
    this.setState({
      drugSelected: drugName,
      deliveryMethods: [],
      deliverySelected: null,
      dosageAmounts: [],
      dosageSelected: null,
      data: []
    });

    axios.get("/api/getDeliveryMethods/" + drugName)
      .then(res => {
        let new_delivery = res.data.data.sort();
        this.setState({
          deliveryMethods: new_delivery
        })
      })
      .catch(err => console.log(err));

  }

  handleDeliveryChange = (event) => {
    const deliverySelected = event.value;
    this.setState({
      deliverySelected: deliverySelected,
      dosageAmounts: [],
      dosageSelected: null,
      data: []
    });

    axios.get("/api/getDosageAmounts/?drugName=" + this.state.drugSelected + "&deliveryMethod=" + deliverySelected)
      .then(res => {
        var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        let new_dosages = res.data.data.sort(collator.compare);
        this.setState({
          dosageAmounts: new_dosages
        })
      })
      .catch(err => console.log(err));

  }

  handleDosageChange = (event) => {
    const dosageSelected = event.value;
    this.setState({
      dosageSelected: dosageSelected
    });

    axios.get("/api/getData/?drugName=" + this.state.drugSelected + "&deliveryMethod=" + this.state.deliverySelected + "&dosage=" + dosageSelected)
      .then(res => this.setState({
        data: res.data.data
      }))
      .catch(err => console.log(err));

  }

  render() {
    const { drugNames, drugSelected, deliveryMethods, deliverySelected, dosageAmounts, dosageSelected, data, viewportWidth, viewportHeight, screenOrientation } = this.state;
    //console.log("drugSelected", drugSelected, "deliveryMethod", deliverySelected, "dosageSelected", dosageSelected)
    console.log("viewportWidth", viewportWidth, "viewportHeight", viewportHeight, "orientation", screenOrientation)
    console.log("window", window.innerHeight );
    console.log("client", document.documentElement.clientHeight)
    const defaultOption = drugSelected;

    // let minprice = null;
    let maxprice = null;
    if (data.length > 0) {
      const mean_price = data.map(d => d["mean_price"]);
      // minprice = Math.min(...mean_price);
      maxprice = special_round(Math.max(...mean_price));
    }


    return (
      <div id="app-container">

        <div className="container">
          <div className="row">
            <div className="col-sm custom-col-style">
              <h1 className="header" >Drug</h1>
              <Dropdown className="dropdown-custom" options={drugNames} onChange={this.handleDrugChange} value={defaultOption} placeholder="Select a drug" />
            </div>
            <div className="col-sm custom-col-style">
              <h1 className="header">Delivery</h1>
              <Dropdown className="dropdown-custom" options={deliveryMethods} onChange={this.handleDeliveryChange} value={deliverySelected === null ? null : deliverySelected} placeholder="Select a delivery method" />
            </div>
            <div className="col-sm custom-col-style">
              <h1 className="header">Dosage</h1>
              <Dropdown className="dropdown-custom" options={dosageAmounts} disabled={deliverySelected === null ? true : false} value={dosageSelected === null ? null : dosageSelected} onChange={this.handleDosageChange} placeholder="Select a dosage" />
            </div>
          </div>
        </div>

        {data.length > 0 ?
          <BarChart
            width={viewportWidth}
            height={viewportHeight}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 350,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="category"
              dataKey="_id"
              angle={-90}
              textAnchor="end"
              interval={0}
            >
            </XAxis>
            <YAxis type="number" domain={[0, maxprice]}>
              <Label angle={-90} value='Price' position='insideLeft' style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="mean_price" fill="#8884d8" />
          </BarChart>
          : null}

      </div>
    );
  }
}

export default App;

const CustomTooltip = ({ active, payload, label }) => {
  let mean_price = null;
  let max_price = null;
  let min_price = null;
  let total_records = null;
  // let values = null;
  let std_dev = null;
  let description = null;
  if (payload[0]) {
    mean_price = round(payload[0].payload.mean_price)
    max_price = round(payload[0].payload.max_price)
    min_price = round(payload[0].payload.min_price)
    total_records = payload[0].payload.total_records
    // values = payload[0].payload.values
    std_dev = round(payload[0].payload.standard_deviation)
    description = payload[0].payload.description
  }

  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        {total_records > 1 ?
          <div>
            <p className="sublabel">
              {`Average Price: ${mean_price}`}<br />
              {`Max Price: ${max_price}`}<br />
              {`Min Price: ${min_price}`}<br />
              {`Total Records: ${total_records}`}<br />
              {/* {`Values: ${values}`}<br/> */}
              {`Standard Deviation: ${std_dev}`}<br />
              {`Raw Description: ${description}`}
            </p>
          </div>
          :
          <div>
            <p className="sublabel">
              {`Price: ${mean_price}`}<br />
              {`Raw Description: ${description}`}
            </p>
          </div>}
      </div>
    );
  }

  return null;
};

function round(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function special_round(num) {
  let n = num;
  let i = 0;
  if (n > 10) {
    while (n > 10) {
      n = n / 10;
      i+=1;
    }
    return Math.ceil(n) * Math.pow(10,i);
  }
  else{
    return n;
  }
}

/* 
72.11
7.21 i = 1
round(7.21) -> 8.00
8.00 * 10^1 = 80

*/