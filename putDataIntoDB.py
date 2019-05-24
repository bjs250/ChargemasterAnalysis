"""
    This file will load cleaned excel data, clear the current database table, and replace it with cleaned data
"""

from pymongo import MongoClient
import pandas as pd
import pprint 

client = MongoClient(
    "mongodb+srv://bjs250:DeltaV123@cluster0-rhktc.mongodb.net/DrugInfoDB")
database = client["DrugInfoDB"]
collection = database["DrugInfoStore"]

result = database["DrugInfoStore"].delete_many({})

df = pd.read_excel("postprocessed_data.xlsx", dtype=str)
for index, row in df.iterrows():
    record = {
        "name": row["Drug"],
        "price": float(row["Price"]),
        "hospital": row["Hospital"],
        "delivery": row["Delivery"],
        "dosage": row["Dosage"],
        "description": row["Raw Description"]
    }
    rec = database["DrugInfoStore"].insert_one(record)

print("Done")



