from flask import *
import json
import os

app = Flask(__name__)

@app.route('/')
def main():
   return render_template("home.html")

@app.route('/pages')
def redirect(): # Redirect pages
    page = request.args.get('page')
    try:
        fileName = page + ".html"
        return render_template(fileName)
    except:
        return render_template("home.html")
    
@app.route('/json')
def get_json(): # Get JSON files function
   name = request.args.get('name')
   try:
      path = "json/projviewer/" + name + ".json"
      file = open(path, "r")
      jsonContent = json.loads(file.read())

      return json.dumps(jsonContent) # Send whole json
   except:
      return None
   
@app.route('/download')
def download(): # Return file for client download
   file = request.args.get('file')
   try:
      return send_file(file)
   except:
      return None
   
@app.route('/get-languages')
def languages(): # Get language percentages
   presentLanguages = {}
   for jsonFile in os.listdir("json/projviewer"):
      fileContent = open("json/projviewer/" + jsonFile, "r")
      jsonObj = json.loads(fileContent.read())
      for project in jsonObj["content"]:
         for lang in project["languages"]:
            if(lang in presentLanguages):
               presentLanguages[lang] += 1 # Increment
            else:
               presentLanguages.update({lang: 1}) # Doesnt exist, so add it
   
   return json.dumps(presentLanguages)

@app.route('/get-project-count')
def project_count(): # Get number of documented projects & lines of code
   projectCount = 0
   lineCount = 0
   for jsonFile in os.listdir("json/projviewer"):
      fileContent = open("json/projviewer/" + jsonFile, "r")
      jsonObj = json.loads(fileContent.read())
      for project in jsonObj["content"]:
         projectCount += 1
         lineCount += project["lines"]

   return json.dumps({"project_count": projectCount, "line_count": lineCount})

if __name__ == '__main__':
   app.run(host='0.0.0.0', debug=True, port=5000)