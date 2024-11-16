const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 2323;
const connectDB = require('./config/db');
connectDB();
const app = express();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const { notfound, errorHandler } = require('./middleware/errorHandler');
//routes
const songRoutes = require('./route/songRoutes');

app.use('/api/v1/songs', songRoutes);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('api is running');
  });
}
app.use(notfound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Listsening on port ${port}`);
});
