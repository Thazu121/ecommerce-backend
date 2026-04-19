const createProduct=async (req,res) => {
    try {
        const {name,price,category,description}=req.body
    if(!name|| !price|| !category||!description){
return res.status(400).json({meassage:"All fields required"})
    }
    const product=await productModel.create({
        name,
        price,
        category,
        description
    })
    res.status(201).json({message:"Product created ",product})

        
    } catch (error) {
        res.status(500).json({meassage:"server error"})
    }
}
export{
    createProduct
}