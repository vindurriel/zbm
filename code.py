#encoding=utf-8
import sys
sys.path.append('.\\controllers')
import web
urls=[]
for x in [x.split() for x in file('.\\routers.txt','r').readlines()]:
    if not x or len(x)!=2:continue;
    urls.append(x[0])
    urls.append(x[1])
    cmd='from %s import %s'%(x[1],x[1])
    try:
        exec(cmd)
    except Exception, e:
        pass

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()