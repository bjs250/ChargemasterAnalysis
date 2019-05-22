# ChargemasterAnalysis

## Purpose

This project is created as a preliminary data dashboard to allow end users to investigate recently publicized chargemaster data from US hospitals, particularly in the domain of consumer drug prices. 

Due to the Hospital Price Transparency and Disclosure Act of 2018, hospitals were required to publish public chargemaster data from Jan 1, 2019 onward. There is not a lot of regulation in regards to formatting for the chargemasters, so many of the released chargemasters are cryptic, to say the least. In order to glean some kind of apples-to-apples comparison in the data, only drug prices were investigated in this study. Even so, there is quite a bit of variation, so two major controls were introduced: sort the drug prices by method of delivery (i.e. is the medicine taken in the form of an injection, tablet, etc) as well as dosage (e.g. 10mg, 20mg, etc).

Further still, most of the hospitals have disclaimers listed alongside their chargemasters, stating that the list price does not reflect the actual price. The list price provided in the chargemaster is not necessarily the price that an insurance company will pay for a drug -- oftentimes it is at a lower, negotiated price. It should, however, be close to the price that an uninsured person would be asked to pay for treatment. One problem is that while the list prices are now transparent, the dealings between hospitals and insurers are not.

At the very least, this data is presented with the goal of prompting further conversation about the costs of our American healthcare system.

## Methodology

### Raw Data
* [Baylor Scott & White Medical Center -- Sunnyvale](https://www.bswhealth.com/locations/sunnyvale/patient-tools/Pages/hospital-pricing-information.aspx)

## Design & Implementation

## Built With

* [Express]() - Backend framework
* [React]() - Frontend framework
* [React-Dropdown]() - Dropdown component
* [Recharts]() - Self-contained React D3 Components (BarChart)
* [MongoDB]() - Backend database

## Acknowledgments