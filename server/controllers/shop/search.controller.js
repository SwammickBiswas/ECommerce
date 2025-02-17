

const Product = require("../../models/Products")



const searchProducts= async (req,res) => {
    try {
        const {keyword} = req.params
        if(!keyword || typeof keyword !== 'string') {
            return res.status(400).json({message: 'Invalid keyword'})
            }
            const regEx= new RegExp(keyword,"i")
            const createSearchQuery= {
                $or: [
                    {
                        title:regEx
                    },
                    {
                        description:regEx
                    },
                    {
                        category:regEx
                    },
                    {
                        brand:regEx
                    }
                ]
            }
            const SearchResults = await Product.find(createSearchQuery)
            res.status(200).json({data:SearchResults,success:true})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error searching products",
            success:false
        })
    }
}


module.exports = {searchProducts}