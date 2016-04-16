var fs = require('fs');

const FILE_NAME = 0;
const UTM_ZONE = 162;
const SW_EASTING = 546;
const SW_NORTHING = 570;
const NW_EASTING = 594;
const NW_NORTHING = 618;
const NE_EASTING = 642;
const NE_NORTHING = 666;
const SE_EASTING = 690;
const SE_NORTHING = 714;
const MINIMUM_ELEVATION = 738;
const MAXIMUM_ELEVATION = 762;
const SPATIAL_RESOLUTION_X = 816;
const SPATIAL_RESOLUTION_Y = 828;
const SPATIAL_RESOLUTION_Z = 840;
const NUMBER_OF_COLUMNS = 858;
const FORMAT_A40 = 40;
const FORMAT_I6 = 6;
const FORMAT_1_D24_15 = 12;
const FORMAT_2_D24_15 = 24;
const FORMAT_1_E12_6 = 12;

function parseDEM(file, callback) {
    var fd = fs.openSync(file, 'r');

    var buffer = new Buffer(1024);


    var pos = fs.readSync(fd, buffer, 0, 1024, 0);

    var dem = {};

    dem.name = buffer.slice(FILE_NAME, FORMAT_A40).toString().trim();
    dem.utmZone = parseInt(buffer.slice(UTM_ZONE, UTM_ZONE + FORMAT_I6).toString());

    dem.northEastEasting = parseFloat(buffer.slice(NE_EASTING, NE_EASTING + FORMAT_2_D24_15).toString());
    dem.northEastNorthing = parseFloat(buffer.slice(NE_NORTHING, NE_NORTHING + FORMAT_2_D24_15).toString());

    dem.northWestEasting = parseFloat(buffer.slice(NW_EASTING, NW_EASTING + FORMAT_2_D24_15).toString());
    dem.northWestNorthing = parseFloat(buffer.slice(NW_NORTHING, NW_NORTHING + FORMAT_2_D24_15).toString());

    dem.southWestEasting = parseFloat(buffer.slice(SW_EASTING, SW_EASTING + FORMAT_2_D24_15).toString());
    dem.southWestNorthing = parseFloat(buffer.slice(SW_NORTHING, SW_NORTHING + FORMAT_2_D24_15).toString());

    dem.southEastEasting = parseFloat(buffer.slice(SE_EASTING, SE_EASTING + FORMAT_2_D24_15).toString());
    dem.southEastNorthing = parseFloat(buffer.slice(SE_NORTHING, SE_NORTHING + FORMAT_2_D24_15).toString());

    dem.minimumElevation = parseFloat(buffer.slice(MINIMUM_ELEVATION, MINIMUM_ELEVATION + FORMAT_2_D24_15).toString());
    dem.maximumElevation = parseFloat(buffer.slice(MAXIMUM_ELEVATION, MAXIMUM_ELEVATION + FORMAT_2_D24_15).toString());

    dem.eastWestResolution = parseFloat(buffer.slice(SPATIAL_RESOLUTION_X, SPATIAL_RESOLUTION_X + FORMAT_2_D24_15).toString());
    dem.northEastResolution = parseFloat(buffer.slice(SPATIAL_RESOLUTION_Y, SPATIAL_RESOLUTION_Y + FORMAT_2_D24_15).toString());
    dem.elevationResolution = parseFloat(buffer.slice(SPATIAL_RESOLUTION_Z, SPATIAL_RESOLUTION_Z + FORMAT_2_D24_15).toString());

    var profileCount = parseInt(buffer.slice(NUMBER_OF_COLUMNS, NUMBER_OF_COLUMNS + FORMAT_I6).toString());

    dem.profiles = [];

    while (profileCount > 0) {
        profileCount--;
        
        var profile = {};

        pos += fs.readSync(fd, buffer, 0, 1024, pos);

        profile.elevationOfLocalDatum = parseFloat(buffer.slice(72, 72 + FORMAT_2_D24_15).toString().trim());
        profile.elevations = [];

        var rowCount = parseInt(buffer.slice(12, 12 + FORMAT_I6).toString().trim());

        var offset = 144;

        while (true) {
            var elevation = parseFloat(buffer.slice(offset, offset + FORMAT_I6).toString().trim());
            profile.elevations.push(elevation * dem.elevationResolution + profile.elevationOfLocalDatum);
            offset += FORMAT_I6;
            rowCount--;

            if (offset === 1020) {
                break;
            }
        }

        var done = false;

        while (!done) {
            pos += fs.readSync(fd, buffer, 0, 1024, pos);

            offset = 0;

            while (offset < 1020) {
                var elevation = parseFloat(buffer.slice(offset, offset + FORMAT_I6).toString().trim());
                profile.elevations.push(elevation * dem.elevationResolution + profile.elevationOfLocalDatum);
                offset += FORMAT_I6;
                rowCount--;

                if (rowCount === 0) {
                    done = true;
                    break;
                }
            }
        }

        dem.profiles.push(profile);
    }

    callback(dem);
}

module.exports = parseDEM;