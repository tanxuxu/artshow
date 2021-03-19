export default {
    //压缩图片
    dealImage(path, width = 640, callback) {
        var img = new Image();
        img.src = path;

        img.onload = function() {
            let that = this;
            // 默认按比例压缩
            let w = that.width;
            let h = that.height;
            scale = w / h;
            w = width;
            h = (w / scale);
            var quality = 0.7; // 默认图片质量为0.7
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality);
            callback && callback(base64);
        }
    }
}
