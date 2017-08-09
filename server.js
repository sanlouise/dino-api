const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache' )

app.use(express.static('./public'))

let allDinos = [
  {"id":1, "name":"dinodino", "colors":["blue", "red"], "size":2, "habitats":"jungle"},
  {"id":2, "name":"dinodino2", "colors":["red", "yellow"], "size":3, "habitats":"woods"},
  {"id":3, "name":"dinodino3", "colors":["blue", "red"], "size":1, "habitats":"plains"}
]

app.get('/api/dinosaurs', (req, res) => {
  const { key, value } = req.query;
  const allDinosClone = [...allDinos];
  if (key && value) {
    allDinosClone.filter((dino) => dino[key] === value);
  }
  res.json(allDinos);
});

app.get('/api/dinosaurs/:id', (req, res) => {
  const dinoId = parseInt(req.params.id)
  const myDino = allDinos.find(dino => dino.id === dinoId)
  res.json(myDino);
});

app.get('/api/dinosaurs/:id/habitats', (req, res) => {
  const dinoId = parseInt(req.params.id)
  const myDino = allDinos.find(dino => dino.id === dinoId)
  const habitats = myDino.habitats;
  res.json(habitats);
});

app.post('/api/dinosaurs', (req, res) => {
  let newDino = {
    id: allDinos.length +1,
    name:req.body.name,
    colors:req.body.colors,
    size: req.body.size,
    habitats:req.body.languages
  }
  allDinos.push(newDino)
  res.json(newDino)
});

// update
app.put('/api/dinosaurs/:id', (req, res) => {
  const { key, value } = req.body;
  if (!key || !value) {
    return res.status(400).send({ message: 'Missing key or value in body.' });
  }

  const dinoId = parseInt(req.params.id);
  const dinoIndex = allDinos.findIndex(dino => dino.id === dinoId);
  if (dinoIndex < 0) {
    return res.status(404).send({ message: 'Dino not found.' });
  }

  const dino = allDinos[dinoIndex];
  if (dino[key]) {
    dino[key] = value;
    return res.json(dino);
  }
  return res.status(400).json(dino);
})

app.delete('/api/dinosaurs/:id', (req, res) => {
  const dinoId = parseInt(req.params.id)
  allDinos = allDinos.filter(dino => dino.id !== dinoId)
  res.json(allDinos)
})

app.listen(3000, () => {
  console.log("Server is running!")
});
