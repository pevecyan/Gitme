# Gitme
###### Makes writing READMEs for git  faster and easier!

 
## Project Setup
Set up environment to start working on this project.
#### Requirements:
* nodejs (npm)

#### Setup
* Get source code from [GitHub](https://github.com/pevecyan/Gitme).
Directory structure should look something like this:
```
/GitMe
  /app
  /.gitignore
  /README.md
```
* Inside GitMe folder run following npm commands
```
npm install electron-prebuilt --save-dev
npm install markdown-it
```
* And you are ready to go!

#### Run
* To start GitMe run following command in GitMe directory
```
node_modules\electron-prebuilt\dist\electron.exe app
```
* And stop it with ctrl+c in command prompt