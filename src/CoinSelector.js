import React, { Component } from 'react';
import { Select } from "antd";

class CoinSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedValues: "",
		  	coinData: [],
		  	apiUrl: 'http://localhost:8080'
		};
		this.timerId = null;
	}
	  
    componentDidMount() {
		this.getCoinPrice()
		this.timerId = setInterval(() => {
			console.log("Updating coin data...");
			this.getCoinPrice()
		  }, 3600000);
	}
	
	componentWillUnmount() {
		if (this.timerId) {
		  clearInterval(this.timerId);
		}
	}

	getCoinPrice(){
		fetch('http://localhost:8080/getCoin')
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			this.setState({ coinData: this.cleanData(data) });
		})
		.catch((error) => {
			console.log("error on loading coin prices: "+ error);
		});
	}

	cleanData(data) {
		console.log(data);
		if(data !== undefined) {
			var  js = JSON.stringify(data);
			var data = JSON.parse(js);
			var rates = data.body.rates;
			return Object.entries(rates).map(([key, value]) => ({
				label: key,
				value,
			}));
		}
		return this.state.coinData;
	}

	handleChange = (selectedValues) => {
		this.setState({ selectedValue: selectedValues });
	};
	
	render() {
		return (
		  <div>
			 <Select
				mode="single"
				style={{ width: 200, marginTop: 20  }}
				placeholder="Select coin"
				onChange={this.handleChange}
				>
				{this.state.coinData.map(({ label, value }) => (
					<Select.Option value={value} key={label}>
					{label}
					</Select.Option>
				))}
			</Select>
	
			<div style={{ marginTop: 20 }}>
			  <h3>Selected Coin in EUR:</h3>
			  <p>{this.state.selectedValue || "No coin selected"}</p>
			</div>
		  </div>
		);
	  }
	}
 
export default CoinSelector;                      
