## Purpose

This project was created as a naive data dashboard to allow end users to investigate recently publicized chargemaster data from US hospitals, particularly in the domain of consumer drug prices. 

Due to the Hospital Price Transparency and Disclosure Act of 2018, hospitals were required to publish public chargemaster data from Jan 1, 2019 onward. There is not a lot of regulation in regards to formatting for the chargemasters, so many of the released chargemasters are cryptic, highly technical, or otherwise difficult to data wrangle in some kind of way. In order to glean some kind of apples-to-apples comparison in the data, drug prices were investigated in this study, as opposed to medical procedures. Even so, there is quite a bit of variation in regards to categorizing the data, so two major controls were introduced: classifying the drug prices by method of delivery (i.e. is the medicine taken in the form of an injection, tablet, etc) as well as dosage (e.g. 10mg, 20mg, etc).

Further still, most of the hospitals have disclaimers listed alongside their chargemasters, stating that the list price does not reflect the actual price. 

>These documents should not be used to accurately estimate or determine the final costs of a given service or hospital stay for a patient. It is provided for information only. Charges referenced in this list of standard charges were valid as of January 1, 2019. Charges may change from this date due to new technology, added or eliminated services, changes made by manufacturers or vendors, etc. -- Queens Medical Center Hawaii

The list price provided in the chargemaster is not necessarily the price that an insurance company will pay for a drug -- oftentimes it is at a lower, negotiated price. It should, however, be close to the price that an uninsured person would be asked to pay for treatment. One problem is that while the list prices are now transparent, the dealings between hospitals and insurers are not.

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
* [JFK Medical Center](https://jfkmc.com/about/legal/detail-price-list.dot)
* [Johns Hopkins](https://www.hopkinsmedicine.org/patient_care/billing-insurance/billing/charges-fees.html)
* [Loyola University](https://www.loyolamedicine.org/patient-info/understanding-hospital-charges)
* [Massachusetts General Hospital](https://www.massgeneral.org/notices/billing/)
* [Mayo Clinic Arizona](https://www.mayoclinic.org/patient-visitor-guide/billing-insurance/price-estimates/chargemaster)
* [Memorial Hermann-Texas Medical Center](https://www.memorialhermann.org/patients-caregivers/memorial-hermann-charge-master/)
* [Memorial Sloan Kettering](https://www.mskcc.org/insurance-assistance/standard-price-list)
* [Mid-Columbia Medical Center Oregon](https://www.mcmc.net/latest-news/2019/january/hospital-pricing-frequently-asked-questions-/)
* [Mississippi Baptist Medical Center Booneville](https://www.baptistonline.org/estimate-my-costs)
* [Morristown Medical](https://www.atlantichealth.org/patients-visitors/insurance/out-network-insurance.html)
* [Mount Sinai](https://www.mountsinai.org/about/insurance/cm-faq-msh)
* [New York Presbyterian](https://www.nyp.org/patients-and-visitors/paying-for-care)
* [New York University Winthrop](https://www.nyuwinthrop.org/standard-charges)
* [Northern Light Eastern Maine Medical Center](https://northernlighthealth.org/Locations/Eastern-Maine-Medical-Center/Patients-Visitors/Billing/Price-Transparency)
* [Orlando Health](https://www.orlandohealth.com/patients-and-visitors/patient-financial-resources/pricing-transparency-guide)
* [Providence Portland Medical Center](https://oregon.providence.org/location-directory/p/providence-portland-medical-center/guest-information/pricing-transparency/)
* [Queens Medical Center Hawaii](https://www.queens.org/the-queens-medical-center/patients-and-visitors/pay-your-bill/transparency-pricing-qmc)
* [Robert Wood Johnson New Brunswick](https://www.rwjbh.org/rwj-university-hospital-new-brunswick/billing/charges/)
* [Rush University Chicago](https://www.rush.edu/patients-visitors/patients/pay-your-bill/cost-care)
* [St Cloud Minnesota](https://www.centracare.com/pricing-financial-assistance/)
* [Stormont Vail](https://www.stormontvail.org/patient-services/understanding-hospital-pricing-and-charges/)
* [Temple University](https://www.templehealth.org/locations/temple-university-hospital/patients-visitors/billing-insurance/pricing-info)
* [Thomas Jefferson University](https://hospitals.jefferson.edu/patients-and-visitors/charge-description-master.html)
* [Trinity Health Hartford](https://www.stfranciscare.org/cms-price-transparency-hartford)
* [University North Carolina Caldwell](https://www.unchealthcare.org/about-us/billing-and-financial-assistance/chargemaster/)
* [University of Arkansas](https://uamshealth.com/patientsandguests/billing/uams-price-transparency-2019/)
* [University of California San Diego Medical Center](https://health.ucsd.edu/patients/billing/Pages/default.aspx)
* [University of California San Francisco Medical Center](https://www.ucsfhealth.org/about/pricing-transparency/)
* [University of Colorado](https://www.uchealth.org/billing-and-pricing-information/)
* [University of Iowa](https://uihc.org/hospital-services-and-charges)
* [University of Kansas](https://www.kansashealthsystem.com/patient-visitor/financial/insurance/are-you-covered)
* [University of Massachusetts Clinton](https://www.umassmemorialhealthcare.org/healthalliance-clinton-hospital/patients-visitors/patient-resources/healthalliance-clinton-pricing-list)
* [University of Oklahoma](https://www.oumedicine.com/oumedicine/primary-care/patients-visitors/hospital-financial-assistance/hospital-charges)
* [University of Pittsburgh Presbyterian Shadyside](https://www.upmc.com/locations/hospitals/presbyterian/patients-visitors/patient-information/cdm)
* [University of Texas MD Anderson](https://www.mdanderson.org/patients-family/becoming-our-patient/planning-for-care/insurance-billing-financial-support/health-care-disclosures.html)
* [University of Utah](https://healthcare.utah.edu/bill/charges.php)
* [University of Washington Medical Center](https://www.uwmedicine.org/patient-resources/billing-and-insurance)
* [University of Wisconsin Hospitals](https://www.uwhealth.org/billing-and-insurance/priceline-pricing-costs/30091)
* [Virginia Commonwealth University Health System](https://www.vcuhealth.org/locations/vcu-medical-center/billing-and-insurance/price-transparency)
* [Virtua West Jersey Health System](https://www.virtua.org/patient-tools/hospital-charges-information)
* [Yale New Haven Health](https://www.ynhh.org/patients-visitors/billing-insurance/pricing.aspx)

## Design & Implementation

This data dashboard is a web application using Node/Express as the backend and React as the front-end. It utilizes some pre-built React component libraries for the dropdown lists and barchart. All the cleaned data is loaded into a MongoDB database by a Python script that utilizes Mongoose to insert the data. As one may expect, selecting parts of the dropdown will alter state in React and execute a few simple queries to the backend API, which will filter and serve the relevant data.

## Built With

* [Express](https://expressjs.com/) - Backend framework
* [React](https://reactjs.org/) - Frontend framework
* [React-Dropdown](https://www.npmjs.com/package/react-dropdown) - Dropdown component
* [Recharts](http://recharts.org/en-US/) - Self-contained React D3 Components (BarChart)
* [MongoDB](https://www.mongodb.com/) - Backend database
* [Axios](https://www.axios.com/) - API fetchings

## Acknowledgements

* [Helpful article listing chargemasters](https://qz.com/1518545/price-lists-for-the-115-biggest-us-hospitals-new-transparency-law/)

