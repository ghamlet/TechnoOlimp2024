let express = require(`express`);
let app = express();
let port = 3003;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});

app.use(express.static(`public`));
app.use(express.urlencoded({ extended: true }))

let mongoose = require(`mongoose`);
mongoose.connect('mongodb://127.0.0.1:27017/flask_database');
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');//в какой папке находится

   
const studentSchema = new mongoose.Schema({
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
            
const Student = mongoose.model('student', studentSchema);


  app.get('/', async function (req, res) {
            let data = await Student.find()
        try {
            res.render('index', {data
                
            });
         } catch (err) {
            // План Б (что-то пошло не так)
            res.send('error!');
        }
    });



    app.get('/user/:id', async function (req, res) {
        let obj_id = req.params.id;
        console.log(obj_id);
    
        // let info =  await Student.findOne({_id: obj_id});
        // console.log(info);

        res.redirect(`/users_add?id=${obj_id}`);
    
        // res.render('about_user', {info});
    });

    // app.get('/user', function(req, res) {
    //   const ide = req.query.id;
      
    //   res.redirect(`/users_add?id=${ide}`);
    // });


    // app.get(`/user`, async function (req, res) {
    // let obj_ide = req.query.id;
    // console.log(obj_ide);

    // let info =  await Student.findOne({_id:obj_ide})
    //   console.log(info);

    


    app.get(`/users_add`, async function(req, res) {
      let obj_id = req.query.id;
      console.log(obj_id);

      let info =  await Student.findOne({_id: obj_id});
        console.log(info.image);

        res.render('about_user', {info});

    //   let info =   Student.findOne({_id:obj_id})
    //   console.log(info);

    //   let info =  Student.findOne({ide:ide})
    //   console.log(info);
    //     try {
    //         res.render('user', {info
                
    //         });
    //      } catch (err) {
    //         // План Б (что-то пошло не так)
    //         res.send('error!');
    //     }


    });
