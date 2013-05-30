#encoding=utf-8
from suds.client import Client
url='http://192.168.4.228:8080/ContentService/CrawledIndex?wsdl'
client = Client(url)
# print client
pageInfo=client.factory.create('pageInfo')
pageInfo.pageNum = 1
pageInfo.pageSize = 10
searchInfo=client.factory.create('searchInfo')
searchInfo.serviceType = "baiduBaikeCrawler"
searchInfo.keyValueInfo = client.factory.create('keyValueInfo')
searchInfo.keyValueInfo.key = "keyword"
searchInfo.keyValueInfo.value = u"搜索"
n=client.service.getEntityList(pageInfo,searchInfo)
file("suds.txt","w").write(str(n))
children={}
def getv(o):
	if hasattr(x,"value"):
		return x.value
	return None
for x in n.components[0].children:
	print x
	if hasattr(x,"properties"):
		for y in x.properties:
			children.setdefault(x.name,[]).append(y.key)
res=dict([(x.key,getv(x)) for x in n.components[0].properties])
print children
category=children["Category"]
expand=children["ExpandRead"]
refer=children["ReferData"]
	# print v
	# print v
for k,v in category.iteritems():
	print "[%s]"%k
for k,v in expand.iteritems():
	print "[%s]"%k
for k,v in refer.iteritems():
	print "[%s]"%k
