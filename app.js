import exprees from"express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = exprees()

app.use(cors())
app.use(exprees.json())

app.use('/api/books', bookRoutes);

const port = process.env.PORT || 3000
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
}); 
 