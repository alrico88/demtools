# DEM-tools

## Background
The USGS Digital Elevation Model (DEM) data files are digital representations of cartographic information in a raster form.  A DEM file consist of a sampled array of elevations for a number of ground positions at regularly spaced intervals.

DEM-tools consists of the following command line utilities:

  - `dem2png` - a utility for converting a DEM file to a PNG file
  - `dem2dat` - a utility for converting a DEM file to a DAT file

## Installation
To install the DEM-tools, type the following (you may need superuser priveleges):

```npm install -g demtools```

The `dem2png` and `dem2dat` will now be available on the command line.

## Usage

The DEM file format is not very efficient to work with, due to huge files.  Converting the DEM files to more convenient formats makes very much sense.  DEM-tools let you convert a DEM file into a PNG file, or a binary file.

### dem2png
The `dem2png` utility takes a DEM file as its input, and creates a PNG file, where elevation in represented as a grayscale value between `0,0,0` and `255,255,255`, where `0,0,0` represents the lowest elevation in the map, and `255,255,255` the highest.

### dem2dat
The `dem2dat` utility also takes a DEM file as its input, but creates a binary file, where each (unsigned) byte represents an elevation sample. `0x00` represents the lowest elevation in the map, and `0xff` the highest.

Both `dem2png` and `dem2dat` will also output a metadata file.  An example of the contents of a metadata file:

```
z: 33
w: 5041
h: 5041
nw: 199800,6700200
ne: 250200,6700200
se: 250200,6649800
sw: 199800,6649800
min_ele: 13
max_ele: 1061
res_ew: 10
res_ew: 10
res_ele: 0.1
```

The metadata file contains the following information derived from the DEM file:

 - The UTM zone.
 - The width and height in samples.
 - The corner coordinates (in UTM, as easting/northing pairs).
 - Minimum and maximum elevations.
 - The spatial resolutions.

## Author

The author of DEM-tools is Werner Vesterås <wvesteraas@gmail.com>