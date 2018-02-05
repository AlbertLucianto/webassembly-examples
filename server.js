const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(`
    <ul style="font-family: Helvetica">
      ${getDirectories(__dirname)
          .map(dir => `<li><a href="/${removeLeadingPath(dir)}">${removeLeadingPath(dir)}</a></li>`)
          .join('')}
    </ul>`)
});

app.use('/', express.static(__dirname));

const PORT = process.env.PORT || 3000;

app.listen(3000);
console.log('Server is running on port ' + PORT + '.');

function removeLeadingPath(dir) {
  const slashIdx = dir.lastIndexOf('/');

  return dir.slice(slashIdx + 1);
}

function isDirectory(source) {
  return fs.lstatSync(source).isDirectory();
}

function getDirectories(source) {
  const excludeList = ['.git', 'node_modules'];

  return fs
          .readdirSync(source)
          .map(name => path.join(source, name))
          .filter(isDirectory)
          .filter(name =>
            !excludeList
              .includes(removeLeadingPath(name)));
}
