const pool = require('../../config');

const multer = require('multer');

const cloudinary = require('cloudinary').v2;

const addProducts = async (req, res) => {
    try {

        const cloudinaryUser = cloudinary.config({cloud_name: "dr6vjb3gm", 
            api_key: "633755855494375", 
            api_secret: "lkiISogOEPgjY0eUqRiw4vpdV98"                      
        });

        
        const storage = multer.diskStorage({
            destination: (request, file, cb) => {
              cb(null, 'uploads/')
            },
            filename(request, file, cb) {
              if(file.mimetype !== `image/jpeg` && file.mimetype !== 'image/png') {
                  return res.status(409).json({
                      msg: `Only jpg and png images supported`
                  });
              }
              cb(null, file.originalname)
            }
        });

        const upload = multer({storage: storage}).single('productImage');

        upload(req, res, async (error) => {
            
            if (error) {
                console.log(error);
                 return res.send(error)
            }

            if(!req.file) return res.status(409).json({
                error: `Product image is required`
            });
                
            if(!req.body.productName) return res.status(409).json({
                error: `Product name is required`
            });

            if(!req.body.productCost) return res.status(409).json({
                error: `Product cost is required`
            });

            if(!req.body.productQuantity) return res.status(409).json({
                error: `Product quantity is required`
            });

            if(!req.body.productDescription) req.body.productDescription = `Chet store music instrument`;

            cloudinary.uploader.upload(`uploads/${req.file.originalname}`, {
                use_filename: true, 
                unique_filename: true,
                folder: 'uploads'
              })
              .then( async (file) => {
                console.log('Image', file, 'uploaded');
                const addProduct = pool.query(`INSERT INTO products (productname, productcost, productdescription, productimage, productquantity) VALUES ($1, $2, $3, $4, $5)`, [
                    req.body.productName,
                    req.body.productCost,
                    req.body. productDescription,
                    `${file.public_id}${file.format}`,
                    req.body.productQuantity
                ]);
    
                const isProductAdded = await addProduct;
              }).catch((e) => {
                  console.log('error here...', e);
              })
            res.redirect(302, 'https://chet-store-8b54b.web.app/addProducts.html');
    });


    } catch(e) {
        console.log(e)
        res.status(400).json({
            message: `An error occured`,
            e
        });
    }
}

module.exports = addProducts;
