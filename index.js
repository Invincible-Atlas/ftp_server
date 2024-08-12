fs = require("fs");
path = require("path");
express = require("express");
const mime = require('mime-types');
function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://worker-server.pages.dev*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}
function walk(dir) {
  let fsjson = [];
  // get the contents of dir
  let items = fs.readdirSync(dir);
   

      // for each item in the contents
      items.forEach((item) => {

          // get the item path
          let itemPath = path.join(dir, item);

          // get the stats of the item
          stats = fs.statSync(itemPath);
          

              // Just log the item path for now
              // console.log(itemPath);

              // for now just use stats to find out
              // if the current item is a dir
              if (stats.isDirectory()) {

                  // if so walk that too, by calling this
                  // method recursively
                  fsjson.push({"name":item,"contents":walk(itemPath)});
                  // console.log(fsjson)

              }else{
                fsjson.push({"name":item,"path":itemPath});
                // console.log(fsjson)
              }

         

      });

  
  return(fsjson);
};
console.log(JSON.stringify(walk("./files/")));
function readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      return data.toString();
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
}
const app = express()
const bodyParser = require('body-parser');
const { dirname } = require("path");
app.use(setCorsHeaders);
app.use(bodyParser.urlencoded({ extended: true }));
const port = 4000
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('<script>window.location.href = window.location.href + "public/index.html";</script>')
});
app.get('/files/*', function(req, res){
  var filepath = req.path.replace("/files/","");
  const file = `${__dirname}/files/${filepath}`;
  const mimeType = mime.lookup(file);
  res.setHeader("content-type",mimeType);
  res.send(readFile(file)); // Set disposition and send it.
  // res.send(req.path);
});
app.get('/download/*', function(req, res){
    var filepath = req.path.replace("/download","");
    const file = `${__dirname}${filepath}`;
    res.download(file); // Set disposition and send it.
    // res.send(req.path);
});
app.get("/files", (req,res) =>{
  fs.writeFileSync("./public/files.json",JSON.stringify(walk("./files/")))
  res.send('<script>window.location.href = window.location.href.replace(window.location.pathname,"").replace(window.location.search,"") + "/files.html";</script>')
});
app.all('*', (req, res) => {
    res.status(404).send('<h1>This page doesn'+"'"+'t exist, dumbass!</h1>');
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})