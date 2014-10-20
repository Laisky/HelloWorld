**Some tutorial about Cython**

- [Cython tutorial](http://conference.scipy.org/proceedings/SciPy2009/paper_1/)
- [Fast numerical computations with Cython](http://conference.scipy.org/proceedings/SciPy2009/paper_2/)
- [Cython三分钟入门](http://blog.csdn.net/gzlaiyonghao/article/details/4561611)

**Running**

```sh
$ python setup.py build_ext --inplace
$ ipython bench.ipy
```

**Profile Analysis**

You can analysis any python file by run

```sh
$ cython -a origin.py
```

Then you get this:
[cython profile analysis html - origin.py](http://htmlpreview.github.io/?https://github.com/Laisky/HelloWorld/blob/master/src/cython/origin.html)

