import React, { Component } from "react";
import Dropdown from 'react-dropdown'
import './App.css'
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
      dosageSelected: null
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
      dosageSelected: null
    });

    console.log("http://localhost:3001/api/getDosageAmounts/?drugName=" + this.state.drugSelected + "&deliveryMethod=" + deliverySelected);

    fetch("http://localhost:3001/api/getDosageAmounts/?drugName=" + this.state.drugSelected + "&deliveryMethod=" + deliverySelected)
    .then(data => data.json())
    .then(res => this.setState({ 
      dosageAmounts: res.data 
    }));

  }


  render() {
    const { drugNames, drugSelected, deliveryMethods, deliverySelected, dosageAmounts, dosageSelected } = this.state;
    console.log("drugSelected", drugSelected, "deliveryMethod", deliverySelected)
    const defaultOption = drugSelected;

    return (
      <div>
        <h1>Drug</h1>
        <Dropdown options={drugNames} onChange={this.handleDrugChange} value={defaultOption} placeholder="Select a drug" />
        <h1>Delivery</h1>
        <Dropdown options={deliveryMethods} onChange={this.handleDeliveryChange} value={deliverySelected === null ? null : deliverySelected} placeholder="Select a delivery method" />
        <h1>Dosage</h1>
        <Dropdown options={dosageAmounts} disabled={deliverySelected === null ? true : false} value={dosageSelected === null ? null : dosageSelected} onChange={this.handleDosageChange} placeholder="Select a dosage" />

      </div>
    );
  }
}

export default App;