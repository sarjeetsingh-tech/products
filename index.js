const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');

 const methodOverride = require('method-override');//form dont support put and patch request

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })) //for parsing form content
app.use(methodOverride('_method'));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/farmStand').then(() => { console.log("Mongo Connection Open!!!") }).catch(error => {
    console.log("Mongo Connection Error !!!");
    console.log(error)
});
const categories=['fruit','vegetable','dairy'];

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    // res.send("All products will be here! ");
    res.render('products/index.ejs', { products });
    console.log(products);
})

app.get('/products/new', (req, res) => {
    res.render('products/new.ejs',{categories});
    // res.send("working")
})

app.post('/products',async(req,res)=>{
    const newproduct=   new Product(req.body);
    await newproduct.save();
//    console.log(req.body);
//    console.log(newproduct);
   res.redirect(`/products/${newproduct._id}`)
   
   })

app.delete('/products/:id', async (req, res)=>{
    const { id } = req.params;
    const deletedP=await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    // res.send('details page !')
    res.render('products/show.ejs', { product })
})
app.get('/products/:id/edit',async(req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    res.render('products/edit',{product,categories})
})

app.put('/products/:id',async(req,res)=>{
    const {id}=req.params;
    const product=await Product.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});

    // console.log(req.body);
    //  res.send("PUT");
    res.redirect(`/products/${product._id}`)
})

app.listen(3000, () => {
    console.log("listening at port 3000");
})
