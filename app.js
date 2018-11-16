const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
var bodyParser = require('body-parser')
const db = require('./models')
const path = require('path')
const { user, list, store, aisle, product } = db

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

const manageStoreBaseUrl = '/manage/store/'
const inventoryBaseUrl = '/inventory/store/'

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

app.get('/', function(req, res){
  res.redirect('/stores')
})

app.get('/admin/stores', function(req, res){

  store.findAll().then(function(results){

    results.map(function(result){
      return result.get({plain: true})
    })
    res.render("admin_stores", {stores: results})
  })
  

})

app.get('/stores', function(req, res){
  store.findAll().then(function(results){

    results.map(function(result){
      return result.get({plain: true})
    })
    res.render("stores", {stores: results})
  })
  

})

app.get(inventoryBaseUrl + ':storeId', function(req, res){

  var storeId = req.params.storeId
  var userId = 1

  list.findAll({
    where: { store_id: parseInt(storeId), user_id: 1 }, 
    include: 
    [
      { 
        model: product ,
        as: 'theProduct' 
     
      },
      {
        model: aisle, 
        as: 'theAisle' 
      }
    ]
  }).then((results)=>{ 
  
    var listEntries = results

    var sortedByAisle = {}

    if(listEntries.length){

      listEntries.forEach(function(entry){
        var parsedEntry = entry.get({plain: true})
      

        var aisleName = parsedEntry.theAisle[0].name
        var product = parsedEntry.theProduct[0]

  
        if(sortedByAisle[aisleName]){

          sortedByAisle[aisleName].push(product)
      
        }
        else{
          sortedByAisle[aisleName] = [product]
        }
        

      })

    }


    var arrayOfAisles = []

    for(var aisleName in sortedByAisle){
      var theAisleProducts = sortedByAisle[aisleName]
      arrayOfAisles.push({products: theAisleProducts, name: aisleName})
    }

    console.log(arrayOfAisles)


    function onStoreFound(store) {

      res.render( 'inventory', { storeId: storeId, userId: userId, store: store, aisles: arrayOfAisles } )


    }

    getStoreInventory(storeId, onStoreFound)
    

    
  }).catch(function(err){
      console.log(err)
      return res.render('error_message', { message: "something went wrong", route: "/store/" + req.params.id })
  })

})

app.get(manageStoreBaseUrl + ':id', function(req, res){

  function onStoreFound(store){
    
    res.render('manage_inventory', { store: store })

  }
  
  var id = parseInt(req.params.id)

  if( id && typeof id === 'number' && !isNaN(id) ){
    getStoreInventory(req.params.id, onStoreFound)
  }
  else{
    res.end()
  }
  

})

app.post('/aisle', function(req, res){
  const { name, storeId } = req.body
  aisle.create({
    name: name,
    store_id: parseInt(storeId)
  }).then((result)=>{
    res.redirect(manageStoreBaseUrl + storeId)
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
    res.redirect(manageStoreBaseUrl + storeId )
  })
})

app.post('/store', function(req, res){
  const { name } = req.body
  store.create({
    name: name
  }).then((result)=>{
    res.redirect('/stores')
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
      res.redirect(inventoryBaseUrl+ storeId)
    })
  }
  
})

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


app.listen(3000, () => console.log('Example app listening on port 3000!'))
