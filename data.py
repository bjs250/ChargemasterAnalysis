import pandas as pd
from os import listdir
from os.path import isfile, join

if __name__ == "__main__":
    drugNames = pd.read_excel("Drugs.xlsx",dtype=str)['Drug Name'].tolist()
    dataFileNames = [f for f in listdir("data/") if isfile(join("data/", f))]
    
    rawDataFileName = dataFileNames[0].split(".")[0]
    dataFileName = "data/" + rawDataFileName + ".xlsx"
    df = pd.read_excel(dataFileName,dtype=str)
    df = df.fillna('')

    # Iterate through the list of drugs
    print(dataFileName)
    for drugName in drugNames[0:8]:
        drugName = drugName.lstrip().rstrip().upper()
        drugNameSet = list()
        
        # Handle alternate names
        if "/" in drugName:
            for alternateName in drugName.split("/"):
                drugNameSet.append(alternateName)        
        else:
            drugNameSet.append(drugName)

        # Search the entire chargemaster file for rows that contain the drug name
        print("=====", drugNameSet, "=====")
        for columnName in df.columns:
            for drugName in drugNameSet:
                df[columnName] = df[columnName].apply(lambda x: x.upper())
                searchResults = df[df[columnName].str.match(drugName)]
                if searchResults.empty == False:
                    for index,result in searchResults.iterrows():
                        hospitalName = dataFileName.split("/")[1]
                        price = result["Price"]
                        
                        # Parse out delivery
                        description = result["Description"]
                        if "TAB" in description:
                            delivery = "TABLET"
                        elif "CAPSULE" or " CAP " in description:
                            delivery = "CAPSULE"
                        elif "ELIXIR" in description:
                            delivery = "ELIXIR"
                        elif "SUPPOSITORY" in description:
                            delivery = "SUPPOSITORY"
                        elif "INTRAVENOUS" in description:
                            delivery = "INTRAVENOUS"
                        elif "SUSPENSION" in description:
                            delivery = "SUSPENSION"
                        elif "SOLUTION" in description:
                            delivery = "SOLUTION"
                        else: 
                            delivery = None
                            print(description)

                        # Parse out Dosage
                        #print(description)
                        print(drugName,rawDataFileName,price,delivery)
                        
