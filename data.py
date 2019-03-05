import pandas as pd
from os import listdir
from os.path import isfile, join

if __name__ == "__main__":
    drugNames = pd.read_excel("Drugs.xlsx",dtype=str)['Drug Name'].tolist()
    dataFileNames = [f for f in listdir("data/") if isfile(join("data/", f))]
    
    dataFileName = "data/" + dataFileNames[2]
    df = pd.read_excel(dataFileName,dtype=str)
    df = df.fillna('')

    # Iterate through the list of drugs
    for drugName in drugNames[0:10]:
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
                    print(searchResults)
    