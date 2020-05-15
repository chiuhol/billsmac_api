const ChatContent = require('../models/chatContent');
const Corpus = require('../models/corpus');
const {
    secret
} = require('../config');

class ChatContentCtl {
    async find(ctx) {
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const chatContent = await ChatContent
            .find({
                status: true,
                chatroomId: ctx.params.chatroomId,
                'rightcontent.typeStr': q
            })
            .limit(perPage).skip(page * perPage).sort({
                updatedAt: -1
            });
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                chatContent
            }
        };
    }
    async create(ctx) {
        ctx.verifyParams({
            rightcontent: {
                type: 'object',
                required: true
            }
        });
        const user = ctx.state.user._id;
        const {
            chatroomId
        } = ctx.params;
        const typeStr = ctx.request.body.rightcontent.typeStr;
        let corpus = await Corpus.find({
            status: true,
            userId: ctx.state.user._id,
            content: typeStr
        });
        let leftContent;
        if(corpus.length == 0){
            corpus = await Corpus.find({
                status: true,
                content: typeStr
            });
        } 
        //如果语料包中都不存在，则为默认
        if(corpus.length == 0){
            leftContent = "好好学习，天天向上！";
        }else{
            leftContent = corpus[Math.floor(Math.random()*corpus.length)].response;//从语料包中随机抽出一个
        }
        const chatContent = await new ChatContent({
            rightcontent:ctx.request.body.rightcontent,
            leftcontent:leftContent,
            user,
            chatroomId
        }).save();
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                chatContent
            }
        };
    }
    async update(ctx) {
        ctx.verifyParams({
            rightcontent: {
                type: 'object',
                required: false
            }
        });
        const chatContent = await ChatContent.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                chatContent
            }
        };
    }
    async static(ctx){
        var expendTotle = 0;
        var incomeTotle = 0;
        //查总量
        const chatContent = await ChatContent.find(
            {
                status: true,
                chatroomId: ctx.params.chatroomId,
            }
        );
        for(var i = 0; i < chatContent.length; i++){
            if(chatContent[i].rightcontent.amountType == "expend"){
                expendTotle += (+chatContent[i].rightcontent.amount);
            }else if(chatContent[i].rightcontent.amountType == "income"){
                incomeTotle += (+chatContent[i].rightcontent.amount);
            }
        }
        //按月查
        var today = new Date();
        var todayMonth = today.getMonth()+1;
        var totleByMonthLst = [];
        if(ctx.query.q != today.getFullYear()){
            todayMonth = 12;
        }
        for(var i = todayMonth; i > 0; i--){
            var monthLst = getMonthFirstLastDay(ctx.query.q,i);
            var expendTotleByMonth = 0;
            var incomeTotleByMonth = 0; 
            const chatContentByMonth = await ChatContent.find({
                status: true,
                chatroomId: ctx.params.chatroomId,
                'createdAt': {
                    $gte: new Date(monthLst[0]),
                    $lte: new Date(monthLst[1])
                 }
            });
            for(var j = 0; j < chatContentByMonth.length; j++){
                if(chatContentByMonth[j].rightcontent.amountType == "expend"){
                    expendTotleByMonth += (+chatContentByMonth[j].rightcontent.amount);
                }else if(chatContentByMonth[j].rightcontent.amountType == "income"){
                    incomeTotleByMonth += (+chatContentByMonth[j].rightcontent.amount);
                }
            }
            totleByMonthLst.push({
                "month":i+"月",
                "expendTotleByMonth":expendTotleByMonth,
                "incomeTotleByMonth":incomeTotleByMonth
            });
            }
            ctx.body = ctx.body = {
                status: 200,
                msg: 'success',
                data: {
                    "expendTotle":expendTotle,
                    "incomeTotle":incomeTotle,
                    "totleByMonthLst":totleByMonthLst
                }
            };
    }
    async staticByType(ctx){
        var incomeTotleLst = [];
        var expendTotleLst = [];
        var incomeTotle = 0;
        var expendTotle = 0;
        var monthLst = getMonthFirstLastDay(ctx.query.year,ctx.query.month);
            const chatContent = await ChatContent.aggregate(
                [
                    {
                        $match://条件筛选关键词，类似mysql中的where
                        {
                            status: true,
                            chatroomId: ctx.params.chatroomId,
                            createdAt: {
                                $gte: new Date(monthLst[0]),
                                $lte: new Date(monthLst[1])
                             }
                        }
                    },
                    {
                        $group:
                        {
                            _id: {unit_name:"$rightcontent.typeStr"},//{}内的是分组条件
                            // count: { $sum: 1 }//类似于.count 但这是是管道函数　　所以还需要加上$sum关键词
                            arr: { $push: "$rightcontent"}
                        },
                    },                    
                    {
                        $sort://排序关键词
                        {
                            createdAt:-1//排序规则
                        }
                    }
                ]
            );
            for(var i = 0; i < chatContent.length; i++){
                if(chatContent[i]["_id"]["unit_name"] != null){
                    var income = 0;
                    var expend = 0;
                    for(var j = 0; j < chatContent[i]["arr"].length; j++){
                        if(chatContent[i]["arr"][j]["amountType"] == "expend"){
                            expend += (+chatContent[i]["arr"][j]["amount"]);
                            expendTotle += (+chatContent[i]["arr"][j]["amount"]); 
                        }else{
                            income += (+chatContent[i]["arr"][j]["amount"]);
                            incomeTotle += (+chatContent[i]["arr"][j]["amount"]);
                        }
                    }
                    expendTotleLst.push({
                        "typeStr":chatContent[i]["_id"]["unit_name"],
                        "expendTotle":expend
                    });
                    incomeTotleLst.push({
                        "typeStr":chatContent[i]["_id"]["unit_name"],
                        "incomeTotle":income
                    });  
                }
            }
    ctx.body = {
        status: 200,
        msg: 'success',
        data: {
            "expendTotleLst":expendTotleLst,
            "incomeTotleLst":incomeTotleLst,
            "expendTotle":expendTotle,
            "incomeTotle":incomeTotle
        }
    }; 
    }
    //根据用户输入的查询时间查询某个时间段的流水信息
    async staticByTime(ctx){
        const chatContent = await ChatContent.find({
            status:true,
            createdAt:{
                "$gte": new Date(ctx.query.beginTime),
                 "$lte":new Date(ctx.query.endTime)
            }
        });
        var res = [];
        for(var i = 0; i < chatContent.length; i++){
            res.push({
                "_id":chatContent[i]._id,
                "typeStr":chatContent[i].rightcontent.typeStr,
                "amountType":chatContent[i].rightcontent.amountType,
                "amount":chatContent[i].rightcontent.amount,
                "remark":chatContent[i].rightcontent.remark,
            });
        }
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                res
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

module.exports = new ChatContentCtl();