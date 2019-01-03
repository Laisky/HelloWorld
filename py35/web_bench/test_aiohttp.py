from aiohttp import web


class DemoHandle(web.View):

    async def get(self):

        return web.Response(text="Hello, World")


app = web.Application()
app.router.add_route('*', '/', DemoHandle)
web.run_app(app, host='0.0.0.0', port=8000)
