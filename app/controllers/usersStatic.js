const User = require('../models/users');
const CommunityArticles = require('../models/communityActicle');
const Feedback = require('../models/feedback');
const {
    secret
} = require('../config');

class UsersStaticCtl {
    async userStatic(ctx){
        const userSum = await User.find().count();
        const now = new Date();
        var monthLst = getMonthFirstLastDay(now.getFullYear(),now.getMonth()+1);
        const userSumByMonth = await User.aggregate(
            [
                {
                $match://条件筛选关键词，类似mysql中的where
                {
                    createdAt: {
                        $gte: new Date(monthLst[0]),
                        $lte: new Date(monthLst[1])
                     }
                }
            }
        ]
        );
        const articlesSum = await CommunityArticles.find().count();
        const feedbackSumByMonth = await Feedback.aggregate(
            [
                {
                $match://条件筛选关键词，类似mysql中的where
                {
                    createdAt: {
                        $gte: new Date(monthLst[0]),
                        $lte: new Date(monthLst[1])
                     }
                }
            }
        ]
        );
        //每月用户增长量
        const userMonthSumLst = [];
        for(var i = now.getMonth()+1; i > 0; i--){
            var monthLst2 = getMonthFirstLastDay(now.getFullYear(),i);
            const userSum = await User.aggregate(
                [
                    {
                    $match://条件筛选关键词，类似mysql中的where
                    {
                        createdAt: {
                            $gte: new Date(monthLst2[0]),
                            $lte: new Date(monthLst2[1])
                         }
                    }
                }
            ]
            );
            userMonthSumLst.push({
                "month":i,
                "sum":userSum.length
            });
        }
        //每月用户反馈增长量
        const feedbackMonthSumLst = [];
        for(var i = now.getMonth()+1; i > 0; i--){
            var monthLst3 = getMonthFirstLastDay(now.getFullYear(),i);
            const feedbackSum = await Feedback.aggregate(
                [
                    {
                    $match://条件筛选关键词，类似mysql中的where
                    {
                        createdAt: {
                            $gte: new Date(monthLst3[0]),
                            $lte: new Date(monthLst3[1])
                         }
                    }
                }
            ]
            );
            feedbackMonthSumLst.push({
                "month":i,
                "sum":feedbackSum.length
            });
        }
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                "userSum":userSum,
                "userSumByMonth":userSumByMonth.length,
                "articlesSum":articlesSum,
                "feedbackSumByMonth":feedbackSumByMonth.length,
                "monthSumLst":userMonthSumLst,
                "feedbackMonthSumLst":feedbackMonthSumLst
            }
        };
    }
}

//获取指定年份、月份的第一天与最后一天
function getMonthFirstLastDay(year,month){
    var firstDay=new Date(year,month-1,1);//这个月的第一天
    var currentMonth=firstDay.getMonth(); //取得月份数
    var lastDay=new Date(firstDay.getFullYear(),currentMonth+1,0);//是0而不是-1
    firstDay=firstDay.setDate(firstDay.getDate()+1);
    firstDay=new Date(firstDay);
    lastDay=lastDay.setDate(lastDay.getDate()+1);
    lastDay=new Date(lastDay);

    return [firstDay,lastDay];
}

module.exports = new UsersStaticCtl();