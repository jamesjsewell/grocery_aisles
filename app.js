const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
var bodyParser = require('body-parser')
const db = require('./models')

const { user, list, store, aisle, product } = db

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.post('/user', function(req, res){

  const fname = req.body.fname
  const lname = req.body.lname

  user.create({
    fname: fname,
    lname: lname
  }).then((result)=>{
    res.json({created: result})
  })

})

app.post('/list', function(req, res){

  const { storeId, aisleId, productId, userId } = req.body
  
  if(storeId && aisleId && productId && userId){
    store.create({
      store_id: parseInt(storeId),
      aisle_id: parseInt(aisleId),
      product_id: parseInt(productId),
      user_id: parseInt(userId)
    }).then((result)=>{
      res.json({created: result})
    })
  }
  
})

// stores
app.get('/store/:id', function(req, res){
 
  store.findOne({
    where: { id: parseInt(req.params.id) }, include: [{ model: aisle, include: [ {model: product} ] }]
  }).then((result)=>{
    if(result){
        var store = result.get({ plain: true })    
        return res.render('store', { store: store })
    }
    else{
      return res.render('store', { message: "store not found" })
    }

    
  }).catch(function(err){
      console.log(err)
      return res.render('error_message', { message: "something went wrong", route: "/store/" + req.params.id })
  })

})

app.post('/aisle', function(req, res){
  const { name, storeId } = req.body
  aisle.create({
    name: name,
    store_id: parseInt(storeId)
  }).then((result)=>{
    res.redirect('/store/' + storeId)
  })
})

app.post('/product', function(req, res){
  const { name, quantity, price, aisle, storeId } = req.body
  
  product.create({
    name: name,
    quantity: parseInt(quantity),
    price: parseFloat(price),
    aisle: parseInt(aisle)
  }).then((result)=>{
    res.redirect('/store/' + storeId )
  })
})

app.post('/store', function(req, res){
  const { name } = req.body
  store.create({
    name: name
  }).then((result)=>{
    res.json({created: result})
  })
})






app.listen(3000, () => console.log('Example app listening on port 3000!'))
