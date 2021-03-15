# dicomweb-archive

An easy to use DICOMWEB server with SQL DB backend

## Description
* A nodejs tool to easily spawn a DICOMWEB server including a DICOM viewer connected via DICOMWEB (QIDO-RS and WADO-RS) protocol.
* Comes with preinstalled OHIF DICOM Web Viewer (version 4.5.12).
* Supports OHIF MPR (vtk.js) feature for viewing volumetric datasets
* Convention over configuration (works out of the box)
* Database agnostic can be configured to use PostgreSQL (default), MySQL, MariaDB, SQLite*, MS SQL Server*, Oracle*, SAP Hana*, WebSQL databases*

(*) requires additional dependencies: see https://docs.nestjs.com/techniques/database

## Prerequisite

* nodejs 12 or newer
* database (e.g. Postgres, see above)

## Setup Instructions

* clone repository and install dependencies  
  ```npm install```

* create database (default: 'dicomweb') and user with write access

* update 'ormconfig.json' for db credentials

* run:  
  ```npm start```

* import DICOM images: put DICOM files into 'import' directory and restart  (files are parsed and copied into data directory, can be removed afterwards)

* open webbrowser and start viewing  
  ```http://localhost:5000```

## License
MIT
