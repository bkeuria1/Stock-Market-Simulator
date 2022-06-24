require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo')
const passport = require('passport')
const saleRouter = require('./routes/sale')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const stockRouter = require('./routes/stock')
const mailRouter = require('./routes/mail')
const calculateBalance =  require('./balanceCron.js')

require('./passport')(passport)
let whitelist = ['http://localhost:3000','https://stock-market-simulator-mernapp.herokuapp.com']

let corsOptions = {
  origin: 'http://localhost:3000',
  credentials:true
}
app.use(cors(corsOptions))
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, 
  { useNewUrlParser: true,
   useUnifiedTopology: true,
   autoIndex:true
  
  })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookie())
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongooseConenction: mongoose.connection,
    mongoUrl: process.env.DATABASE_URL,
    collection: 'sessions'
   })
}));
//Configure Passport
app.use(logger('tiny'))
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter)
app.use('/sale', saleRouter)
app.use('/user', userRouter)
app.use('/stock',stockRouter)
app.use('/mail',mailRouter)

if(process.env.NODE_ENV === 'production'){
  console.log("Here is the balance_cron   " + process.env.BALANCE_CRON)
  if(process.env.BALANCE_CRON === 'true'){
    console.log("Calculate balance ran")
    calculateBalance()
  }else{
    console.log("Balance cron didn't run")
  }
  app.use(express.static('../frontend/build'))
 
}

console.log(process.env.NODE_ENV)
app.listen(process.env.PORT || 3001)