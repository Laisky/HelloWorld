[KNN IPython View](http://htmlpreview.github.io/?https://github.com/Laisky/JUST_FOR_FUN/blob/master/src/KNN/KNN.html)

[Note](https://app.yinxiang.com/shard/s17/sh/e9ecb6cc-b510-4290-ad79-261bc0b10708/de26d3170725d73701d875c1cfb65742)

用 KNN 的 Kth nearest distance 寻找 DBSCAN 的最优 MinPts，并进一步计算 EPS

> Idea is that for points in a cluster, their kth nearest neighbors 
are at roughly the same distance

> Noise points have the kth nearest neighbor at farther distance

> So, plot sorted distance of every point to its kth nearest neighbor
