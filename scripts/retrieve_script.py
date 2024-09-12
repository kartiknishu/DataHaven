import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json 


# Load environment variables from .env file
load_dotenv()

# Fetch MongoDB URI from environment variables
mongo_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)

collection = client['Resource-Portal']['courses']

cursor = collection.find({})

# Convert cursor to list of dictionaries
documents = list(cursor)

# Convert list of dictionaries to JSON format
json_data = json.dumps(documents, default=str)
print(json_data)