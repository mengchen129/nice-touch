;(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.niceTouch = factory();
    }

}(this, function() {
    'use strict';

    var niceTouch = {};

    var handlers = [];

    var defaults = {
        SPEED_SLOW: 5,
        SPEED_MEDIUM: 10,
        SPEED_FAST: 15,

        PRECISION_LOW: 3,
        PRECISION_MEDIUM: 5,
        PRECISION_HIGH: 8,

        TOTAL_CHECK: 20
    };

    /**
     * 滑动速度
     * - 滑动速度的如果低于某个值将会影响对最终结果的判断
     * @type {number}
     */
    var swipeSpeed = defaults.SPEED_MEDIUM;

    /**
     * 滑动方向精确度
     * - 在同一方向上持续打点若干次才可得到最终结果
     * @type {number}
     */
    var swipePrecision = defaults.PRECISION_MEDIUM;

    /**
     * 配置
     * @param params.speed 滑动速度
     * @param params.precision 滑动方向准确度
     * @returns {{}}
     */
    niceTouch.config = function(params) {
        params = params || {};
        if (['slow', 'medium', 'fast'].indexOf(params.speed) != -1) {
            swipeSpeed = defaults['SPEED_' + params.speed.toUpperCase()];
        }
        if (['low', 'medium', 'high'].indexOf(params.precision) != -1) {
            swipePrecision = defaults['PRECISION_' + params.precision.toUpperCase()];
        }

        return niceTouch;
    };

    /**
     * 打印配置参数等调试信息
     */
    niceTouch.debug = function() {
        console.log('niceTouch params: ' + JSON.stringify({swipeSpeed: swipeSpeed, swipePrecision: swipePrecision}));
    };

    /**
     * 添加响应函数
     * 当判断出滑动方向后回调这些函数
     * @param handler
     */
    niceTouch.addHandler = function(handler) {
        if (typeof handler === 'function') {
            handlers.push(handler);
        }

        return niceTouch;
    };

    var doc = document;

    var dataArr = [];

    doc.addEventListener('touchstart', function(e) {
        // nothing
    }, false);

    doc.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var touch = e.touches[0];
        dataArr.push({
            x: touch.pageX,
            y: touch.pageY
        });
    }, false);

    doc.addEventListener('touchend', function(e) {
        var direction = checkDirection();
        dataArr = [];

        if (!direction) return;

        for (var i = 0; i < handlers.length; i++) {
            handlers[i](direction);
        }

    }, false);

    var getSwipeDirection = (function() {

        var dtObj = {dt: '', count: 0};

        return {
            addDt: function(dt) {
                if (dt == dtObj.dt) {
                    dtObj.count = dtObj.count + 1;
                } else {
                    dtObj = {dt: dt, count: 1};
                }

                if (dtObj.count >= swipePrecision) {
                    var realDt = dtObj.dt;
                    dtObj = {dt: '', count: 0};
                    return realDt;
                }

                return 0;
            }
        };

    })();

    function checkDirection() {
        var result;
        var totalCheck = 0;

        for (var i = dataArr.length - 1; i > 0; i--) {
            var dataNew = dataArr[i];
            var dataOld = dataArr[i - 1];
            var yDiff = dataNew.y - dataOld.y;
            var xDiff = dataNew.x - dataOld.x;

            if (Math.abs(yDiff) > Math.abs(xDiff)) {            // 向上或向下
                if (Math.abs(yDiff) < swipeSpeed) {
                    if (++totalCheck > defaults.TOTAL_CHECK) {
                        return;
                    }
                    continue;
                }
                if (yDiff < 0) {        // 向上
                    result = getSwipeDirection.addDt('up');
                    if (result) {
                        return result;
                    }
                } else {                // 向下
                    result = getSwipeDirection.addDt('down');
                    if (result) {
                        return result;
                    }
                }
            } else {                                            // 向左或向右
                if (Math.abs(xDiff) < swipeSpeed) {
                    if (++totalCheck > defaults.TOTAL_CHECK) {
                        return;
                    }
                    continue;
                }
                if (xDiff < 0) {        // 向左
                    result = getSwipeDirection.addDt('left');
                    if (result) {
                        return result;
                    }
                } else {                // 向右
                    result = getSwipeDirection.addDt('right');
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }

    return niceTouch;
}));