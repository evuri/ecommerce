const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();
// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const categoryRoutes = require('./routes/category');

const shopRoutes = require('./routes/shop');

const productRoutes = require('./routes/product');

const orderRoutes = require('./routes/order');

const cashfreeRoutes = require('./routes/cashfree');

var path = require('path');

// app
const app = express();


// db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', shopRoutes);
app.use('/api', productRoutes);

app.use('/api', cashfreeRoutes);
app.use('/api', orderRoutes);



const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
