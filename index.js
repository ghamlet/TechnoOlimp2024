let express = require(`express`);
let app = express();
let port = 3003;


const esprima = require('esprima');

const fileUpload = require('express-fileupload');
app.use(fileUpload());


const bcrypt = require('bcrypt'); //хеширование
const saltRounds = 10;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});



 
app.use(express.static(`public`));

app.use(express.urlencoded({ extended: true }))

let mongoose = require(`mongoose`);
mongoose.connect('mongodb://127.0.0.1:27017/flask_database');

app.set('view engine', 'ejs');//в какой папке находится

   
const studentSchema = new mongoose.Schema({
    email: String,
    password: String,

    surname:String,
    name:String,
    middle_name:String,
    image:String,
    edu_org:String,
    class_course_of_study:String,
    summary: String,
    add_achiev: String,
    progress: String

});


const demoSchema = new mongoose.Schema({

  surname:String,
  name:String,
  middle_name:String,
  image:String,
  edu_org:String,
  class_course_of_study:String,
  summary: String,
  add_achiev: String,
  progress: String

});

// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String
// });


const adminSchema = new mongoose.Schema({
  email: String,
  password: String
});
            
const Student = mongoose.model('Users', studentSchema);
const Admin = mongoose.model('Admin', adminSchema);

const Demo = mongoose.model('Students', demoSchema);




  app.get('/', async function (req, res) {
            let data = await Student.find()
        try {
            res.render('page2', {data
                
            });
         } catch (err) {
            res.send('error!');
        }
    });


//Индивидуальная карточка студента
app.get('/user/:id', async  function (req, res) {
  let obj_id = req.params.id;
  // console.log(obj_id);

  let info = await Demo.findOne({_id: obj_id});
  console.log(info.name);

 
  res.render('admin_about_user.ejs', {info}); 
});





//Страничка со всеми карточками для админа
app.get('/admin', async function (req, res) {
  let data = await Demo.find()
try {
  res.render('admin_view.ejs', {data});
} catch (err) {
  res.send('error!');
}
});




//Регистрация
app.post('/submit-form',  (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {  //функция хеширования
    if (err) {
      console.error(err);
    } else {
      
      const newStudent = new Student({
        email: email,
        password: hash,

        surname:' ',
        name:' ',
        middle_name:' ',
        image:' ',
        edu_org:' ',
        class_course_of_study:' ',
        summary: ' ',
        add_achiev: ' ',
        progress: ' '

      });
      
      newStudent.save()
      .then(() => {
        console.log('User saved successfully!');
      })
      .catch(err => {
        console.error(err);
      });
      
      res.redirect('/');


    }
  });


});



//Резюме студента для заполнения
app.get('/student', async function (req, res) {
  const id = req.query.id;
  console.log(id);

  let info =  await Student.findOne({_id: id});
  console.log(info);

  try {
    res.render('input_user.ejs', {info});

 } catch (err) {
    res.send('error!');
}
   
});


//Ссылка для кнопки Вход на главной странице
app.get('/login', async function (req, res) {
  try {
    res.render('login.ejs');

 } catch (err) {
    res.send('error!');
}
   
});


//Вход в аккаунт

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;  
    console.log(email, password)
  
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // return res.status(401).send('Это не почта админа');
      const user = await Student.findOne({ email });
      if (!user) {
        return res.status(401).send('Почта не зарегистрирована');
      }
    
      // Compare the incoming password to the stored hash
      const isPasswordUserValid = await bcrypt.compare(password, user.password);
    
      if (!isPasswordUserValid) {
        return res.status(401).send('Неверный пароль');
      }
      
      res.redirect('/student?id=' + user._id);

    } else {
      const isPasswordAdminValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordAdminValid) {
        return res.status(401).send('Неверный пароль для админа');
      }
      
      res.redirect('/admin');
    }
  
  });

 
  app.post('/user_input',  (req, res) => {
   console.log( req.body )
   
    const id = req.body.id;
   console.log('id', id);
   console.log('TELO',req.body);

   const update = req.body;
   const query = { _id: id };

   Student.updateOne(query, update)
   .then(() => {
     res.redirect('/student?id=' + id);
   })
   .catch((err) => {
     console.error(err);
   });
});



app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(req.body);
  const id = req.body.ai;
  console.log('name', id)
  
  
  const file = req.files.photo;
  const uploadPath = __dirname + '/public/images/' + id + '.jpg';

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.redirect('/student?id=' + id);
    // res.send(`File ${file.name} uploaded to ${uploadPath}`);
  });
});



app.post('/admin', async function(req, res) {
	const mark = req.body.progress; 
  const achiev = req.body.add_achiev; 
  console.log(mark, achiev);

  if (!mark && !achiev) {
    const data = await Demo.find();
    try {
      res.render('admin_view.ejs', {data});
    } catch (err) {
      res.send('error!');
    }
  }  else if (mark){
    const data = await Demo.find({'progress': mark});
    try {
      res.render('admin_view.ejs', {data});
    } catch (err) {
      res.send('error!');
    }
  }  else if (achiev){
    const data = await Demo.find({'add_achiev': achiev});
    try {
      res.render('admin_view.ejs', {data});
    } catch (err) {
      res.send('error!');
    }
  }


});