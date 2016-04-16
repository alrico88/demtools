#! /usr/bin/env node

var parseDEM = require('./dem');
var fs = require('fs');
var PNG = require('node-png').PNG;

var argv = require('optimist')
    .usage('Usage: $0 --dem [DEM file] --png [PNG file]')
    .demand(['dem', 'png'])
    .argv;

parseDEM(argv.dem, function(dem) {
    var width = dem.profiles.length;
    var heigth =  dem.profiles[0].elevations.length;

    var png = new PNG({width: width, height: heigth});

    var diff = 255.0 / (dem.maximumElevation - dem.minimumElevation);

    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var idx = (png.width * y + x) << 2;

            var h = Math.round(diff * (dem.profiles[x].elevationOfLocalDatum + dem.profiles[x].elevations[png.height - y - 1] + -dem.minimumElevation));

            png.data[idx] = h;
            png.data[idx + 1] = h;
            png.data[idx + 2] = h;
            png.data[idx + 3] = 255;
        }
    }

    png.pack().pipe(fs.createWriteStream(argv.png));
});
