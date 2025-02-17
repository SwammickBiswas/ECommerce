const express = require("express")
const authRouter = require("../server/routes/auth/auth.route") 
const adminProductsRoute = require("../server/routes/admin/products.routes")
const cors = require("cors")
const mongoose = require("mongoose")
const shopProductsRouter= require("./routes/shop-view/products-routes")
const shopRouter = require("./routes/shop-view/cart-route")
const cookieParser = require("cookie-parser")
const shopAddressRouter = require("./routes/shop-view/address.routes")
const shopOrderRouter = require("./routes/shop-view/order.routes") 
const adminOrderRouter = require("./routes/admin/order.routes")
const shopSearchRouter = require("./routes/shop-view/search-routes")
const shopReviewRouter = require("./routes/shop-view/review-routes")
const commonFeatureRouter = require("./routes/common/feature.route")
const path = require("path")

mongoose.connect("mongodb+srv://22052944:Swammick@cluster0.mbtag.mongodb.net/noob" ).then(()=>console.log("MongoDB connected")
).catch((error)=>console.log(error)
)
const app = express()
const PORT = process.env.PORT || 5000



app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["PUT","DELETE","POST","GET"],
    allowedHeaders:[
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ]
}))

app.use(cookieParser())
app.use(express.json()) 
const _dirname = path.resolve()
app.use("/api/auth",authRouter)
app.use("/api/admin/products",adminProductsRoute)
app.use("/api/admin/orders",adminOrderRouter)
app.use("/api/shop/products",shopProductsRouter)
app.use("/api/shop/cart",shopRouter)
app.use("/api/shop/address",shopAddressRouter)
app.use("/api/shop/order",shopOrderRouter)
app.use("/api/shop/search",shopSearchRouter)
app.use("/api/shop/review",shopReviewRouter)
app.use("/api/common/feature",commonFeatureRouter)

app.use(express.static(path.join(_dirname,"/client/dist")))
app.get("*",(_,res)=>{
    res.sendFile(path.resolve(_dirname,"client","dist","index.html"))
})

app.listen(PORT,()=>console.log( `Server is running on port ${PORT}`))

