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

  const { storeId, aisleId, productId } = req.body

  if(storeId && aisleId && productId){
    list.create({
      store_id: parseInt(storeId),
      aisle_id: parseInt(aisleId),
      product_id: parseInt(productId),
      user_id: 1
    }).then((result)=>{
      res.json({created: result})
    })
  }
  
})

function getStoreInventory(storeId, onStoreFound){

  store.findOne({
    where: { id: parseInt(storeId) }, include: [{ model: aisle, include: [ {model: product} ] }]
  }).then((result)=>{

    if(result){
      var store = result.get({ plain: true })    
      onStoreFound(store)
    }
    else{
      return { message: "store not found" }
    }
    
  })

}

app.get('/shop/store/:storeId', function(req, res){

  var storeId = req.params.storeId
  var userId = 1

  list.findAll({
    where: { store_id: parseInt(storeId), user_id: 1 }, 
    include: 
      { 
        model: aisle,
     
      }
  }).then((results)=>{ 

    //var listEntries = results.get({plain: true})
    console.log(results[0].get({plain: true}))
    function onStoreFound(store) {

      res.render( 'shop', { storeId: storeId, userId: userId, store: store, list: null } )


    }

    getStoreInventory(storeId, onStoreFound)
    
    //return res.render( 'shop', { storeId: storeId, userId: userId } )
    
  }).catch(function(err){
      console.log(err)
      return res.render('error_message', { message: "something went wrong", route: "/store/" + req.params.id })
  })

})

// stores
app.get('/store/:id', function(req, res){

  function onStoreFound(store){
    
    res.render('store', { store: store })

  }

  getStoreInventory(req.params.id, onStoreFound)

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
