#! /usr/bin/env node
var parseDEM = require('./dem');
var fs = require('fs');

var argv = require('optimist')
    .usage('Usage: $0 --dem [DEM file] --dat [DAT file] --meta [metadata file]')
    .demand(['dem', 'dat', 'meta'])
    .argv;


parseDEM(argv.dem, function(dem) {
    var width = dem.profiles.length;
    var height = dem.profiles[0].elevations.length;
    
    var diff = 255.0 / (dem.maximumElevation - dem.minimumElevation);

    var wstream = fs.createWriteStream(argv.dat);
    
    for (var y = 0; y < height; y++) {
        var buffer = new Buffer(width);
        
        for (var x = 0; x < width; x++) {
            buffer[x] = Math.round(diff * (dem.profiles[x].elevationOfLocalDatum + dem.profiles[x].elevations[height - y - 1] + -dem.minimumElevation));
        }
        
        wstream.write(buffer);
    }

    wstream.end();

    var metadata = '';

    metadata += 'z: ' + dem.utmZone + '\n';
    metadata += 'w: ' + width + '\n';
    metadata += 'h: ' + height + '\n';
    metadata += 'nw: ' + dem.northWestEasting + ',' + dem.northWestNorthing + '\n';
    metadata += 'ne: ' + dem.northEastEasting + ',' + dem.northEastNorthing + '\n';
    metadata += 'se: ' + dem.southEastEasting + ',' + dem.southEastNorthing + '\n';
    metadata += 'sw: ' + dem.southWestEasting + ',' + dem.southWestNorthing + '\n';
    metadata += 'min_ele: ' + dem.minimumElevation + '\n';
    metadata += 'max_ele: ' + dem.maximumElevation + '\n';
    metadata += 'res_ew: ' + dem.eastWestResolution + '\n';
    metadata += 'res_ew: ' + dem.northEastResolution + '\n';
    metadata += 'res_ele: ' + dem.elevationResolution;

    fs.writeFileSync(argv.meta, metadata);
});
