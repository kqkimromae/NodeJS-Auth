import express from"express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res) =>{
    res.send("API is running....")
});

// app.use('/api/books', productRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);




const port = process.env.PORT || 3000
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
}); 

