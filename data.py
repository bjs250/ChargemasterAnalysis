import pandas as pd
import re
from os import listdir
from os.path import isfile, join

def isFloat(string):
    try:
        float(string)
        return True
    except ValueError:
        return False

if __name__ == "__main__":
    drugNames = pd.read_excel("Drugs.xlsx",dtype=str)['Drug Name'].tolist()
    dataFileNames = ["data/"+f for f in listdir("data/") if isfile(join("data/", f))]

    d = {}
    d["Drug"] = list()
    d["Price"] = list()
    d["Hospital"] = list()
    d["Delivery"] = list()
    d["Dosage"] = list()
    d["Raw Description"] = list()

    # Iterate through the list of hospitals
    for dataFileName in dataFileNames:
        hospitalName = dataFileName.split(".xlsx")[0].split("/")[1]
        df = pd.read_excel(dataFileName,dtype=str)
        df = df.fillna('')

        # Iterate through the list of drugs
        for drugName in drugNames:
            drugName = drugName.lstrip().rstrip().upper()
            drugNameSet = list()
            
            # Handle alternate names
            if "/" in drugName:
                for alternateName in drugName.split("/"):
                    drugNameSet.append(alternateName)        
            else:
                drugNameSet.append(drugName)

            # Search the entire chargemaster file for rows that contain the drug name
            print("=====", hospitalName, drugNameSet, "=====")
            for columnName in df.columns:
                for drugName in drugNameSet:
                    df[columnName] = df[columnName].apply(lambda x: x.upper())
                    searchResults = df[df[columnName].str.match(drugName)]
                    if searchResults.empty == False:
                        for index,result in searchResults.iterrows():
                            price = result["Price"]
                            
                            # Parse out delivery
                            description = result["Description"]
                            if " TAB" in description:
                                delivery = "TABLET"
                            elif "CAPSULE" in description or " CAP" in description:
                                delivery = "CAPSULE"
                            elif "ELIXIR" in description or " ELIX" in description:
                                delivery = "ELIXIR"
                            elif "SUPPOSITORY" in description or " SUP" in description:
                                delivery = "SUPPOSITORY" 
                            elif "INTRAVENOUS" in description or " INJ" in description:
                                delivery = "INJECTION"
                            elif "SUSPENSION" in description or " SUSP" in description:
                                delivery = "SUSPENSION" 
                            elif "SOLUTION" in description or " SOLN" in description or " SOL" in description or " LIQ" in description:
                                delivery = "SOLUTION"
                                if " IV " in description:
                                    delivery = "INJECTION"
                            elif "SYRUP" in description:
                                delivery = "SYRUP"
                            else: 
                                delivery = None
                                
                            # Parse out Dosage
                            dosage = None
                            
                            words = description.split(" ")
                            
                            # "40 MG" format
                            for index,word in enumerate(words):
                                if word.isnumeric() or isFloat(word) or re.search('^[0-9.-]',word) is not None:
                                    try:
                                        dosage = word + " " + words[index+1]
                                        # if "/" in words[index+1] and words[index+1][-1].isnumeric():
                                        #     try:
                                        #         dosage += words[index+2]
                                        #     except:
                                        #         pass
                                    except:
                                        dosage = word

                            # "40MG" format
                            if dosage is None:
                                for index,word in enumerate(words):
                                    search = re.search('^[0-9.-]+[A-Z]',word)
                                    if search is not None:
                                        dosage = word

                            #print(drugName,hospitalName,price,delivery,dosage)
                            d["Drug"].append(drugName)
                            d["Hospital"].append(hospitalName)
                            d["Delivery"].append(delivery)
                            d["Dosage"].append(dosage)
                            d["Price"].append(price)
                            d["Raw Description"].append(description)

                            # if delivery is None:
                            #     print("missing delivery", description)
                            # if dosage is None:
                            #     print("missing dosage", description)

    df = pd.DataFrame.from_dict(d)
    df.to_excel("output.xlsx")
    print(df)    
