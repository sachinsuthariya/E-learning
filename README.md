# Typescript Package

This is basic struture of types script project which can be clone for any type script project. This package provide folder/file structure for typescript project and you can take reference from it

  - Folder/File structure
  - Code structure
  - API example
  - API Doc
  - AWS S3 File upload
  - AWS SES

# Features!

  - Basic API examples with different methods like GET, POST
  - AWS S3 and SES example

You can also:
  - Import and save files from GitHub, Dropbox, Google Drive and One Drive
  - Drag and drop markdown and HTML files into Dillinger
  - Export documents as Markdown, HTML and PDF

### Command line instructions

You can also upload existing files from your computer using the instructions below.

#### Git global setup

```sh
$ git config --global user.name "Your Name"
$ git config --global user.email "Your Email Address"
```

#### Create a new repository

```sh
$ git clone git@git.sa-labs.info:sa/nodejs-template-typescript.git
$ cd nodejs-template-typescript
$ touch README.md
$ git add README.md
$ git commit -m "add README"
$ git push -u origin master
```
#### Push an existing folder
```sh
$ cd existing_folder
$ git init
$ git remote add origin git@git.sa-labs.info:sa/nodejs-template-typescript.git
$ git add .
$ git commit -m "Initial commit"
$ git push -u origin master
```

#### Push an existing Git repository
```sh
$ cd existing_repo
$ git remote rename origin old-origin
$ git remote add origin git@git.sa-labs.info:sa/nodejs-template-typescript.git
$ git push -u origin --all
$ git push -u origin --tags
```

### Installation

Typescript require lastest stable version of [Node.js](https://nodejs.org/) v8+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd nodejs-template-typescript
$ npm install
$ npm start
```

### Plugins

Typescript is currently extended with the following plugins. Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| AWS S3 | [plugins/dropbox/README.md][AWS-S3] |
| AWS SES | [plugins/github/README.md][AWS-SES] |

