#encoding=utf-8
import web
db=web.database(dbn='sqlite',db='menu.db')
from utils import *
class chpwd:
    def GET(self):
        render=web.template.render('.\\template')
        return render.chpwd()
    def POST(self):
        import web
        u=web.cookies().get('u')
        if not getUserId():return "error:not logged in"
        i=web.input()
        dic={
            'u':u,
            'p':i.password or ""
        }
        granted=db.select('user',vars=dic,where="rowid = $u and password=$p")
        if not granted:
            return 'error:password incorrect'
        db.update('user',password=i.newpass,where="rowid = $u",vars=dic)
        return 'password changed'