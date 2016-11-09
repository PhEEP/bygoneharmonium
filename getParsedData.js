var parsedData = [];
var count = 0;
var tempLoc = '';
var tempID = '';

var resetBygone = function(id, loc) {
     return {"id":id,"loc":loc};
};


fs.writeFileSync('./data/bygones.json', '[','utf8', function(err) {
     if (err) {
          console.log('error',err);
     } else {
          console.log('File instantiated');
     }
});
var rl = readline.createInterface({
     input: fs.createReadStream('./data/bygone.txt')
});
rl.on('line', function(line) {
     count++;
     var regex = /\((.*?)\)/;
     if (count === 2) {
          count = 0;
          tempID = line.match(regex)[1].split(',');
          _.forEach(tempID, function(value) {
               var regexint = /\'(.*?)\'/;
               value = value.match(regexint)[1];
               // console.log(value);
               // console.log(parseInt(value));
               var bygone = new resetBygone(parseInt(value), tempLoc);
               fs.appendFile('./data/bygones.json', JSON.stringify(bygone) + ',\r\n', function(err) {
                    // console.log('data appended to file');
               });
          });
     } else if (count === 1) {
          tempLoc = line.match(regex)[1].split(',');
          tempLoc[0] = parseFloat(tempLoc[0]);
          tempLoc[1] = parseFloat(tempLoc[1]);
          console.log(tempLoc);
     }
});
rl.on('close', function() {
     fs.appendFile('./data/bygones.json', '{"id":0,"loc":"0,0"}]', 'utf8', function(err) {
          if (err) throw err;
          console.log('It\'s saved!');
     });
});
