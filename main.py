from fastapi import FastAPI,Form
from pydantic import BaseModel
import psycopg2
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware

# Create FastAPI app
app = FastAPI()

# Enable CORS for all origins (you can specify domains if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development purposes)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model for incoming formula
class Formula(BaseModel):
    expression: str

# Connect to PostgreSQL database (Replace with your database credentials)
conn = psycopg2.connect(
    dbname="postgres", 
    user="postgres", 
    password="postgres", 
    host="localhost",
    port="5434"
)

# POST route to evaluate the formula
@app.post("/evaluate")
def evaluate_formula(formula: Formula):
    cur = conn.cursor()

    # Use the plv8_exec function to evaluate the formula
    js_code = f'return {formula.expression};'
    #cur.execute("SELECT plv8_exec(%s);", (js_code,))
    cur.execute("SELECT plv8_exec(%s);", ('return 3 + 5;',))



    # Get the result of the evaluation
    result = cur.fetchone()[0]
    cur.close()

    return {"result": result}
