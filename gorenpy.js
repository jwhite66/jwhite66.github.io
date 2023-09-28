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
        var papa = Papa.parse(e[1]);
        var parms = []
        for (const p of papa.data[0])
            parms.push(desquare(p))
        if (parms.length < 3)
        {
            ret += "?3 " + l + " ?3\n";
            continue;
        }

        if (parms.length > 3 && parms[3] != "null")
            ret += "    " + "scene " + parms[3] + "\n";

        if (parms.length > 4 && parms[4] != "null")
            ret += "    " + "show " + parms[4] + "\n";

        if (parms[0] == "tell" && parms[2] == "emote")
        {
            ret += '    "' + parms[1] + '"\n';
        }
        else
        {
            if (parms[0] != "null" && parms[1] != "null")
                if (parms[2] != "null")
                    ret += "    " + parms[0] + " " + parms[2] + ' "' + parms[1] + '"' + "\n";
                else
                    ret += "    " + parms[0] + ' "' + parms[1] + '"' + "\n";
        }

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

