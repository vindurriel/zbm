#encoding=utf-8
import web
class welcome:
    def POST(self):
        return self.GET()
    def GET(self):
        u= web.cookies().get('u')
        if u and u!='':
            raise web.redirect('/dish')
        else:
            render=web.template.render('.\\template')
            return render.login()