/*! Select for DataTables 1.1.2
 * 2015-2016 SpryMedia Ltd - datatables.net/license/mit
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
    function e(a, b, c) {
        var d,
            e,
            f,
            g = function (b, c) {
                if (b > c) {
                    var d = c;
                    (c = b), (b = d);
                }
                var e = !1;
                return a
                    .columns(":visible")
                    .indexes()
                    .filter(function (a) {
                        return a === b && (e = !0), a === c ? ((e = !1), !0) : e;
                    });
            },
            h = function (b, c) {
                var d = a.rows({ search: "applied" }).indexes();
                if (d.indexOf(b) > d.indexOf(c)) {
                    var e = c;
                    (c = b), (b = e);
                }
                var f = !1;
                return d.filter(function (a) {
                    return a === b && (f = !0), a === c ? ((f = !1), !0) : f;
                });
            };
        a.cells({ selected: !0 }).any() || c ? ((e = g(c.column, b.column)), (f = h(c.row, b.row))) : ((e = g(0, b.column)), (f = h(0, b.row))),
            (d = a.cells(f, e).flatten()),
            a.cells(b, { selected: !0 }).any() ? a.cells(d).deselect() : a.cells(d).select();
    }
    function f(b) {
        var c = b.settings()[0],
            d = c._select.selector;
        a(b.table().body()).off("mousedown.dtSelect", d).off("mouseup.dtSelect", d).off("click.dtSelect", d), a("body").off("click.dtSelect");
    }
    function g(c) {
        var d = a(c.table().body()),
            e = c.settings()[0],
            f = e._select.selector;
        d
            .on("mousedown.dtSelect", f, function (a) {
                a.shiftKey &&
                    d.css("-moz-user-select", "none").one("selectstart.dtSelect", f, function () {
                        return !1;
                    });
            })
            .on("mouseup.dtSelect", f, function (a) {
                d.css("-moz-user-select", "");
            })
            .on("click.dtSelect", f, function (d) {
                var e,
                    f = c.select.items();
                if (!b.getSelection || !b.getSelection().toString()) {
                    var g = c.settings()[0];
                    if (a(d.target).closest("div.dataTables_wrapper")[0] == c.table().container()) {
                        var h = a(d.target).closest("td, th"),
                            i = c.cell(h).index();
                        c.cell(h).any() &&
                            ("row" === f ? ((e = i.row), m(d, c, g, "row", e)) : "column" === f ? ((e = c.cell(h).index().column), m(d, c, g, "column", e)) : "cell" === f && ((e = c.cell(h).index()), m(d, c, g, "cell", e)),
                            (g._select_lastCell = i));
                    }
                }
            }),
            a("body").on("click.dtSelect", function (b) {
                if (e._select.blurable) {
                    if (a(b.target).parents().filter(c.table().container()).length) return;
                    if (a(b.target).parents("div.DTE").length) return;
                    l(e, !0);
                }
            });
    }
    function h(b, c, d, e) {
        (e && !b.flatten().length) || (d.unshift(b), a(b.table().node()).triggerHandler(c + ".dt", d));
    }
    function i(b) {
        var c = b.settings()[0];
        if (c._select.info && c.aanFeatures.i) {
            var d = a('<span class="select-info"/>'),
                e = function (c, e) {
                    d.append(a('<span class="select-item"/>').append(b.i18n("select." + c + "s", { _: "%d " + c + "s selected", 0: "", 1: "1 " + c + " selected" }, e)));
                };
            e("row", b.rows({ selected: !0 }).flatten().length),
                e("column", b.columns({ selected: !0 }).flatten().length),
                e("cell", b.cells({ selected: !0 }).flatten().length),
                a.each(c.aanFeatures.i, function (b, c) {
                    c = a(c);
                    var e = c.children("span.select-info");
                    e.length && e.remove(), "" !== d.text() && c.append(d);
                });
        }
    }
    function j(b) {
        var c = new o.Api(b);
        b.aoRowCreatedCallback.push({
            fn: function (c, d, e) {
                var f,
                    g,
                    h = b.aoData[e];
                for (h._select_selected && a(c).addClass(b._select.className), f = 0, g = b.aoColumns.length; g > f; f++)
                    (b.aoColumns[f]._select_selected || (h._selected_cells && h._selected_cells[f])) && a(h.anCells[f]).addClass(b._select.className);
            },
            sName: "select-deferRender",
        }),
            c.on("preXhr.dt.dtSelect", function () {
                var a = c
                        .rows({ selected: !0 })
                        .ids(!0)
                        .filter(function (a) {
                            return a !== d;
                        }),
                    b = c
                        .cells({ selected: !0 })
                        .eq(0)
                        .map(function (a) {
                            var b = c.row(a.row).id(!0);
                            return b ? { row: b, column: a.column } : d;
                        })
                        .filter(function (a) {
                            return a !== d;
                        });
                c.one("draw.dt.dtSelect", function () {
                    c.rows(a).select(),
                        b.any() &&
                            b.each(function (a) {
                                c.cells(a.row, a.column).select();
                            });
                });
            }),
            c.on("draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt", function () {
                i(c);
            }),
            c.on("destroy.dtSelect", function () {
                f(c), c.off(".dtSelect");
            });
    }
    function k(b, c, d, e) {
        var f = b[c + "s"]({ search: "applied" }).indexes(),
            g = a.inArray(e, f),
            h = a.inArray(d, f);
        if (b[c + "s"]({ selected: !0 }).any() || -1 !== g) {
            if (g > h) {
                var i = h;
                (h = g), (g = i);
            }
            f.splice(h + 1, f.length), f.splice(0, g);
        } else f.splice(a.inArray(d, f) + 1, f.length);
        b[c](d, { selected: !0 }).any() ? (f.splice(a.inArray(d, f), 1), b[c + "s"](f).deselect()) : b[c + "s"](f).select();
    }
    function l(a, b) {
        if (b || "single" === a._select.style) {
            var c = new o.Api(a);
            c.rows({ selected: !0 }).deselect(), c.columns({ selected: !0 }).deselect(), c.cells({ selected: !0 }).deselect();
        }
    }
    function m(a, b, c, d, f) {
        var g = b.select.style(),
            h = b[d](f, { selected: !0 }).any();
        if ("os" === g)
            if (a.ctrlKey || a.metaKey) b[d](f).select(!h);
            else if (a.shiftKey) "cell" === d ? e(b, f, c._select_lastCell || null) : k(b, d, f, c._select_lastCell ? c._select_lastCell[d] : null);
            else {
                var i = b[d + "s"]({ selected: !0 });
                h && 1 === i.flatten().length ? b[d](f).deselect() : (i.deselect(), b[d](f).select());
            }
        else b[d](f).select(!h);
    }
    function n(a, b) {
        return function (c) {
            return c.i18n("buttons." + a, b);
        };
    }
    var o = a.fn.dataTable;
    (o.select = {}),
        (o.select.version = "1.1.2"),
        (o.select.init = function (b) {
            var c = b.settings()[0],
                e = c.oInit.select,
                f = o.defaults.select,
                g = e === d ? f : e,
                h = "row",
                i = "api",
                j = !1,
                k = !0,
                l = "td, th",
                m = "selected";
            (c._select = {}),
                g === !0
                    ? (i = "os")
                    : "string" == typeof g
                    ? (i = g)
                    : a.isPlainObject(g) &&
                      (g.blurable !== d && (j = g.blurable), g.info !== d && (k = g.info), g.items !== d && (h = g.items), g.style !== d && (i = g.style), g.selector !== d && (l = g.selector), g.className !== d && (m = g.className)),
                b.select.selector(l),
                b.select.items(h),
                b.select.style(i),
                b.select.blurable(j),
                b.select.info(k),
                (c._select.className = m),
                (a.fn.dataTable.ext.order["select-checkbox"] = function (b, c) {
                    return this.api()
                        .column(c, { order: "index" })
                        .nodes()
                        .map(function (c) {
                            return "row" === b._select.items ? a(c).parent().hasClass(b._select.className) : "cell" === b._select.items ? a(c).hasClass(b._select.className) : !1;
                        });
                }),
                a(b.table().node()).hasClass("selectable") && b.select.style("os");
        }),
        a.each(
            [
                { type: "row", prop: "aoData" },
                { type: "column", prop: "aoColumns" },
            ],
            function (a, b) {
                o.ext.selector[b.type].push(function (a, c, e) {
                    var f,
                        g = c.selected,
                        h = [];
                    if (g === d) return e;
                    for (var i = 0, j = e.length; j > i; i++) (f = a[b.prop][e[i]]), ((g === !0 && f._select_selected === !0) || (g === !1 && !f._select_selected)) && h.push(e[i]);
                    return h;
                });
            }
        ),
        o.ext.selector.cell.push(function (a, b, c) {
            var e,
                f = b.selected,
                g = [];
            if (f === d) return c;
            for (var h = 0, i = c.length; i > h; h++)
                (e = a.aoData[c[h].row]), ((f === !0 && e._selected_cells && e._selected_cells[c[h].column] === !0) || (f === !1 && (!e._selected_cells || !e._selected_cells[c[h].column]))) && g.push(c[h]);
            return g;
        });
    var p = o.Api.register,
        q = o.Api.registerPlural;
    return (
        p("select()", function () {
            return this.iterator("table", function (a) {
                o.select.init(new o.Api(a));
            });
        }),
        p("select.blurable()", function (a) {
            return a === d
                ? this.context[0]._select.blurable
                : this.iterator("table", function (b) {
                      b._select.blurable = a;
                  });
        }),
        p("select.info()", function (a) {
            return i === d
                ? this.context[0]._select.info
                : this.iterator("table", function (b) {
                      b._select.info = a;
                  });
        }),
        p("select.items()", function (a) {
            return a === d
                ? this.context[0]._select.items
                : this.iterator("table", function (b) {
                      (b._select.items = a), h(new o.Api(b), "selectItems", [a]);
                  });
        }),
        p("select.style()", function (a) {
            return a === d
                ? this.context[0]._select.style
                : this.iterator("table", function (b) {
                      (b._select.style = a), b._select_init || j(b);
                      var c = new o.Api(b);
                      f(c), "api" !== a && g(c), h(new o.Api(b), "selectStyle", [a]);
                  });
        }),
        p("select.selector()", function (a) {
            return a === d
                ? this.context[0]._select.selector
                : this.iterator("table", function (b) {
                      f(new o.Api(b)), (b._select.selector = a), "api" !== b._select.style && g(new o.Api(b));
                  });
        }),
        q("rows().select()", "row().select()", function (b) {
            var c = this;
            return b === !1
                ? this.deselect()
                : (this.iterator("row", function (b, c) {
                      l(b), (b.aoData[c]._select_selected = !0), a(b.aoData[c].nTr).addClass(b._select.className);
                  }),
                  this.iterator("table", function (a, b) {
                      h(c, "select", ["row", c[b]], !0);
                  }),
                  this);
        }),
        q("columns().select()", "column().select()", function (b) {
            var c = this;
            return b === !1
                ? this.deselect()
                : (this.iterator("column", function (b, c) {
                      l(b), (b.aoColumns[c]._select_selected = !0);
                      var d = new o.Api(b).column(c);
                      a(d.header()).addClass(b._select.className), a(d.footer()).addClass(b._select.className), d.nodes().to$().addClass(b._select.className);
                  }),
                  this.iterator("table", function (a, b) {
                      h(c, "select", ["column", c[b]], !0);
                  }),
                  this);
        }),
        q("cells().select()", "cell().select()", function (b) {
            var c = this;
            return b === !1
                ? this.deselect()
                : (this.iterator("cell", function (b, c, e) {
                      l(b);
                      var f = b.aoData[c];
                      f._selected_cells === d && (f._selected_cells = []), (f._selected_cells[e] = !0), f.anCells && a(f.anCells[e]).addClass(b._select.className);
                  }),
                  this.iterator("table", function (a, b) {
                      h(c, "select", ["cell", c[b]], !0);
                  }),
                  this);
        }),
        q("rows().deselect()", "row().deselect()", function () {
            var b = this;
            return (
                this.iterator("row", function (b, c) {
                    (b.aoData[c]._select_selected = !1), a(b.aoData[c].nTr).removeClass(b._select.className);
                }),
                this.iterator("table", function (a, c) {
                    h(b, "deselect", ["row", b[c]], !0);
                }),
                this
            );
        }),
        q("columns().deselect()", "column().deselect()", function () {
            var b = this;
            return (
                this.iterator("column", function (b, c) {
                    b.aoColumns[c]._select_selected = !1;
                    var d = new o.Api(b),
                        e = d.column(c);
                    a(e.header()).removeClass(b._select.className),
                        a(e.footer()).removeClass(b._select.className),
                        d
                            .cells(null, c)
                            .indexes()
                            .each(function (c) {
                                var d = b.aoData[c.row],
                                    e = d._selected_cells;
                                !d.anCells || (e && e[c.column]) || a(d.anCells[c.column]).removeClass(b._select.className);
                            });
                }),
                this.iterator("table", function (a, c) {
                    h(b, "deselect", ["column", b[c]], !0);
                }),
                this
            );
        }),
        q("cells().deselect()", "cell().deselect()", function () {
            var b = this;
            return (
                this.iterator("cell", function (b, c, d) {
                    var e = b.aoData[c];
                    (e._selected_cells[d] = !1), e.anCells && !b.aoColumns[d]._select_selected && a(e.anCells[d]).removeClass(b._select.className);
                }),
                this.iterator("table", function (a, c) {
                    h(b, "deselect", ["cell", b[c]], !0);
                }),
                this
            );
        }),
        a.extend(o.ext.buttons, {
            selected: {
                text: n("selected", "Selected"),
                className: "buttons-selected",
                init: function (a, b, c) {
                    var d = this;
                    a.on("draw.dt.DT select.dt.DT deselect.dt.DT", function () {
                        var a = d.rows({ selected: !0 }).any() || d.columns({ selected: !0 }).any() || d.cells({ selected: !0 }).any();
                        d.enable(a);
                    }),
                        this.disable();
                },
            },
            selectedSingle: {
                text: n("selectedSingle", "Selected single"),
                className: "buttons-selected-single",
                init: function (a, b, c) {
                    var d = this;
                    a.on("draw.dt.DT select.dt.DT deselect.dt.DT", function () {
                        var b = a.rows({ selected: !0 }).flatten().length + a.columns({ selected: !0 }).flatten().length + a.cells({ selected: !0 }).flatten().length;
                        d.enable(1 === b);
                    }),
                        this.disable();
                },
            },
            selectAll: {
                text: n("selectAll", "Select all"),
                className: "buttons-select-all",
                action: function () {
                    var a = this.select.items();
                    this[a + "s"]().select();
                },
            },
            selectNone: {
                text: n("selectNone", "Deselect all"),
                className: "buttons-select-none",
                action: function () {
                    l(this.settings()[0], !0);
                },
                init: function (a, b, c) {
                    var d = this;
                    a.on("draw.dt.DT select.dt.DT deselect.dt.DT", function () {
                        var b = a.rows({ selected: !0 }).flatten().length + a.columns({ selected: !0 }).flatten().length + a.cells({ selected: !0 }).flatten().length;
                        d.enable(b > 0);
                    }),
                        this.disable();
                },
            },
        }),
        a.each(["Row", "Column", "Cell"], function (a, b) {
            var c = b.toLowerCase();
            o.ext.buttons["select" + b + "s"] = {
                text: n("select" + b + "s", "Select " + c + "s"),
                className: "buttons-select-" + c + "s",
                action: function () {
                    this.select.items(c);
                },
                init: function (a, b, d) {
                    var e = this;
                    a.on("selectItems.dt.DT", function (a, b, d) {
                        e.active(d === c);
                    });
                },
            };
        }),
        a(c).on("preInit.dt.dtSelect", function (a, b) {
            "dt" === a.namespace && o.select.init(new o.Api(b));
        }),
        o.select
    );
});