from asyncio import Condition, sleep, get_event_loop, wait


async def workers(cond, i):
    print('shit')
    async with cond:
        print('worker {} is waiting'.format(i))
        await cond.wait()
        print('worker {} done'.format(i))


async def main():
    cond = Condition()
    fs = list([workers(cond, i) for i in range(10)])
    workers(cond, 11)
    workers(cond, 12)

    await sleep(0.1)
    async with cond:
        for i in range(4):
            print('notify {} workers'.format(i))
            cond.notify(i)
            await sleep(0.1)

    async with cond:
        await sleep(0.5)
        print('notify all')
        cond.notify_all()

    await wait(fs)



get_event_loop().run_until_complete(main())
