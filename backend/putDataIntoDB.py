from pymongo import MongoClient
client = MongoClient(
    "mongodb+srv://bjs250:DeltaV123@cluster0-rhktc.mongodb.net/DrugInfoDB")
database = client["DrugInfoDB"]
collection = database["DrugInfoStore"]

record = {
    "name": "test",
    "price": "test",
    "hospital": "test",
    "delivery": "test",
    "dosage": "test",
    "description": "test"
}

rec = database["DrugInfoStore"].insert_one(record)
