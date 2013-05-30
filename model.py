#encoding=utf-8
import web
from utils import *
# render=web.template.render('.\\template')
class model:
    def GET(self,key="机器学习"):
		print "#####",key
		render=web.template.render('.\\template',globals=locals())
		return render.model()
		
class search:
	def do_search(self,key,serviceType):
		from suds.client import Client
		url='http://192.168.4.228:8080/ContentService/CrawledIndex?wsdl'
		client = Client(url)
		pageInfo=client.factory.create('pageInfo')
		pageInfo.pageNum = 1
		pageInfo.pageSize = 10
		info=client.factory.create('searchInfo')
		info.serviceType = serviceType
		info.keyValueInfo = client.factory.create('keyValueInfo')
		info.keyValueInfo.key = "keyword"
		info.keyValueInfo.value = key
		n=client.service.getEntityList(pageInfo,info)
		if str(n.operationInfo.code)!="200":
			return []
		file("do_search.txt","w").write(str(n))
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
				self.result[x.key]={"name":x.key,"size":1,"type": "expandRead"}
		if "ReferData" in children:
			for x in children["ReferData"]:
				self.result[x.key]={"name":x.key,"size":1,"type": "referData","url":x.value}
		return
	def get_set(self,li):
		return set([x.name for x in baidu])
	def __init__(self):
		self.result={}
	def GET(self,key):
		import json
		web.header('Content-Type', 'application/json')
		self.result={}
		names=set([(x,True) for x in web.input().children.split("||")])
		self.do_search(key,"baiduBaikeCrawler")
		self.do_search(key,"hudongBaikeCrawler")
		for x in set(web.input().children.split("||")):
			if x in self.result:
				del self.result[x]
		res=self.result.values()
		return json.dumps(res)