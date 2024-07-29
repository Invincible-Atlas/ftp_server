fs = require("fs");
path = require("path");
express = require("express");
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
                fsjson.push({"name":item});
                // console.log(fsjson)
              }

         

      });

  
  return(fsjson);
};
console.log(JSON.stringify(walk("./files/")));

// const isDirectory = filepath => fs.statSync(filepath).isDirectory();
// const getDirectories = filepath =>
//     fs.readdirSync(filepath).map(name => path.join(filepath, name)).filter(isDirectory);

// const isFile = filepath => fs.statSync(filepath).isFile();  
// const getFiles = filepath =>
//     fs.readdirSync(filepath).map(name => path.join(filepath, name)).filter(isFile);

// const getFilesRecursively = (filepath) => {
//     let dirs = getDirectories(filepath);
//     let files = dirs
//         .map(dir => getFilesRecursively(dir)) // go through each directory
//         .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
//     return files.concat(getFiles(filepath));
// };
// console.log(getFilesRecursively("./files/"))
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
app.use(bodyParser.urlencoded({ extended: true }));
const port = 4000
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('<script>window.location.href = window.location.href + "public/index.html";</script>')
})
app.get('/download/*', function(req, res){
    var filepath = req.path.replace("/download","");
    const file = `${__dirname}/files/${filepath}`;
    res.download(file); // Set disposition and send it.
    // res.send(req.path);
});
app.get("/files", (req,res) =>{

  res.send('<script>window.location.href = window.location.href + "public/files.html";</script>')
});
app.all('*', (req, res) => {
    res.status(404).send('<h1>This page doesn'+"'"+'t exist, dumbass!</h1>');
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})