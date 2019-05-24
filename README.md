# ChargemasterAnalysis

## Purpose

This project is created as a preliminary data dashboard to allow end users to investigate recently publicized chargemaster data from US hospitals, particularly in the domain of consumer drug prices. 

Due to the Hospital Price Transparency and Disclosure Act of 2018, hospitals were required to publish public chargemaster data from Jan 1, 2019 onward. There is not a lot of regulation in regards to formatting for the chargemasters, so many of the released chargemasters are cryptic, to say the least. In order to glean some kind of apples-to-apples comparison in the data, only drug prices were investigated in this study. Even so, there is quite a bit of variation, so two major controls were introduced: sort the drug prices by method of delivery (i.e. is the medicine taken in the form of an injection, tablet, etc) as well as dosage (e.g. 10mg, 20mg, etc).

Further still, most of the hospitals have disclaimers listed alongside their chargemasters, stating that the list price does not reflect the actual price. The list price provided in the chargemaster is not necessarily the price that an insurance company will pay for a drug -- oftentimes it is at a lower, negotiated price. It should, however, be close to the price that an uninsured person would be asked to pay for treatment. One problem is that while the list prices are now transparent, the dealings between hospitals and insurers are not.

At the very least, this data is presented with the goal of prompting further conversation about the costs of our American healthcare system.

## Methodology

A list of major hospitals in the US was gathered from various sources. I then manually searched for the public chargemaster on the websites of those hospitals. Webscraping techniques were considered, but the variation in websites was too great for this to be workable, and I also wanted to be careful not to curate bad data.

Which hospitals were selected? I wanted to get a sample size of around 50 hospitals across the nation. This seemed simple enough at the offset, but there were quickly a few factors that narrowed down the search considerably. Most notably, a hospital was excluded from the list if:

* There was no easily findable public chargemaster
* The chargemaster was not in a .csv or .xlsx file format (e.g. xml, or even worse, a web table)
* The chargemaster contained a lot of "variable" pricing (e.g. "Call for more information")
* The chargemaster was considerably difficult to parse
* The chargemaster pricing was broken down in an unusual way

The downloaded data was then minimally processed so that a Python script could easily work with it; this minimally processed data (different from the raw data below) can be examined in the utilities/raw_data directory.

The actual data was in most cases read into a Pandas dataframe, cleaned, and standardized. Important information for categorizing was extracted via naive text search, or in more difficult cases, through regular expressions.

### Raw Data Sources
* [Baylor Scott & White Medical Center -- Sunnyvale](https://www.bswhealth.com/locations/sunnyvale/patient-tools/Pages/hospital-pricing-information.aspx)
* [Brigham and Women's Hospital](https://www.partners.org/for-patients/Patient-Billing-Financial-Assistance/Hospital-Charge-Listing.aspx)
* [Campbell County Health Wyoming](https://www.cchwyo.org/As_Our_Patient/Paying_For_Care.aspx)
* [Catholic Medical Center NH](https://www.catholicmedicalcenter.org/patients-visitors/insurance-and-billing/chargemaster)
* [Children's Hospital of Philadelphia](https://www.chop.edu/centers-programs/billing-and-insurance/understanding-hospital-charges)
* [Dartmouth-Hitchcock Medical Center Lebanon](https://www.dartmouth-hitchcock.org/billing-charges/charges_dhmc.html)
* [Huntsville Hospital Alabama](https://www.huntsvillehospital.org/price-transparency)
* []()
* []()
* []()
* []()
* []()
* []()
* []()
* []()
* []()
* []()
* []()
* []()

## Design & Implementation

The data dashboard is a web application using Node/Express as the backend and React as the front-end. It utilizes so pre-built React component libraries for the dropdown lists and barchart. All the cleaned data is loaded into a MongoDB database by a Python script that utilizes Mongoose to insert the data. As one may expect, selecting parts of the dropdown will alter state in React and execute a few simple queries to the backend API, which will filter and serve the relevant data.

## Built With

* [Express]() - Backend framework
* [React]() - Frontend framework
* [React-Dropdown]() - Dropdown component
* [Recharts]() - Self-contained React D3 Components (BarChart)
* [MongoDB]() - Backend database

## Acknowledgments