import pandas as pd

drugs = ["Atorvastatin Calcium",
"Levothyroxine",
"Lisinopril",
"Omeprazole",
"Metformin HCL",
"Amlodipine/Benazepril",
"Simvastatin",
"Hydrocodone/Acetaminophen",
"Metoprolol Succinate",
"Losartan Potassiu"]

if __name__ == "__main__":
    #drugName = "ACETAMINOPHEN"
    drugName = "Lisinopril".upper()
    dataFileName = "data/" + "California Pacific.xlsx"

    df = pd.read_excel(dataFileName,dtype=str)
    df = df.fillna('')

    # Search the entire file for rows that contain the drugname
    for columnName in df.columns:
        df[columnName] = df[columnName].apply(lambda x: x.upper())
        searchResults = df[df[columnName].str.match(drugName)]
        if searchResults.empty == False:
            print(searchResults)
    