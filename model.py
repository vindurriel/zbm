#encoding=utf-8
import web
import suds
from utils import *
# render=web.template.render('.\\template')
def get_file_name(name):
	return u".\\static\\files\\{0}.json".format(name)
class model:
	def GET(self,key="机器学习"):
		print "###model.get##",key
		render=web.template.render('.\\template',globals=locals())
		return render.model()
	def POST(self):
		import json
		data=json.loads(web.data())
		print "###model.post##"
		file(get_file_name(data["name"]),"w").write(json.dumps(data,indent=2))
		return "ok"
class load:
	def GET(self,key="机器学习"):
		web.header('Content-Type', 'application/json')
		import os,json
		fname=get_file_name(key)
		res={}
		if not os.path.isfile(fname):
			return json.dumps({"error":"json file not found"})
		raw=file(fname,"r").read()
		return json.dumps(json.loads(raw),indent=2)
		
class search:
	def do_search(self,key,serviceType):
		node_prefix=u"知识点::"
		url='http://192.168.4.228:8080/ContentService/CrawledIndex?wsdl'
		client = suds.client.Client(url)
		pageInfo=client.factory.create('pageInfo')
		pageInfo.pageNum = 1
		pageInfo.pageSize = 10
		info=client.factory.create('searchInfo')
		info.serviceType = serviceType
		info.keyValueInfo = client.factory.create('keyValueInfo')
		info.keyValueInfo.key = "keyword"
		info.keyValueInfo.value = key
		n=client.service.getEntityList(pageInfo,info)
		code=str(n.operationInfo.code)
		if code!="200":
			return code
		props=dict([(x.key,x.value) for x in n.components[0].properties])
		name=unicode(props["title"])
		self.result[node_prefix+name]={
			"name":node_prefix+name,
			"size":1,
			"type":"referData",
			"url":unicode(props["Url"])
		}
		children={}
		for x in n.components[0].children:
			if hasattr(x,"properties"):
				children.setdefault(x.name,[])
				for y in x.properties:
					y.key=unicode(y.key)
					children[x.name].append(y)
		if "Category" in children:
			for x in children["Category"]:
				self.result[x.key]={"name":x.key,"size":1,"type": serviceType}
		if "ExpandRead" in children:
			for x in children["ExpandRead"]:
				self.result[node_prefix+x.key]={"name":node_prefix+x.key,"size":1,"type": "referData","url":x.value}
		if "ReferData" in children:
			for x in children["ReferData"]:
				self.result[node_prefix+x.key]={"name":node_prefix+x.key,"size":1,"type": "referData","url":x.value}
		return code
	def __init__(self):
		self.result={}
	def GET(self,key):
		import json
		web.header('Content-Type', 'application/json')
		self.result={}
		print self.do_search(key,"baiduBaikeCrawler")
		print self.do_search(key,"hudongBaikeCrawler")
		res=self.result.values()
		for x in res:
			print x["name"]
		return json.dumps(res)