import requests;
import json;

#Just something I'm using to test the server stuff
#    -Avery

options = {
    "host": "roberts.seng.uvic.ca",
    "path": "/ai/random",
    "port": "30000",
    "method": "POST"
}

moveData = {
    "size": 2,
    "board": [[1,0],[0,0]],
    "last":{
        "x": 0,
        "y": 0,
        "c": 1,
        "pass": False
    }
}

headers = {"Content-Type":"application/json"}
data={"options":options,"moveData":moveData}

r = requests.post("http://localhost:3000/ai",data = json.dumps(data),headers=headers)

print r.text