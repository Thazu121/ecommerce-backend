const createProduct = async (req, res) => {
    try {
        const { name, price, category, description } = req.body
        if (!name || !price || !category || !description) {
            return res.status(400).json({ message: "All fields required" })
        }
        if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Invalid price" });
}
        const product = await productModel.create({
            name,
            price,
            category,
            description
        })
        return res.status(201).json({ message: "Product created ", product })


    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}



const getAllProduct = async (req, res) => {
    try {
        const product = await productModel.find()
        return res.status(200).json({ message: "Product find", product: product })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}
const getSingleProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.productId)
        if (!product) {
          return  res.status(404).json({ message: "Product Not Found" })
        }
         res.status(200).json({ message: "Product Found", product: product })

    } catch (error) {
        res.status(500).json({ message: "server error" })

    }

}

const updateProduct=async (req,res) => {
    try {
const product=await productModel.findByIdAndUpdate(req.params.productId
    ,{$set:req.body},
    {new:true}
)
    
if(!product){
    return res.status(404).json({message:"Product  not Found"})
}
res.status(200).json({message:"product updated",product})
    } catch (error) {
                res.status(500).json({ message: "server error" })

    }
    
}
const deleteProduct=async (req,res) => {
    try {
        const product=await productModel.findByIdAndDelete(req.params.productId)
        if (!product){
            return res.status(404).json({message:"Product not found"})
        }
        res.status(200).json({message:"Deleted sucessfully",product})
    } catch (error) {
                        res.status(500).json({ message: "server error" })

    }
    
}



const filterProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10,
        } = req.query

        let query = {}

        if (name) {
            query.name = { $regex: name, $options: "i" }
        }

        if (category) {
            query.category = category
        }

        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$lte = Number(maxPrice)
        }

        let productsQuery = productModel.find(query)

        if (sort === "price_asc") {
            productsQuery = productsQuery.sort({ price: 1 })
        } else if (sort === "price_desc") {
            productsQuery = productsQuery.sort({ price: -1 })
        }

        const pageNumber = Number(page)
        const limitNumber = Number(limit)

        const skip = (pageNumber - 1) * limitNumber

        productsQuery = productsQuery
            .skip(skip)
            .limit(limitNumber)

        const products = await productsQuery

        res.status(200).json({
            message: "Filtered products",
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

export {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,filterProduct
}