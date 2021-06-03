const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = `mongodb+srv://Thann:dataworld2021@cluster0.013pv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  mongoose.set('useCreateIndex', true);

  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Connected BD');
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  connectDatabase: connectDatabase,
};
