import express from'express';
//const { Client } = require('pg');
import cors from 'cors';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());
let uploadedData = [];



const ai = new GoogleGenAI({ apiKey: " AIzaSyDwpwCP_3rqNbRfa39hW-zV5vce_XFmiE8" });
async function generate_response(input) {
  const prompt = `
You are an AI assistant designed to interpret user input and generate JavaScript functions that operate on a dataset.
The dataset is an array of objects, and the JavaScript functions should perform the requested operations on this dataset.

Always return the JavaScript function as a string that can be directly copied and executed. Do not include any explanations or additional text.

### Example Dataset:
[
    { "name": "Item 1", "price": 10, "quantity": 2, "product": "Product A", "sales_amount": 20 },
    { "name": "Item 2", "price": 20, "quantity": 1, "product": "Product B", "sales_amount": 20 },
    { "name": "Item 3", "price": 15, "quantity": 3, "product": "Product A", "sales_amount": 45 }
]

### Example Input:
"Calculate the total price of all items."

### Example Output:
"return dataset.reduce((total, item) => total + item.price, 0);"

### Example Input:
"Find the item with the highest price."

### Example Output:
"return dataset.reduce((max, item) => item.price > max.price ? item : max, dataset[0]);"

### Example Input:
"List all items with a quantity greater than 2."

### Example Output:
"return dataset.filter(item => item.quantity > 2);"

### Example Input:
"Calculate the average quantity per sale."

### Example Output:
"function getAverageQuantityPerSale(dataset) {
  const totalQuantity = dataset.reduce((sum, record) => sum + record.quantity, 0);
  const average = totalQuantity / dataset.length;
  return average;
}
return getAverageQuantityPerSale(dataset);"

### Example Input:
"Find the top-selling product."

### Example Output:
"function getTopSellingProduct(dataset) {
  const productSales = {};

  for (const record of dataset) {
    const product = record.product;
    const amount = record.sales_amount;

    if (!productSales[product]) {
      productSales[product] = 0;
    }

    productSales[product] += amount;
  }

  let topProduct = null;
  let maxSales = 0;

  for (const [product, total] of Object.entries(productSales)) {
    if (total > maxSales) {
      maxSales = total;
      topProduct = product;
    }
  }

  return { product: topProduct, total_sales: maxSales };
}
return getTopSellingProduct(dataset);"

User Query: ${input}
`;

  try {
   
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    return response.text; // Parse the LLM's response
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }


}

app.post('/upload-data', (req, res) => {
    const {data} = req.body;
    if (!data || data.length ===0) {
        return res.status(400).json({ error: 'No data provided' });
    }
    uploadedData = data;
    console.log('Data uploaded:', uploadedData);
    res.json({ message: 'Data recieved successfully' });
});

app.post('/process-input', async (req, res) => {
    console.log("Uploaded Data:", uploadedData); // Debugging

    const { input } = req.body;
    try {
        const response = await generate_response(input);
        res.json({ response });
    } catch (error) {
        console.error("Error in /generate-response:", error);
        res.status(500).json({ error: 'Error generating response' });
    }
});
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
