"use strict";
var godot = document.getElementById('godot');
var renpy = document.getElementById('renpy');

function desquare(text)
{
    var i = /\[i\]/ig;
    var ret = text.replaceAll(i, '{i}');
    var uni = /\[\/i\]/ig;
    ret = ret.replaceAll(uni, '{/i}');
    var b = /\[b\]/ig;
    ret = ret.replaceAll(b, '{b}');
    var unb = /\[\/b\]/ig;
    return ret.replaceAll(unb, '{/b}');
}

function translate(text)
{
    var ret = ""
    var lines = text.split(/[\r\n]+/g);
    for (const l of lines)
    {
        if (l.length == 0)
            continue;

        var re = /textarray.append\(\[(.*)\]\)/
        var e = re.exec(l)
        if (!e || e.length < 2)
        {
            ret += "? " + l + " ?\n";
            continue;
        }
        var tokens = e[1].split('","');
        const parms = [];
        for (const t of tokens)
        {
            var noquote = t.replace(/^["']/, "");
            noquote = noquote.replace(/["'](,null)*$/, "");
            parms.push(desquare(noquote));
        }
        if (parms.length < 3)
        {
            ret += "?4 " + l + " ?4\n";
            continue;
        }
        if (parms[0] == "tell" && parms[2] == "emote")
        {
            ret += "    " + parms[1] + "\n";
            continue;
        }

        if (parms.length > 3)
            ret += "    " + "scene " + parms[3] + "\n";
        ret += "    " + "show " + parms[0] + "_" + parms[2] + "\n";
        if (parms.length > 4)
            ret += "    " + "show " + parms[4] + "\n";
        ret += "    " + parms[0] + ' "' + parms[1] + '"' + "\n";

        ret += "\n";
    }

    return ret;
}

godot.addEventListener(
    'keyup', (event) => {
      if (event.keyCode !== 13) return
      renpy.value = translate(godot.value);
    });

godot.addEventListener(
    'focusout', (event) => {
      renpy.value = translate(godot.value);
    });

