"""
Relate discussion: https://twitter.com/LaiskyCai/status/1790935286245163035

Disclaimer: I am writing this code just for fun,
so those who are learning Python should not follow this example.

IMHO, there is no doubt that ◍◍◍◍'s presentation involved deception.
I mean, it is ◍◍◍◍ after all, would it be even more surprising
if they didn't cheat?
"""

import time
import asyncio

loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)


class Ret:
    def __init__(self, future):
        self.future = future

    def write(self, path):
        img = loop.run_until_complete(self._first_run())
        if img:
            self._save(path, img)
            return

        time.sleep(6)

        img = loop.run_until_complete(self._run())
        self._save(path, img)

    def _save(self, path, img):
        with open(path, "wb") as f:
            f.write(img)

    async def _first_run(self):
        try:
            return await asyncio.wait_for(self.future, timeout=1)  # lucky if hit cache
        except Exception:
            pass

    async def _run(self):
        return await self.future()


class RAG:
    async def draw_image(self):
        # wait the image to be ready
        # may cost 3s
        pass

    def query(self, q):
        return Ret(self.draw_image())


rag = RAG()

if __name__ == "__main__":
    q = "Huawei was the first, then came heaven."
    ret = rag.query(q)
    ret.write("./output.png")
