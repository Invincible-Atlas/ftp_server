fs = require("fs");
path = require("path");
express = require("express");
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
  // res.send("hi");
  const folderpath = __dirname+"/files";
  res.send(fs.readdirSync(folderpath));
});
app.all('*', (req, res) => {
    res.status(404).send('<h1>This page doesn'+"'"+'t exist, dumbass!</h1>');
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})