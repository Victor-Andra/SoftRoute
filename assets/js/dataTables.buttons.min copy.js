/*! Buttons for DataTables 1.1.2
 * ©2015 SpryMedia Ltd - datatables.net/license
 */
!(function (a) {
    "function" == typeof define && define.amd
        ? define(["jquery", "datatables.net"], function (b) {
              return a(b, window, document);
          })
        : "object" == typeof exports
        ? (module.exports = function (b, c) {
              return b || (b = window), (c && c.fn.dataTable) || (c = require("datatables.net")(b, c).$), a(c, b, b.document);
          })
        : a(jQuery, window, document);
})(function (a, b, c, d) {
    "use strict";
    var e = a.fn.dataTable,
        f = 0,
        g = 0,
        h = e.ext.buttons,
        i = function (b, c) {
            c === !0 && (c = {}),
                a.isArray(c) && (c = { buttons: c }),
                (this.c = a.extend(!0, {}, i.defaults, c)),
                c.buttons && (this.c.buttons = c.buttons),
                (this.s = { dt: new e.Api(b), buttons: [], subButtons: [], listenKeys: "", namespace: "dtb" + f++ }),
                (this.dom = { container: a("<" + this.c.dom.container.tag + "/>").addClass(this.c.dom.container.className) }),
                this._constructor();
        };
    a.extend(i.prototype, {
        action: function (a, b) {
            var c = this._indexToButton(a).conf;
            this.s.dt;
            return b === d ? c.action : ((c.action = b), this);
        },
        active: function (a, b) {
            var c = this._indexToButton(a),
                e = this.c.dom.button.active;
            return b === d ? c.node.hasClass(e) : (c.node.toggleClass(e, b === d ? !0 : b), this);
        },
        add: function (a, b) {
            if ("string" == typeof a && -1 !== a.indexOf("-")) {
                var c = a.split("-");
                this.c.buttons[1 * c[0]].buttons.splice(1 * c[1], 0, b);
            } else this.c.buttons.splice(1 * a, 0, b);
            return this.dom.container.empty(), this._buildButtons(this.c.buttons), this;
        },
        container: function () {
            return this.dom.container;
        },
        disable: function (a) {
            var b = this._indexToButton(a);
            return b.node.addClass(this.c.dom.button.disabled), this;
        },
        destroy: function () {
            a("body").off("keyup." + this.s.namespace);
            var b,
                c,
                d,
                e,
                f = this.s.buttons,
                g = this.s.subButtons;
            for (b = 0, c = f.length; c > b; b++) for (this.removePrep(b), d = 0, e = g[b].length; e > d; d++) this.removePrep(b + "-" + d);
            this.removeCommit(), this.dom.container.remove();
            var h = this.s.dt.settings()[0];
            for (b = 0, c = h.length; c > b; b++)
                if (h.inst === this) {
                    h.splice(b, 1);
                    break;
                }
            return this;
        },
        enable: function (a, b) {
            if (b === !1) return this.disable(a);
            var c = this._indexToButton(a);
            return c.node.removeClass(this.c.dom.button.disabled), this;
        },
        name: function () {
            return this.c.name;
        },
        node: function (a) {
            var b = this._indexToButton(a);
            return b.node;
        },
        removeCommit: function () {
            var a,
                b,
                c,
                d = this.s.buttons,
                e = this.s.subButtons;
            for (a = d.length - 1; a >= 0; a--) null === d[a] && (d.splice(a, 1), e.splice(a, 1), this.c.buttons.splice(a, 1));
            for (a = 0, b = e.length; b > a; a++) for (c = e[a].length - 1; c >= 0; c--) null === e[a][c] && (e[a].splice(c, 1), this.c.buttons[a].buttons.splice(c, 1));
            return this;
        },
        removePrep: function (a) {
            var b,
                c = this.s.dt;
            if ("number" == typeof a || -1 === a.indexOf("-")) (b = this.s.buttons[1 * a]), b.conf.destroy && b.conf.destroy.call(c.button(a), c, b, b.conf), b.node.remove(), this._removeKey(b.conf), (this.s.buttons[1 * a] = null);
            else {
                var d = a.split("-");
                (b = this.s.subButtons[1 * d[0]][1 * d[1]]), b.conf.destroy && b.conf.destroy.call(c.button(a), c, b, b.conf), b.node.remove(), this._removeKey(b.conf), (this.s.subButtons[1 * d[0]][1 * d[1]] = null);
            }
            return this;
        },
        text: function (a, b) {
            var c = this._indexToButton(a),
                e = this.c.dom.collection.buttonLiner,
                f = "string" == typeof a && -1 !== a.indexOf("-") && e && e.tag ? e.tag : this.c.dom.buttonLiner.tag,
                g = this.s.dt,
                h = function (a) {
                    return "function" == typeof a ? a(g, c.node, c.conf) : a;
                };
            return b === d ? h(c.conf.text) : ((c.conf.text = b), f ? c.node.children(f).html(h(b)) : c.node.html(h(b)), this);
        },
        toIndex: function (a) {
            var b,
                c,
                d,
                e,
                f = this.s.buttons,
                g = this.s.subButtons;
            for (b = 0, c = f.length; c > b; b++) if (f[b].node[0] === a) return b + "";
            for (b = 0, c = g.length; c > b; b++) for (d = 0, e = g[b].length; e > d; d++) if (g[b][d].node[0] === a) return b + "-" + d;
        },
        _constructor: function () {
            var b = this,
                d = this.s.dt,
                e = d.settings()[0];
            e._buttons || (e._buttons = []),
                e._buttons.push({ inst: this, name: this.c.name }),
                this._buildButtons(this.c.buttons),
                d.on("destroy", function () {
                    b.destroy();
                }),
                a("body").on("keyup." + this.s.namespace, function (a) {
                    if (!c.activeElement || c.activeElement === c.body) {
                        var d = String.fromCharCode(a.keyCode).toLowerCase();
                        -1 !== b.s.listenKeys.toLowerCase().indexOf(d) && b._keypress(d, a);
                    }
                });
        },
        _addKey: function (b) {
            b.key && (this.s.listenKeys += a.isPlainObject(b.key) ? b.key.key : b.key);
        },
        _buildButtons: function (b, c, e) {
            var f = this.s.dt,
                g = 0;
            c || ((c = this.dom.container), (this.s.buttons = []), (this.s.subButtons = []));
            for (var h = 0, i = b.length; i > h; h++) {
                var j = this._resolveExtends(b[h]);
                if (j)
                    if (a.isArray(j)) this._buildButtons(j, c, e);
                    else {
                        var k = this._buildButton(j, e !== d);
                        if (k) {
                            var l = k.node;
                            if (
                                (c.append(k.inserter),
                                e === d ? (this.s.buttons.push({ node: l, conf: j, inserter: k.inserter }), this.s.subButtons.push([])) : this.s.subButtons[e].push({ node: l, conf: j, inserter: k.inserter }),
                                j.buttons)
                            ) {
                                var m = this.c.dom.collection;
                                (j._collection = a("<" + m.tag + "/>").addClass(m.className)), this._buildButtons(j.buttons, j._collection, g);
                            }
                            j.init && j.init.call(f.button(l), f, l, j), g++;
                        }
                    }
            }
        },
        _buildButton: function (b, c) {
            var d = this.c.dom.button,
                e = this.c.dom.buttonLiner,
                f = this.c.dom.collection,
                h = this.s.dt,
                i = function (a) {
                    return "function" == typeof a ? a(h, k, b) : a;
                };
            if ((c && f.button && (d = f.button), c && f.buttonLiner && (e = f.buttonLiner), b.available && !b.available(h, b))) return !1;
            var j = function (b, c, d, e) {
                    e.action.call(c.button(d), b, c, d, e), a(c.table().node()).triggerHandler("buttons-action.dt", [c.button(d), c, d, e]);
                },
                k = a("<" + d.tag + "/>")
                    .addClass(d.className)
                    .attr("tabindex", this.s.dt.settings()[0].iTabIndex)
                    .attr("aria-controls", this.s.dt.table().node().id)
                    .on("click.dtb", function (a) {
                        a.preventDefault(), !k.hasClass(d.disabled) && b.action && j(a, h, k, b), k.blur();
                    })
                    .on("keyup.dtb", function (a) {
                        13 === a.keyCode && !k.hasClass(d.disabled) && b.action && j(a, h, k, b);
                    });
            e.tag
                ? k.append(
                      a("<" + e.tag + "/>")
                          .html(i(b.text))
                          .addClass(e.className)
                  )
                : k.html(i(b.text)),
                b.enabled === !1 && k.addClass(d.disabled),
                b.className && k.addClass(b.className),
                b.titleAttr && k.attr("title", b.titleAttr),
                b.namespace || (b.namespace = ".dt-button-" + g++);
            var l,
                m = this.c.dom.buttonContainer;
            return (
                (l =
                    m && m.tag
                        ? a("<" + m.tag + "/>")
                              .addClass(m.className)
                              .append(k)
                        : k),
                this._addKey(b),
                { node: k, inserter: l }
            );
        },
        _indexToButton: function (a) {
            if ("number" == typeof a || -1 === a.indexOf("-")) return this.s.buttons[1 * a];
            var b = a.split("-");
            return this.s.subButtons[1 * b[0]][1 * b[1]];
        },
        _keypress: function (b, c) {
            var d,
                e,
                f,
                g,
                h = this.s.buttons,
                i = this.s.subButtons,
                j = function (d, e) {
                    if (d.key)
                        if (d.key === b) e.click();
                        else if (a.isPlainObject(d.key)) {
                            if (d.key.key !== b) return;
                            if (d.key.shiftKey && !c.shiftKey) return;
                            if (d.key.altKey && !c.altKey) return;
                            if (d.key.ctrlKey && !c.ctrlKey) return;
                            if (d.key.metaKey && !c.metaKey) return;
                            e.click();
                        }
                };
            for (d = 0, e = h.length; e > d; d++) j(h[d].conf, h[d].node);
            for (d = 0, e = i.length; e > d; d++) for (f = 0, g = i[d].length; g > f; f++) j(i[d][f].conf, i[d][f].node);
        },
        _removeKey: function (b) {
            if (b.key) {
                var c = a.isPlainObject(b.key) ? b.key.key : b.key,
                    d = this.s.listenKeys.split(""),
                    e = a.inArray(c, d);
                d.splice(e, 1), (this.s.listenKeys = d.join(""));
            }
        },
        _resolveExtends: function (b) {
            var c,
                e,
                f = this.s.dt,
                g = function (c) {
                    for (var e = 0; !a.isPlainObject(c) && !a.isArray(c); ) {
                        if (c === d) return;
                        if ("function" == typeof c) {
                            if (((c = c(f, b)), !c)) return !1;
                        } else if ("string" == typeof c) {
                            if (!h[c]) throw "Unknown button type: " + c;
                            c = h[c];
                        }
                        if ((e++, e > 30)) throw "Buttons: Too many iterations";
                    }
                    return a.isArray(c) ? c : a.extend({}, c);
                };
            for (b = g(b); b && b.extend; ) {
                if (!h[b.extend]) throw "Cannot extend unknown button type: " + b.extend;
                var i = g(h[b.extend]);
                if (a.isArray(i)) return i;
                if (!i) return !1;
                var j = i.className;
                (b = a.extend({}, i, b)), j && b.className !== j && (b.className = j + " " + b.className);
                var k = b.postfixButtons;
                if (k) {
                    for (b.buttons || (b.buttons = []), c = 0, e = k.length; e > c; c++) b.buttons.push(k[c]);
                    b.postfixButtons = null;
                }
                var l = b.prefixButtons;
                if (l) {
                    for (b.buttons || (b.buttons = []), c = 0, e = l.length; e > c; c++) b.buttons.splice(c, 0, l[c]);
                    b.prefixButtons = null;
                }
                b.extend = i.extend;
            }
            return b;
        },
    }),
        (i.background = function (b, c, e) {
            e === d && (e = 400),
                b
                    ? a("<div/>").addClass(c).css("display", "none").appendTo("body").fadeIn(e)
                    : a("body > div." + c).fadeOut(e, function () {
                          a(this).remove();
                      });
        }),
        (i.instanceSelector = function (b, c) {
            if (!b)
                return a.map(c, function (a) {
                    return a.inst;
                });
            var d = [],
                e = a.map(c, function (a) {
                    return a.name;
                }),
                f = function (b) {
                    if (a.isArray(b)) for (var g = 0, h = b.length; h > g; g++) f(b[g]);
                    else if ("string" == typeof b)
                        if (-1 !== b.indexOf(",")) f(b.split(","));
                        else {
                            var i = a.inArray(a.trim(b), e);
                            -1 !== i && d.push(c[i].inst);
                        }
                    else "number" == typeof b && d.push(c[b].inst);
                };
            return f(b), d;
        }),
        (i.buttonSelector = function (b, c) {
            for (
                var e = [],
                    f = function (b, c) {
                        var g,
                            h,
                            i = [];
                        a.each(c.s.buttons, function (a, b) {
                            null !== b && i.push({ node: b.node[0], name: b.conf.name });
                        }),
                            a.each(c.s.subButtons, function (b, c) {
                                a.each(c, function (a, b) {
                                    null !== b && i.push({ node: b.node[0], name: b.conf.name });
                                });
                            });
                        var j = a.map(i, function (a) {
                            return a.node;
                        });
                        if (a.isArray(b) || b instanceof a) for (g = 0, h = b.length; h > g; g++) f(b[g], c);
                        else if (null === b || b === d || "*" === b) for (g = 0, h = i.length; h > g; g++) e.push({ inst: c, idx: c.toIndex(i[g].node) });
                        else if ("number" == typeof b) e.push({ inst: c, idx: b });
                        else if ("string" == typeof b)
                            if (-1 !== b.indexOf(",")) {
                                var k = b.split(",");
                                for (g = 0, h = k.length; h > g; g++) f(a.trim(k[g]), c);
                            } else if (b.match(/^\d+(\-\d+)?$/)) e.push({ inst: c, idx: b });
                            else if (-1 !== b.indexOf(":name")) {
                                var l = b.replace(":name", "");
                                for (g = 0, h = i.length; h > g; g++) i[g].name === l && e.push({ inst: c, idx: c.toIndex(i[g].node) });
                            } else
                                a(j)
                                    .filter(b)
                                    .each(function () {
                                        e.push({ inst: c, idx: c.toIndex(this) });
                                    });
                        else if ("object" == typeof b && b.nodeName) {
                            var m = a.inArray(b, j);
                            -1 !== m && e.push({ inst: c, idx: c.toIndex(j[m]) });
                        }
                    },
                    g = 0,
                    h = b.length;
                h > g;
                g++
            ) {
                var i = b[g];
                f(c, i);
            }
            return e;
        }),
        (i.defaults = {
            buttons: ["copy", "excel", "csv", "pdf", "print"],
            name: "main",
            tabIndex: 0,
            dom: {
                container: { tag: "div", className: "dt-buttons" },
                collection: { tag: "div", className: "dt-button-collection" },
                button: { tag: "a", className: "dt-button", active: "active", disabled: "disabled" },
                buttonLiner: { tag: "span", className: "" },
            },
        }),
        (i.version = "1.1.2"),
        a.extend(h, {
            collection: {
                text: function (a, b, c) {
                    return a.i18n("buttons.collection", "Collection");
                },
                className: "buttons-collection",
                action: function (d, e, f, g) {
                    var h = f,
                        j = h.offset(),
                        k = a(e.table().container()),
                        l = !1;
                    a("div.dt-button-background").length && ((l = a("div.dt-button-collection").offset()), a(c).trigger("click.dtb-collection")),
                        g._collection.addClass(g.collectionLayout).css("display", "none").appendTo("body").fadeIn(g.fade);
                    var m = g._collection.css("position");
                    if (l && "absolute" === m) g._collection.css({ top: l.top + 5, left: l.left + 5 });
                    else if ("absolute" === m) {
                        g._collection.css({ top: j.top + h.outerHeight(), left: j.left });
                        var n = j.left + g._collection.outerWidth(),
                            o = k.offset().left + k.width();
                        n > o && g._collection.css("left", j.left - (n - o));
                    } else {
                        var p = g._collection.height() / 2;
                        p > a(b).height() / 2 && (p = a(b).height() / 2), g._collection.css("marginTop", -1 * p);
                    }
                    g.background && i.background(!0, g.backgroundClassName, g.fade),
                        setTimeout(function () {
                            a("div.dt-button-background").on("click.dtb-collection", function () {}),
                                a("body").on("click.dtb-collection", function (b) {
                                    a(b.target).parents().andSelf().filter(g._collection).length ||
                                        (g._collection.fadeOut(g.fade, function () {
                                            g._collection.detach();
                                        }),
                                        a("div.dt-button-background").off("click.dtb-collection"),
                                        i.background(!1, g.backgroundClassName, g.fade),
                                        a("body").off("click.dtb-collection"),
                                        e.off("buttons-action.b-internal"));
                                });
                        }, 10),
                        g.autoClose &&
                            e.on("buttons-action.b-internal", function () {
                                a("div.dt-button-background").click();
                            });
                },
                background: !0,
                collectionLayout: "",
                backgroundClassName: "dt-button-background",
                autoClose: !1,
                fade: 400,
            },
            copy: function (a, b) {
                return h.copyHtml5 ? "copyHtml5" : h.copyFlash && h.copyFlash.available(a, b) ? "copyFlash" : void 0;
            },
            csv: function (a, b) {
                return h.csvHtml5 && h.csvHtml5.available(a, b) ? "csvHtml5" : h.csvFlash && h.csvFlash.available(a, b) ? "csvFlash" : void 0;
            },
            excel: function (a, b) {
                return h.excelHtml5 && h.excelHtml5.available(a, b) ? "excelHtml5" : h.excelFlash && h.excelFlash.available(a, b) ? "excelFlash" : void 0;
            },
            pdf: function (a, b) {
                return h.pdfHtml5 && h.pdfHtml5.available(a, b) ? "pdfHtml5" : h.pdfFlash && h.pdfFlash.available(a, b) ? "pdfFlash" : void 0;
            },
            pageLength: function (b, c) {
                var d = b.settings()[0].aLengthMenu,
                    e = a.isArray(d[0]) ? d[0] : d,
                    f = a.isArray(d[0]) ? d[1] : d,
                    g = function (a) {
                        return a.i18n("buttons.pageLength", { "-1": "Mostrar Todas as Linhas", _: "Mostrar %d Linhas" }, a.page.len());
                    };
                return {
                    extend: "collection",
                    text: g,
                    className: "buttons-page-length",
                    autoClose: !0,
                    buttons: a.map(e, function (a, b) {
                        return {
                            text: f[b],
                            action: function (b, c, d, e) {
                                c.page.len(a).draw();
                            },
                            init: function (b, c, d) {
                                var e = this,
                                    f = function () {
                                        e.active(b.page.len() === a);
                                    };
                                b.on("length.dt" + d.namespace, f), f();
                            },
                            destroy: function (a, b, c) {
                                a.off("length.dt" + c.namespace);
                            },
                        };
                    }),
                    init: function (a, b, c) {
                        var d = this;
                        a.on("length.dt" + c.namespace, function () {
                            d.text(g(a));
                        });
                    },
                    destroy: function (a, b, c) {
                        a.off("length.dt" + c.namespace);
                    },
                };
            },
        }),
        e.Api.register("buttons()", function (a, b) {
            return (
                b === d && ((b = a), (a = d)),
                this.iterator(
                    !0,
                    "table",
                    function (c) {
                        return c._buttons ? i.buttonSelector(i.instanceSelector(a, c._buttons), b) : void 0;
                    },
                    !0
                )
            );
        }),
        e.Api.register("button()", function (a, b) {
            var c = this.buttons(a, b);
            return c.length > 1 && c.splice(1, c.length), c;
        }),
        e.Api.registerPlural("buttons().active()", "button().active()", function (a) {
            return a === d
                ? this.map(function (a) {
                      return a.inst.active(a.idx);
                  })
                : this.each(function (b) {
                      b.inst.active(b.idx, a);
                  });
        }),
        e.Api.registerPlural("buttons().action()", "button().action()", function (a) {
            return a === d
                ? this.map(function (a) {
                      return a.inst.action(a.idx);
                  })
                : this.each(function (b) {
                      b.inst.action(b.idx, a);
                  });
        }),
        e.Api.register(["buttons().enable()", "button().enable()"], function (a) {
            return this.each(function (b) {
                b.inst.enable(b.idx, a);
            });
        }),
        e.Api.register(["buttons().disable()", "button().disable()"], function () {
            return this.each(function (a) {
                a.inst.disable(a.idx);
            });
        }),
        e.Api.registerPlural("buttons().nodes()", "button().node()", function () {
            var b = a();
            return (
                a(
                    this.each(function (a) {
                        b = b.add(a.inst.node(a.idx));
                    })
                ),
                b
            );
        }),
        e.Api.registerPlural("buttons().text()", "button().text()", function (a) {
            return a === d
                ? this.map(function (a) {
                      return a.inst.text(a.idx);
                  })
                : this.each(function (b) {
                      b.inst.text(b.idx, a);
                  });
        }),
        e.Api.registerPlural("buttons().trigger()", "button().trigger()", function () {
            return this.each(function (a) {
                a.inst.node(a.idx).trigger("click");
            });
        }),
        e.Api.registerPlural("buttons().containers()", "buttons().container()", function () {
            var b = a();
            return (
                a(
                    this.each(function (a) {
                        b = b.add(a.inst.container());
                    })
                ),
                b
            );
        }),
        e.Api.register("button().add()", function (a, b) {
            return 1 === this.length && this[0].inst.add(a, b), this.button(a);
        }),
        e.Api.register("buttons().destroy()", function (a) {
            return (
                this.pluck("inst")
                    .unique()
                    .each(function (a) {
                        a.destroy();
                    }),
                this
            );
        }),
        e.Api.registerPlural("buttons().remove()", "buttons().remove()", function () {
            return (
                this.each(function (a) {
                    a.inst.removePrep(a.idx);
                }),
                this.pluck("inst")
                    .unique()
                    .each(function (a) {
                        a.removeCommit();
                    }),
                this
            );
        });
    var j;
    e.Api.register("buttons.info()", function (b, c, e) {
        var f = this;
        return b === !1
            ? (a("#datatables_buttons_info").fadeOut(function () {
                  a(this).remove();
              }),
              clearTimeout(j),
              (j = null),
              this)
            : (j && clearTimeout(j),
              a("#datatables_buttons_info").length && a("#datatables_buttons_info").remove(),
              (b = b ? "<h2>" + b + "</h2>" : ""),
              a('<div id="datatables_buttons_info" class="dt-button-info"/>')
                  .html(b)
                  .append(a("<div/>")["string" == typeof c ? "html" : "append"](c))
                  .css("display", "none")
                  .appendTo("body")
                  .fadeIn(),
              e !== d &&
                  0 !== e &&
                  (j = setTimeout(function () {
                      f.buttons.info(!1);
                  }, e)),
              this);
    }),
        e.Api.register("buttons.exportData()", function (a) {
            return this.context.length ? l(new e.Api(this.context[0]), a) : void 0;
        });
    var k = a("<textarea/>")[0],
        l = function (b, c) {
            for (
                var d = a.extend(
                        !0,
                        {},
                        {
                            rows: null,
                            columns: "",
                            modifier: { search: "applied", order: "applied" },
                            orthogonal: "display",
                            stripHtml: !0,
                            stripNewlines: !0,
                            decodeEntities: !0,
                            trim: !0,
                            format: {
                                header: function (a) {
                                    return e(a);
                                },
                                footer: function (a) {
                                    return e(a);
                                },
                                body: function (a) {
                                    return e(a);
                                },
                            },
                        },
                        c
                    ),
                    e = function (a) {
                        return "string" != typeof a
                            ? a
                            : (d.stripHtml && (a = a.replace(/<.*?>/g, "")), d.trim && (a = a.replace(/^\s+|\s+$/g, "")), d.stripNewlines && (a = a.replace(/\n/g, " ")), d.decodeEntities && ((k.innerHTML = a), (a = k.value)), a);
                    },
                    f = b
                        .columns(d.columns)
                        .indexes()
                        .map(function (a, c) {
                            return d.format.header(b.column(a).header().innerHTML, a);
                        })
                        .toArray(),
                    g = b.table().footer()
                        ? b
                              .columns(d.columns)
                              .indexes()
                              .map(function (a, c) {
                                  var e = b.column(a).footer();
                                  return d.format.footer(e ? e.innerHTML : "", a);
                              })
                              .toArray()
                        : null,
                    h = b.rows(d.rows, d.modifier).indexes().toArray(),
                    i = b.cells(h, d.columns).render(d.orthogonal).toArray(),
                    j = f.length,
                    l = j > 0 ? i.length / j : 0,
                    m = new Array(l),
                    n = 0,
                    o = 0,
                    p = l;
                p > o;
                o++
            ) {
                for (var q = new Array(j), r = 0; j > r; r++) (q[r] = d.format.body(i[n], r, o)), n++;
                m[o] = q;
            }
            return { header: f, footer: g, body: m };
        };
    return (
        (a.fn.dataTable.Buttons = i),
        (a.fn.DataTable.Buttons = i),
        a(c).on("init.dt plugin-init.dt", function (a, b, c) {
            if ("dt" === a.namespace) {
                var d = b.oInit.buttons || e.defaults.buttons;
                d && !b._buttons && new i(b, d).container();
            }
        }),
        e.ext.feature.push({
            fnInit: function (a) {
                var b = new e.Api(a),
                    c = b.init().buttons || e.defaults.buttons;
                return new i(b, c).container();
            },
            cFeature: "B",
        }),
        i
    );
});