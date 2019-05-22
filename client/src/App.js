import React, { Component } from "react";
import './App.css'
import Dropdown from 'react-dropdown'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label
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

      id: 0,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null
    };

    // Bind event listening methods here
    this.handleDrugChange = this.handleDrugChange.bind(this);
    this.handleDeliveryChange = this.handleDeliveryChange.bind(this);
    this.handleDosageChange = this.handleDosageChange.bind(this);

  }

  componentDidMount() {
    // Get list of Drugs
    fetch("http://localhost:3001/api/getDrugNames")
      .then(data => data.json())
      .then(res => this.setState({ drugNames: res.data }));

    // Fill in delivery method for the default drug
    fetch("http://localhost:3001/api/getDeliveryMethods/" + this.state.drugSelected)
      .then(data => data.json())
      .then(res => this.setState({ deliveryMethods: res.data }));

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

    fetch("http://localhost:3001/api/getDeliveryMethods/" + drugName)
      .then(data => data.json())
      .then(res => this.setState({
        deliveryMethods: res.data
      }));

  }

  handleDeliveryChange = (event) => {
    const deliverySelected = event.value;
    this.setState({
      deliverySelected: deliverySelected,
      dosageAmounts: [],
      dosageSelected: null,
      data: []
    });

    console.log("http://localhost:3001/api/getDosageAmounts/?drugName=" + this.state.drugSelected + "&deliveryMethod=" + deliverySelected);

    fetch("http://localhost:3001/api/getDosageAmounts/?drugName=" + this.state.drugSelected + "&deliveryMethod=" + deliverySelected)
      .then(data => data.json())
      .then(res => this.setState({
        dosageAmounts: res.data
      }));

  }

  handleDosageChange = (event) => {
    const dosageSelected = event.value;
    this.setState({
      dosageSelected: dosageSelected
    });

    fetch("http://localhost:3001/api/getData/?drugName=" + this.state.drugSelected + "&deliveryMethod=" + this.state.deliverySelected + "&dosage=" + dosageSelected)
      .then(data => data.json())
      .then(res => this.setState({
        data: res.data
      }));

  }

  render() {
    const { drugNames, drugSelected, deliveryMethods, deliverySelected, dosageAmounts, dosageSelected, data } = this.state;
    console.log("drugSelected", drugSelected, "deliveryMethod", deliverySelected, "dosageSelected", dosageSelected)
    const defaultOption = drugSelected;
    let minprice = null;
    let maxprice = null;
    if (data.length > 0){
      const price = data.map(d => d["price"]);
      minprice = Math.min(...price);
      maxprice = Math.max(...price);
    }

    return (
      <div>
        <h1>Drug</h1>
        <Dropdown options={drugNames} onChange={this.handleDrugChange} value={defaultOption} placeholder="Select a drug" />
        <h1>Delivery</h1>
        <Dropdown options={deliveryMethods} onChange={this.handleDeliveryChange} value={deliverySelected === null ? null : deliverySelected} placeholder="Select a delivery method" />
        <h1>Dosage</h1>
        <Dropdown options={dosageAmounts} disabled={deliverySelected === null ? true : false} value={dosageSelected === null ? null : dosageSelected} onChange={this.handleDosageChange} placeholder="Select a dosage" />

        {data.length > 0 ?
        <BarChart
          width={1800}
          height={600}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 350,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="category" 
            dataKey="hospital"
            angle={-90} 
            textAnchor="end"
            interval={0}
            >
            {/* <Label value='Hospital' position='bottom' style={{textAnchor: 'middle'}}/> */}
          </XAxis>
          <YAxis type="number" domain={[0,maxprice]}>
            <Label angle={-90} value='Price' position='insideLeft' style={{textAnchor: 'middle'}}/>
          </YAxis>
          <Tooltip />
          <Bar dataKey="price" fill="#8884d8" />
        </BarChart>:null}
      </div>
    );
  }
}

export default App;