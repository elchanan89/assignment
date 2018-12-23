import React, { Component } from 'react';
import Data from '../clients.json';
import Map from './Map.component';

class CompaniesData extends Component {
    constructor(props) {
        super(props)

        // Load data
        this.customers = Data.Customers;

        // Use uniq func to avoid duplicate value.
        // Sorted by number of cities, highest first 
        this.countries = this.uniq(this.customers, "Country").sort(
            (a, b) => this.findListByCondition(this.customers, "Country", b, "City").length -
                this.findListByCondition(this.customers, "Country", a, "City").length
        );

        // Default view
        this.defaultView = {};
        this.defaultView["country"] = this.countries[0];
        this.defaultView["cities"] = this.loadCountryCities(this.defaultView.country);
        this.defaultView["companies"] = this.loadCompaniesList(this.defaultView.cities[0]);
        this.defaultView["companyLocation"] = this.findListByCondition(this.customers, "CompanyName", this.defaultView.companies[0], "Address")[0];

        this.state = {
            citiesList: this.defaultView.cities,
            companiesList: this.defaultView.companies,
            companyLocation: this.defaultView.companyLocation,

            // An indication for a pressed button
            countryBtn: this.defaultView.country,
            cityBtn: this.defaultView.cities[0],
            companyBtn: this.defaultView.companies[0]
        }

        // Google maps api-key
        this.apiKey = window.prompt("Please insert your access api-Key (for: Google maps API)");

        this.loadCities = this.loadCities.bind(this);
        this.loadCompanies = this.loadCompanies.bind(this);
        this.loadCompanyLocation = this.loadCompanyLocation.bind(this);
    }

    // --------------------------------------------------------- Functions section
    loadCities = e => {
        var name = e.target.innerText;
        this.setState({
            citiesList: this.loadCountryCities(name),

            // Reset companies list
            companiesList: [],

            //  Reset cityBtn
            cityBtn: "",

            //  Reset companyBtn
            companyBtn: "",

            countryBtn: name
        });
    }

    loadCompanies = e => {
        var name = e.target.innerText;
        this.setState({
            companiesList: this.loadCompaniesList(name),
            cityBtn: name,

            //  Reset companyBtn
            companyBtn: ""
        });
    }

    loadCompanyLocation = e => {
        var name = e.target.innerText;
        this.setState({
            companyLocation: this.findListByCondition(this.customers, "CompanyName", name, "Address")[0],
            companyBtn: name
        });
    }

    uniq(arr, fieldName) {
        var uniqList = [];

        for (var index = 0; index < arr.length; ++index) {

            if (!this.isExist(uniqList, arr[index][fieldName])) {

                uniqList.push(arr[index][fieldName]);
            }
        }

        return uniqList;
    }

    isExist(arr, name) {
        var isFind = false;

        for (var index = 0; index < arr.length; ++index) {

            if (arr[index] === name) {
                isFind = true;
                break;
            }
        }

        return isFind;
    }

    // Load city list, sorted by number of companies, highest first 
    loadCountryCities(countryName) {
        return this.findListByCondition(this.customers, "Country", countryName, "City").sort(
            (a, b) => this.findListByCondition(this.customers, "City", b, "CompanyName").length -
                this.findListByCondition(this.customers, "City", a, "CompanyName").length
        );
    }

    // Load company list, In alphabetical order
    loadCompaniesList(cityName) {
        return this.findListByCondition(this.customers, "City", cityName, "CompanyName").sort();
    }

    // Function returns a unique list according to the condition. 
    // *Params
    // 1> arr = array 
    // 2> comparisonField = field name.
    // 3> value = field value to compare to.
    // 4> resultFieldValue = the new array returns values of this certain field 
    findListByCondition(arr, comparisonField, value, resultFieldValue) {
        var tempArr = [];

        for (var index = 0; index < arr.length; ++index) {

            if (arr[index][comparisonField] === value) {

                if (!this.isExist(tempArr, arr[index][resultFieldValue])) {
                    tempArr.push(arr[index][resultFieldValue]);
                }
            }
        }

        return tempArr;
    }

    // ---------------------------------------------------------  HTNL section 
    render() {

        const COUNTRIES = this.countries.map((country, index) => {
            return <button className={this.state.countryBtn === country ? 'active btn btn-light' : 'btn btn-light'}
                key={index} onClick={this.loadCities}>{country}</button>
        })

        const CITIES = this.state.citiesList.map((city, index) => {
            return <button className={this.state.cityBtn === city ? 'active btn btn-light' : 'btn btn-light'}
                key={index} onClick={this.loadCompanies}>{city}</button>
        })

        const COMPANIES = this.state.companiesList.map((company, index) => {
            return <button className={this.state.companyBtn === company ? 'active btn btn-light' : 'btn btn-light'}
                key={index} onClick={this.loadCompanyLocation}>{company}</button>
        })

        return (
            <div id='wrapper'>
                <div className="row">
                    <div className="col-2 title">Countries</div>
                    <div className="col-2 title">Cities</div>
                    <div className="col-3 title">Company</div>
                    <div className="col-5 title">Map</div>
                </div>

                <div className="row data-content-height">
                    <div className="col-2 scroll">
                        <div className="list-group">
                            {COUNTRIES}
                        </div>
                    </div>
                    <div className="col-2 scroll">
                        <div className="list-group">
                            {CITIES}
                        </div>
                    </div>
                    <div className="col-3 scroll">

                        <div className="list-group">
                            {COMPANIES}
                        </div>
                    </div>
                    <div className="col-5">
                        <Map companyLocation={this.state.companyLocation} mapApiKey={this.apiKey} />
                    </div>
                </div>
            </div>
        );
    }
}

export default CompaniesData;