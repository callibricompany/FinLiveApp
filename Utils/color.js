import GRADIENT_COLOR from './gradients.json';


Color = function(hexOrObject) {
    var obj;
    if (hexOrObject instanceof Object) {
        obj = hexOrObject;
    } else {
        obj = LinearColorInterpolator.convertHexToRgb(hexOrObject);
    }
    this.r = obj.r;
    this.g = obj.g;
    this.b = obj.b;
}
Color.prototype.asRgbCss = function() {
    return "rgb("+this.r+", "+this.g+", "+this.b+")";
}

var LinearColorInterpolator = {
    // convert 6-digit hex to rgb components;
    // accepts with or without hash ("335577" or "#335577")
    convertHexToRgb: function(hex) {
        match = hex.replace(/#/,'').match(/.{1,2}/g);
        return new Color({
            r: parseInt(match[0], 16),
            g: parseInt(match[1], 16),
            b: parseInt(match[2], 16)
        });
    },
    // left and right are colors that you're aiming to find
    // a color between. Percentage (0-100) indicates the ratio
    // of right to left. Higher percentage means more right,
    // lower means more left.
    findColorBetween: function(left, right, percentage) {
        newColor = {};
        components = ["r", "g", "b"];
        for (var i = 0; i < components.length; i++) {
            c = components[i];
            newColor[c] = Math.round(left[c] + (right[c] - left[c]) * percentage / 100);
        }
        return new Color(newColor);
    }
}

export function interpolateColor(color1, color2, percent) {
    //console.log("PERCENT : "+ percent);
    var l = new Color(color1);
    var r = new Color(color2);
    return LinearColorInterpolator.findColorBetween(l, r, percent).asRgbCss();

}

export function interpolateColorFromGradient(gradient, percent) {
    let c  = GRADIENT_COLOR.filter(({name}) => name === gradient);
    if (c == null || c.length !==1) {
        return 'red';
    }
    //console.log(c[0].colors);
    var l = new Color(c[0].colors[0]);
    var r = new Color(c[0].colors[1]);
    return LinearColorInterpolator.findColorBetween(l, r, percent).asRgbCss();

}
   
