//
// KelpJSONView 1.0.1
//
// Kelp(コンブ) http://kelp.phate.org/
// MIT License
//
// var json = "{\"aa\": null,\"firstName\": \"John\",\"lastName\": \"<b>Smith</b>\"}";
//
// $.JSONView(json, $('#jsonOutputDiv'));
//
// 1.0.1
//      fix bug: replace "<" and ">" to "&lt;" and "&lt;" in json.
//

$.extend(jQuery,
{
    JSONView: function (state, container, keep) {

        var json = state.body;

        var ob;

        if (json === "") {
            return;
        } else
        if (typeof json == 'string')
            ob = JSON.parse(json);
        else
            ob = json;
        var p, l = [], c = container;

        var repeat = function (s, n) {  //產生 s 字元 n 次
            return new Array(n + 1).join(s);
        };

        var r = function (o, isar, s) {
            for (var n in o) {
                var p = o[n];
                switch (typeof p) {
                    case 'function':
                        break;
                    case 'string':
                        p = p.replace(/</g, '&lt;');
                        p = p.replace(/>/g, '&gt;');
                        if (isar)
                            l.push({ Text: '<span class="jsonstring">"' + p + '"</span><span class="jsontag">,</span>', Step: s });
                        else
                            l.push({ Text: '<span class="jsonname">"' + n + '"</span><span class="jsontag">: </span><span class="jsonstring">"' + p + '"</span><span class="jsontag">,</span>', Step: s });
                        break;
                    case 'boolean':
                        if (isar)
                            l.push({ Text: '<span class="jsonboolean">"' + p + '"</span><span class="jsontag">,</span>', Step: s });
                        else
                            l.push({ Text: '<span class="jsonname">"' + n + '"</span><span class="jsontag">: </span><span class="jsonboolean">' + p + '</span><span class="jsontag">,</span>', Step: s });
                        break;
                    case 'number':
                        if (isar)
                            l.push({ Text: '<span class="jsonnumber">' + p + '</span><span class="jsontag">,</span>', Step: s });
                        else
                            l.push({ Text: '<span class="jsonname">"' + n + '"</span><span class="jsontag">: </span><span class="jsonnumber">' + p + '</span><span class="jsontag">,</span>', Step: s });
                        break;
                    case 'object':
                        if (p === null) {
                            if (isar)
                                l.push({ Text: '<span class="jsonnull">' + p + '</span><span class="jsontag">,</span>', Step: s });
                            else
                                l.push({ Text: '<span class="jsonname">"' + n + '"</span><span class="jsontag">: </span><span class="jsonnull">' + p + '</span><span class="jsontag">,</span>', Step: s });
                        }
                        else if (p.length == undefined) {
                            //object
                            if (!isar) {
                                l.push({ Text: '<span class="jsonname">"' + n + '"</span><span class="jsontag">:</span>', Step: s });
                            }
                            l.push({ Text: '<span class="jsontag">{</span>', Step: s });
                            r(p, false, s + 1);
                            l.push({ Text: '<span class="jsontag">},</span>', Step: s });
                        }
                        else {
                            //array
                            if (!isar) {
                                l.push({ Text: '<span class="jsonname">"' + n + '"</span><span class="jsontag">:</span>', Step: s });
                            }
                            l.push({ Text: '<span class="jsontag">[</span>', Step: s });
                            r(p, true, s + 1);
                            l.push({ Text: '<span class="jsontag">],</span>', Step: s });
                        }
                        break;
                    default: break;
                }
            }
            var last = l.pop();
            var ct = ',</span>';
            if (last.Text.substr(last.Text.length - ct.length) == ct)
                l.push({ Text: last.Text.replace(ct, '</span>'), Step: last.Step });
            else
                l.push(last);
        };

        //將 JavaScript Object 格式化塞進 array 中
        if (ob.length == undefined) {
            //object
            l.push({ Text: '<span class="jsontag">{</span>', Step: 0 });
            r(ob, false, 1);
            l.push({ Text: '<span class="jsontag">}</span>', Step: 0 });
        }
        else {
            //array
            l.push({ Text: '<span class="jsontag">[</span>', Step: 0 });
            r(ob, true, 1);
            l.push({ Text: '<span class="jsontag">]</span>', Step: 0 });
        }


        var containerDiv = jQuery('#' + container);
        if (!keep) {
            containerDiv.html("");
        }
        $('<h3 class="underlined">' + state.title + '</h3>').appendTo(containerDiv);

        var result = $('<div id="result"/>').appendTo(containerDiv);



        var f = true;
        result.addClass('KelpJSONView');
        result.append('<ol></ol>');
        result = result.find('ol');
        for (var index in l) {
            var jobject = l[index];
            if (f) {
                result.append($('<li class="jsonhighlight">' + repeat(' &nbsp; &nbsp;', jobject.Step) + jobject.Text + '</li>'));
                f = false;
            }
            else {
                result.append($('<li>' + repeat(' &nbsp; &nbsp;', jobject.Step) + jobject.Text + '</li>'));
                f=true;
            }
        }

       return result;
    }
});