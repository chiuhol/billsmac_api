const path = require('path');

class HomeCtl {
    index(ctx) {
        ctx.body = '这是主页';
    }
    upload(ctx){
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);
        ctx.body = {
            status:200,
            msg:'success',
            // data:{url:ctx.origin+'/uploads/'+basename}
            data:{url:"116.62.141.151"+'/uploads/'+basename}
        };
    }
}

module.exports = new HomeCtl();