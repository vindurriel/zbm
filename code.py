#encoding=utf-8
import web
from user import user
from dish import dish

render=web.template.render('.\\template')
class welcome:
    def POST(self):
        return self.GET()
    def GET(self):
        u= web.cookies().get('u')
        if u:
            raise web.redirect('/dish')
        else:
            return render.login()
if __name__ == "__main__":
    urls = (
    "/",    "welcome",
    "/user/(.*)",'user',
    "/dish",'dish',
    )
    app = web.application(urls, globals())
    app.run()