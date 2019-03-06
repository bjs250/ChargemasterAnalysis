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
    dataFileNames = [f for f in listdir("data/") if isfile(join("data/", f))]
    
    rawDataFileName = dataFileNames[12].split(".")[0]
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
                        if " TAB" in description:
                            delivery = "TABLET"
                        elif "CAPSULE" in description or " CAP" in description:
                            delivery = "CAPSULE"
                            #print(description)
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
                                    dosage = word + words[index+1]
                                except:
                                    dosage = word

                        # "40MG" format
                        if dosage is None:
                            for index,word in enumerate(words):
                                search = re.search('^[0-9.-]+[A-Z]',word)
                                if search is not None:
                                    dosage = word

                        print(drugName,rawDataFileName,price,delivery,dosage)
                        
                        if delivery is None:
                            print("missing delivery", description)
                        if dosage is None:
                            print("missing dosage", description)

