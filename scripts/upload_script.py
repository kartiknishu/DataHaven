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

# Upload Courses

collection = client['Resource-Portal']['courses']

# Read CSV file
csv_file_path = 'courses.csv'  # Provide the path to your CSV file
data = pd.read_csv(csv_file_path)

# Insert data into MongoDB collection
for index, row in data.iterrows():
    document = {
        "code": row['code'],
        "title": row['title']
    }

    collection.update_one(
        {"code": document["code"]},
        {"$set": document},
        upsert=True
    )


print("Courses data inserted successfully into MongoDB collection.")

# Upload Instructors

collection = client['Resource-Portal']['instructors']

# Read CSV file
csv_file_path = 'instructors.csv'  # Provide the path to your CSV file
data = pd.read_csv(csv_file_path)

# Insert data into MongoDB collection
for index, row in data.iterrows():
    document = {
        "instructor": row['instructors'],
    }

    collection.update_one(
        {"instructor": document["instructor"]},
        {"$set": document},
        upsert=True
    )


print("Instructors data inserted successfully into MongoDB collection.")
