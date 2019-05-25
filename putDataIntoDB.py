"""
    This file will load post processed excel data, clear the current database table, and replace it with cleaned data
    Since the Dev and Prod databases are the same, connection string has been saved to a local env variable
"""

from pymongo import MongoClient
import pandas as pd

CONNECTION_STRING = str(os.environ["chargemaster_connection_string"])

client = MongoClient(
    CONNECTION_STRING)
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