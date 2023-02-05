# dicomweb-archive

An easy to use DICOMWEB server with SQL DB backend

## Description
* A nodejs tool to easily spawn a DICOMWEB server including a DICOM viewer connected via DICOMWEB (QIDO-RS and WADO-RS) protocol.
* Comes with preinstalled OHIF DICOM Web Viewer (version 4.12.50).
* Supports OHIF MPR (vtk.js) feature for viewing volumetric datasets
* Convention over configuration (works out of the box)
* Database agnostic can be configured to use SQLite (default) PostgreSQL, MySQL, MariaDB, MS SQL Server*, Oracle*, SAP Hana*, WebSQL databases*

(*) requires additional dependencies: see https://docs.nestjs.com/techniques/database

## Prerequisite

* nodejs 12 or newer
* database (optional)

## Setup Instructions (sqlite)

* clone repository and install dependencies  
  ```npm install```

## Setup Instructions (other databases)

* clone repository and install dependencies  
  ```npm install```

* rename the appropriate ormconfig-xxx.json matching your desired database

* optionally update credentials or database name

* create database (default: 'dicomweb') and user (as written in ormconfig) with appropriate grants

## Run Server

* run:  
  ```npm start```

* import DICOM images: put DICOM files into 'import' directory* and restart  

* open webbrowser and start viewing  
  ```http://localhost:5000```

(*) files are currently parsed in-place and indexed in the db, so they need to stay

## License
MIT

