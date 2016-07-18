# nice-touch
一个用于移动Web滑动方向判断的小工具

## 说明
参考过Zepto的滑动判断 (swipeLeft, swipeRight, swipeUp, swipeDown等事件), 它的判断方式仅仅根据触摸起点和终点的位置差来判断方向, 算是一种比较简单和普遍的方法。

但是大家回想一下玩手机时使用到的滑动判断, 仅仅依靠两点的位置判断是不够的, 需要考虑滑动的速度, 中途滑动方向的改变, 滑动临近结束的方向等等。

所以突发奇想, 想通过javascript编写个小组件, 实现更完善的滑动判断, 目前该组件使用的逻辑如下:
 
* 判断方式: 从滑动结束的位置依次向前推算, 而不仅仅根据起点和终点
* 可配置滑动速度, 如果在这段距离内滑动的速度达不到, 则不认为这次滑动有效
* 可配置灵敏度, 要求速度和方向保持持续若干次后, 才认为滑动有效

具体逻辑可参考源码

欢迎大家提建议, 我的QQ: 932215832