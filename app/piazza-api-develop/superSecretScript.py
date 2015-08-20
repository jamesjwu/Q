from piazza_api import Piazza
import sys
import logging
import json
logging.captureWarnings(True)

if len(sys.argv) > 2:
    search_query = sys.argv[1]
else:
    search_query = "Nothing"

p = Piazza()


password = ""
with open("password.txt") as f:
    password = f.read()


p.user_login("jingzew@andrew.cmu.edu", password)

course = p.network("i4skbzt4mxk3ck")
data = {}
with open("test.txt", "w") as g:

    for i in course.iter_all_posts(limit=100):
        print i.get("history")[0]["subject"]
        print "piazza.com/class/i4skbzt4mxk3ck?cid=%d" % i["nr"]
        data[i.get("history")[0]["subject"]] = "piazza.com/class/i4skbzt4mxk3ck?cid=%d" % i["nr"]

    json.dump(data, g)

