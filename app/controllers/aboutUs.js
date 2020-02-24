const AboutUs = require('../models/aboutUs');
const {
    secret
} = require('../config');

class AboutUsCtl {
    async find(ctx) {
        ctx.body = await AboutUs
            .find();
    }
    async update(ctx) {
        ctx.verifyParams({
            qqGroup: {
                type: 'string',
                required: false
            },
            officialAccount: {
                type: 'string',
                required: false
            },
            emailAddress: {
                type: 'string',
                required: false
            },
            phoneNum: {
                type: 'string',
                required: false
            }
        });
        const aboutUs = await AboutUs.findByIdAndUpdate("5e534ba591b1b20498896380", ctx.request.body);
        ctx.body = aboutUs;
    }
}

module.exports = new AboutUsCtl();