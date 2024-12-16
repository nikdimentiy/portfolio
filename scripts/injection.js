(() => {
    var __webpack_modules__ = {
        880: function(module, exports, __webpack_require__) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
            (function(root, definition) {
                "use strict";
                if (true) {
                    !(__WEBPACK_AMD_DEFINE_FACTORY__ = definition, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__, 
                    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                } else {}
            })(this, (function() {
                "use strict";
                var noop = function() {};
                var undefinedType = "undefined";
                var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
                var logMethods = [ "trace", "debug", "info", "warn", "error" ];
                function bindMethod(obj, methodName) {
                    var method = obj[methodName];
                    if (typeof method.bind === "function") {
                        return method.bind(obj);
                    } else {
                        try {
                            return Function.prototype.bind.call(method, obj);
                        } catch (e) {
                            return function() {
                                return Function.prototype.apply.apply(method, [ obj, arguments ]);
                            };
                        }
                    }
                }
                function traceForIE() {
                    if (console.log) {
                        if (console.log.apply) {
                            console.log.apply(console, arguments);
                        } else {
                            Function.prototype.apply.apply(console.log, [ console, arguments ]);
                        }
                    }
                    if (console.trace) console.trace();
                }
                function realMethod(methodName) {
                    if (methodName === "debug") {
                        methodName = "log";
                    }
                    if (typeof console === undefinedType) {
                        return false;
                    } else if (methodName === "trace" && isIE) {
                        return traceForIE;
                    } else if (console[methodName] !== undefined) {
                        return bindMethod(console, methodName);
                    } else if (console.log !== undefined) {
                        return bindMethod(console, "log");
                    } else {
                        return noop;
                    }
                }
                function replaceLoggingMethods(level, loggerName) {
                    for (var i = 0; i < logMethods.length; i++) {
                        var methodName = logMethods[i];
                        this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
                    }
                    this.log = this.debug;
                }
                function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
                    return function() {
                        if (typeof console !== undefinedType) {
                            replaceLoggingMethods.call(this, level, loggerName);
                            this[methodName].apply(this, arguments);
                        }
                    };
                }
                function defaultMethodFactory(methodName, level, loggerName) {
                    return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
                }
                function Logger(name, defaultLevel, factory) {
                    var self = this;
                    var currentLevel;
                    defaultLevel = defaultLevel == null ? "WARN" : defaultLevel;
                    var storageKey = "loglevel";
                    if (typeof name === "string") {
                        storageKey += ":" + name;
                    } else if (typeof name === "symbol") {
                        storageKey = undefined;
                    }
                    function persistLevelIfPossible(levelNum) {
                        var levelName = (logMethods[levelNum] || "silent").toUpperCase();
                        if (typeof window === undefinedType || !storageKey) return;
                        try {
                            window.localStorage[storageKey] = levelName;
                            return;
                        } catch (ignore) {}
                        try {
                            window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
                        } catch (ignore) {}
                    }
                    function getPersistedLevel() {
                        var storedLevel;
                        if (typeof window === undefinedType || !storageKey) return;
                        try {
                            storedLevel = window.localStorage[storageKey];
                        } catch (ignore) {}
                        if (typeof storedLevel === undefinedType) {
                            try {
                                var cookie = window.document.cookie;
                                var location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
                                if (location !== -1) {
                                    storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                                }
                            } catch (ignore) {}
                        }
                        if (self.levels[storedLevel] === undefined) {
                            storedLevel = undefined;
                        }
                        return storedLevel;
                    }
                    function clearPersistedLevel() {
                        if (typeof window === undefinedType || !storageKey) return;
                        try {
                            window.localStorage.removeItem(storageKey);
                            return;
                        } catch (ignore) {}
                        try {
                            window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        } catch (ignore) {}
                    }
                    self.name = name;
                    self.levels = {
                        TRACE: 0,
                        DEBUG: 1,
                        INFO: 2,
                        WARN: 3,
                        ERROR: 4,
                        SILENT: 5
                    };
                    self.methodFactory = factory || defaultMethodFactory;
                    self.getLevel = function() {
                        return currentLevel;
                    };
                    self.setLevel = function(level, persist) {
                        if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
                            level = self.levels[level.toUpperCase()];
                        }
                        if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
                            currentLevel = level;
                            if (persist !== false) {
                                persistLevelIfPossible(level);
                            }
                            replaceLoggingMethods.call(self, level, name);
                            if (typeof console === undefinedType && level < self.levels.SILENT) {
                                return "No console available for logging";
                            }
                        } else {
                            throw "log.setLevel() called with invalid level: " + level;
                        }
                    };
                    self.setDefaultLevel = function(level) {
                        defaultLevel = level;
                        if (!getPersistedLevel()) {
                            self.setLevel(level, false);
                        }
                    };
                    self.resetLevel = function() {
                        self.setLevel(defaultLevel, false);
                        clearPersistedLevel();
                    };
                    self.enableAll = function(persist) {
                        self.setLevel(self.levels.TRACE, persist);
                    };
                    self.disableAll = function(persist) {
                        self.setLevel(self.levels.SILENT, persist);
                    };
                    var initialLevel = getPersistedLevel();
                    if (initialLevel == null) {
                        initialLevel = defaultLevel;
                    }
                    self.setLevel(initialLevel, false);
                }
                var defaultLogger = new Logger;
                var _loggersByName = {};
                defaultLogger.getLogger = function getLogger(name) {
                    if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
                        throw new TypeError("You must supply a name when creating a logger.");
                    }
                    var logger = _loggersByName[name];
                    if (!logger) {
                        logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
                    }
                    return logger;
                };
                var _log = typeof window !== undefinedType ? window.log : undefined;
                defaultLogger.noConflict = function() {
                    if (typeof window !== undefinedType && window.log === defaultLogger) {
                        window.log = _log;
                    }
                    return defaultLogger;
                };
                defaultLogger.getLoggers = function getLoggers() {
                    return _loggersByName;
                };
                defaultLogger["default"] = defaultLogger;
                return defaultLogger;
            }));
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        __webpack_require__.n = module => {
            var getter = module && module.__esModule ? () => module["default"] : () => module;
            __webpack_require__.d(getter, {
                a: getter
            });
            return getter;
        };
    })();
    (() => {
        __webpack_require__.d = (exports, definition) => {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                }
            }
        };
    })();
    (() => {
        __webpack_require__.g = function() {
            if (typeof globalThis === "object") return globalThis;
            try {
                return this || new Function("return this")();
            } catch (e) {
                if (typeof window === "object") return window;
            }
        }();
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    var __webpack_exports__ = {};
    (() => {
        "use strict";
        var loglevel = __webpack_require__(880);
        var loglevel_default = __webpack_require__.n(loglevel);
        var NodeFilter;
        (function(NodeFilter) {
            NodeFilter[NodeFilter["ACCEPT"] = 0] = "ACCEPT";
            NodeFilter[NodeFilter["ACCEPT_BUT_SKIP_NESTED"] = 1] = "ACCEPT_BUT_SKIP_NESTED";
            NodeFilter[NodeFilter["SKIP"] = 2] = "SKIP";
            NodeFilter[NodeFilter["SKIP_NESTED"] = 3] = "SKIP_NESTED";
        })(NodeFilter || (NodeFilter = {}));
        class RangeVisitor {
            constructor(filter) {
                Object.defineProperty(this, "filter", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.filter = filter;
            }
            visit(range, state) {
                this.visitNode(range, range.commonAncestorContainer, state);
            }
            visitNode(range, node, state) {
                if (range.intersectsNode(node)) {
                    const nodeFilterAction = this.filter(node);
                    if (nodeFilterAction === NodeFilter.ACCEPT || nodeFilterAction === NodeFilter.ACCEPT_BUT_SKIP_NESTED) {
                        if (!this.enterNode(range, node, state)) return false;
                    }
                    if (nodeFilterAction !== NodeFilter.SKIP_NESTED && nodeFilterAction !== NodeFilter.ACCEPT_BUT_SKIP_NESTED) {
                        for (const child of node.childNodes) {
                            if (!this.visitNode(range, child, state)) return false;
                        }
                    }
                    if (nodeFilterAction === NodeFilter.ACCEPT || nodeFilterAction === NodeFilter.ACCEPT_BUT_SKIP_NESTED) {
                        if (!this.leaveNode(range, node, state)) return false;
                    }
                }
                return true;
            }
        }
        function isDisplayBlock(element) {
            const display = window.getComputedStyle(element).display;
            return display === "block" || display === "list-item";
        }
        function isTableCell(element) {
            const display = window.getComputedStyle(element).display;
            return element.tagName === "TD" || element.tagName === "TH" || display === "table-cell";
        }
        function isOutOfGeneralFlow(element) {
            const position = window.getComputedStyle(element).position;
            return position === "absolute" || position === "fixed" || position === "sticky";
        }
        function isNodeWithCode(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                if (element.tagName === "CODE") return true;
                if (element.classList.contains("ql-code-block")) return true;
            }
            return false;
        }
        function createElement(tag, classes = [], children = []) {
            if (!Array.isArray(classes)) {
                classes = [ classes ];
            }
            const element = document.createElement(tag);
            for (const cls of classes) {
                element.classList.add(cls);
            }
            if (!Array.isArray(children)) {
                children = [ children ];
            }
            for (const child of children) {
                element.appendChild(child);
            }
            return element;
        }
        function isElementEntirelyInViewport(element) {
            const rect = element.getBoundingClientRect();
            return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
        }
        function isElementPartiallyInViewport(element) {
            const rect = element.getBoundingClientRect();
            return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.bottom > 0 && rect.right > 0;
        }
        function preventStealingFocus(element) {
            element.addEventListener("mousedown", (event => event.preventDefault()));
            element.addEventListener("pointerdown", (event => event.preventDefault()));
        }
        function preventClickPropagation(element) {
            element.addEventListener("pointerup", (event => {
                event.preventDefault();
                event.stopImmediatePropagation();
            }));
        }
        function collapseDOMRects(rects) {
            const delta = 1e-4;
            const result = [];
            if (rects.length === 0) return result;
            rects.sort(((first, second) => {
                if (Math.abs(first.y - second.y) < delta) {
                    if (Math.abs(first.x - second.x) < delta) {
                        return 0;
                    }
                    if (first.x > second.x) {
                        return 1;
                    }
                    return -1;
                }
                if (first.y > second.y) {
                    return 1;
                }
                return -1;
            }));
            result.push(rects[0]);
            let index = 1;
            while (index < rects.length) {
                const prev = result[result.length - 1];
                const rect = rects[index];
                if (Math.abs(prev.y - rect.y) < delta) {
                    result[result.length - 1] = new DOMRect(prev.x, prev.y, Math.max(rect.x + rect.width - prev.x, prev.width), prev.height);
                } else {
                    result.push(rect);
                }
                index++;
            }
            return result;
        }
        function joinRects(rects) {
            if (!rects.length) return new DOMRect;
            const top = Math.min(...rects.map((r => r.top)));
            const left = Math.min(...rects.map((r => r.left)));
            const right = Math.max(...rects.map((r => r.right)));
            const bottom = Math.max(...rects.map((r => r.bottom)));
            return new DOMRect(Math.min(...rects.map((r => r.x))), Math.min(...rects.map((r => r.y))), right - left, bottom - top);
        }
        function isPointInsideRects(rects, x, y, additionalRadius = 10) {
            return rects.some((rect => rect.left - additionalRadius < x && rect.right + additionalRadius > x && rect.top - additionalRadius < y && rect.bottom + additionalRadius > y));
        }
        function getWidthAndHeight(style, rect, withPadding = false, withBorder = false) {
            let height = rect.height;
            let width = rect.width;
            if (!withPadding) {
                height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
                width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
            }
            if (!withBorder) {
                height -= parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
                height -= parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
            }
            return {
                width,
                height
            };
        }
        function parents(element, withSelf = false) {
            const result = [];
            if (element) {
                if (withSelf) result.push(element);
                let parent = element.parentElement;
                while (parent) {
                    result.push(parent);
                    parent = parent.parentElement;
                }
            }
            return result;
        }
        function* parentsLazy(startElement, withSelf) {
            if (withSelf) {
                yield startElement;
            }
            let element = startElement.parentElement;
            while (element) {
                yield element;
                element = (element === null || element === void 0 ? void 0 : element.parentElement) || null;
            }
        }
        function isOverflown(element) {
            return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
        }
        function getImageDimensions(url) {
            if (!url) return Promise.resolve(undefined);
            return new Promise((resolve => {
                const img = new Image;
                img.onload = () => {
                    resolve({
                        width: img.width,
                        height: img.height
                    });
                };
                img.onerror = () => {
                    resolve(undefined);
                };
                img.src = url;
            }));
        }
        function cleanBrowserRange(range) {
            range.setEnd(document, 0);
        }
        class RangeListExtractorState {
            constructor(cached = []) {
                Object.defineProperty(this, "cached", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "indexInCached", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 0
                });
                Object.defineProperty(this, "list", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: []
                });
                Object.defineProperty(this, "isAtNewLine", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: true
                });
                Object.defineProperty(this, "isAtPotentialNewLine", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: false
                });
                this.cached = cached;
            }
            appendRangeEntry(range, type) {
                while (this.indexInCached < this.cached.length) {
                    const candidate = this.cached[this.indexInCached];
                    if (range.compareBoundaryPoints(Range.START_TO_END, candidate.range) === -1) {
                        return this.list.push({
                            range: range.cloneRange(),
                            type
                        });
                    }
                    if (type === candidate.type && range.startContainer === candidate.range.startContainer && range.startOffset === candidate.range.startOffset && range.endContainer === candidate.range.endContainer && range.endOffset === candidate.range.endOffset) {
                        this.indexInCached++;
                        return this.list.push(candidate);
                    }
                    this.indexInCached++;
                    cleanBrowserRange(candidate.range);
                }
                return this.list.push({
                    range: range.cloneRange(),
                    type
                });
            }
            cleanCached() {
                for (let i = this.indexInCached; i < this.cached.length; i++) {
                    cleanBrowserRange(this.cached[i].range);
                }
            }
        }
        class RangeListExtractorVisitor extends RangeVisitor {
            constructor() {
                super((node => {
                    var _a;
                    if (isNodeWithCode(node)) return NodeFilter.ACCEPT_BUT_SKIP_NESTED;
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (isOutOfGeneralFlow(node) || ((_a = node.role) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "presentation") return NodeFilter.SKIP_NESTED;
                    }
                    return [ Node.ELEMENT_NODE, Node.TEXT_NODE ].includes(node.nodeType) ? NodeFilter.ACCEPT : NodeFilter.SKIP;
                }));
                Object.defineProperty(this, "cachedBrowserRange", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: null
                });
            }
            extract(range, cached) {
                const state = new RangeListExtractorState(cached);
                this.cachedBrowserRange = document.createRange();
                this.visit(range, state);
                state.cleanCached();
                cleanBrowserRange(this.cachedBrowserRange);
                this.cachedBrowserRange = null;
                return state.list;
            }
            appendNewLine(state, node) {
                this.cachedBrowserRange.setStartBefore(node);
                if (node instanceof HTMLBRElement) {
                    this.cachedBrowserRange.setEndAfter(node);
                } else {
                    this.cachedBrowserRange.setEndBefore(node);
                }
                state.appendRangeEntry(this.cachedBrowserRange, "new-line");
                state.isAtPotentialNewLine = false;
            }
            enterNode(range, node, state) {
                if (isNodeWithCode(node)) {
                    if (isDisplayBlock(node) || isTableCell(node)) {
                        if (!state.isAtNewLine || state.isAtPotentialNewLine) {
                            this.appendNewLine(state, node);
                            state.isAtNewLine = true;
                        }
                    } else {
                        if (state.isAtPotentialNewLine) {
                            this.appendNewLine(state, node);
                        }
                    }
                    this.cachedBrowserRange.setStartBefore(node);
                    this.cachedBrowserRange.setEndAfter(node);
                    state.appendRangeEntry(this.cachedBrowserRange, "unknown");
                    return true;
                }
                switch (node.nodeType) {
                  case Node.TEXT_NODE:
                    {
                        let from = 0;
                        let to;
                        if (range.startContainer === node) from = range.startOffset;
                        if (range.endContainer === node) to = range.endOffset;
                        if (state.isAtPotentialNewLine) {
                            if (from !== 0) {
                                loglevel_default().warn("Potential newline in the middle of the text node");
                            }
                            this.appendNewLine(state, node);
                        }
                        this.cachedBrowserRange.setStart(node, from);
                        this.cachedBrowserRange.setEnd(node, to !== null && to !== void 0 ? to : node.nodeValue.length);
                        state.appendRangeEntry(this.cachedBrowserRange, "text");
                        state.isAtNewLine = false;
                        break;
                    }

                  case Node.ELEMENT_NODE:
                    {
                        const element = node;
                        if (element instanceof HTMLBRElement) {
                            const stillPotentialNewLine = state.isAtPotentialNewLine;
                            this.appendNewLine(state, node);
                            state.isAtPotentialNewLine = stillPotentialNewLine;
                            state.isAtNewLine = true;
                        } else {
                            if (isDisplayBlock(element) || isTableCell(element)) {
                                if (!state.isAtNewLine || state.isAtPotentialNewLine) {
                                    this.appendNewLine(state, node);
                                    state.isAtNewLine = true;
                                }
                            }
                        }
                        break;
                    }
                }
                return true;
            }
            leaveNode(range, node, state) {
                switch (node.nodeType) {
                  case Node.TEXT_NODE:
                    break;

                  case Node.ELEMENT_NODE:
                    {
                        const element = node;
                        if (isDisplayBlock(element) || isTableCell(element)) {
                            state.isAtPotentialNewLine = true;
                        }
                        break;
                    }
                }
                return true;
            }
        }
        function bsearch(array, value, compare, bound = "lower") {
            let left = -1;
            let right = array.length;
            while (left + 1 < right) {
                const idx = left + (right - left >> 1);
                const comparison = compare(value, array[idx]);
                if (comparison < 0) {
                    right = idx;
                } else if (comparison > 0) {
                    left = idx;
                } else {
                    if (bound === "lower") {
                        right = idx;
                    } else {
                        left = idx;
                    }
                }
            }
            return right;
        }
        function integerBinarySearch(boundary, compare, bound = "lower") {
            let left = -1;
            let right = boundary;
            while (left + 1 < right) {
                const value = left + (right - left >> 1);
                const comparison = compare(value);
                if (comparison < 0) {
                    right = value;
                } else if (comparison > 0) {
                    left = value;
                } else {
                    if (bound === "lower") {
                        right = value;
                    } else {
                        left = value;
                    }
                }
            }
            return right;
        }
        function round(value) {
            return Math.round((value + Number.EPSILON) * 1e3) / 1e3;
        }
        function parseAndRoundFloat(value) {
            return round(parseFloat(value || "0"));
        }
        class RangeDisposer {
            constructor(range) {
                Object.defineProperty(this, "range", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: range
                });
            }
            [Symbol.dispose]() {
                cleanBrowserRange(this.range);
            }
        }
        var __addDisposableResource = undefined && undefined.__addDisposableResource || function(env, value, async) {
            if (value !== null && value !== void 0) {
                if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
                var dispose, inner;
                if (async) {
                    if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
                    dispose = value[Symbol.asyncDispose];
                }
                if (dispose === void 0) {
                    if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
                    dispose = value[Symbol.dispose];
                    if (async) inner = dispose;
                }
                if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
                if (inner) dispose = function() {
                    try {
                        inner.call(this);
                    } catch (e) {
                        return Promise.reject(e);
                    }
                };
                env.stack.push({
                    value,
                    dispose,
                    async
                });
            } else if (async) {
                env.stack.push({
                    async: true
                });
            }
            return value;
        };
        var __disposeResources = undefined && undefined.__disposeResources || function(SuppressedError) {
            return function(env) {
                function fail(e) {
                    env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
                    env.hasError = true;
                }
                function next() {
                    while (env.stack.length) {
                        var rec = env.stack.pop();
                        try {
                            var result = rec.dispose && rec.dispose.call(rec.value);
                            if (rec.async) return Promise.resolve(result).then(next, (function(e) {
                                fail(e);
                                return next();
                            }));
                        } catch (e) {
                            fail(e);
                        }
                    }
                    if (env.hasError) throw env.error;
                }
                return next();
            };
        }(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
            var e = new Error(message);
            return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
        });
        var DOMTextContentRangeExtractor;
        (function(DOMTextContentRangeExtractor) {
            const RANGE_EXTRACTOR = new RangeListExtractorVisitor;
            function extractRangeList(root, cached) {
                return root ? RANGE_EXTRACTOR.extract(root, cached) : [];
            }
            DOMTextContentRangeExtractor.extractRangeList = extractRangeList;
            function collectTextContentFromRangeList(list) {
                let text = "";
                let unknowns = [];
                for (const entry of list) {
                    switch (entry.type) {
                      case "text":
                        text += entry.range.toString();
                        break;

                      case "new-line":
                        text += "\n";
                        break;

                      case "unknown":
                        if (unknowns[unknowns.length - 1] !== text.length) {
                            unknowns.push(text.length);
                        }
                        break;
                    }
                    if ("isNew" in entry && entry.isNew) {
                        cleanBrowserRange(entry.range);
                    }
                }
                return [ text, unknowns ];
            }
            DOMTextContentRangeExtractor.collectTextContentFromRangeList = collectTextContentFromRangeList;
            function truncateRangeByOrigin(rangeToTruncate, origin) {
                const result = rangeToTruncate.cloneRange();
                const startPointPosition = origin.comparePoint(result.startContainer, result.startOffset);
                const endPointPosition = origin.comparePoint(result.endContainer, result.endOffset);
                let isTruncated = false;
                if (startPointPosition === -1) {
                    if (endPointPosition === -1) {
                        cleanBrowserRange(result);
                        return null;
                    }
                    result.setStart(origin.startContainer, origin.startOffset);
                    isTruncated = true;
                }
                if (endPointPosition === 1) {
                    if (startPointPosition === 1) {
                        cleanBrowserRange(result);
                        return null;
                    }
                    result.setEnd(origin.endContainer, origin.endOffset);
                    isTruncated = true;
                }
                if (isTruncated && result.collapsed) {
                    cleanBrowserRange(result);
                    return null;
                }
                return result;
            }
            DOMTextContentRangeExtractor.truncateRangeByOrigin = truncateRangeByOrigin;
            function* subListOfRange(list, range) {
                const start = bsearch(list, undefined, ((_, entry) => entry.range.comparePoint(range.startContainer, range.startOffset)));
                const end = bsearch(list, undefined, ((_, entry) => entry.range.comparePoint(range.endContainer, range.endOffset)), "upper");
                const candidates = list.slice(start, end);
                if (candidates.length === 0) return;
                const first = truncateRangeByOrigin(candidates[0].range, range);
                if (first) yield {
                    range: first,
                    type: candidates[0].type,
                    isNew: true
                };
                for (let i = 1; i < candidates.length - 1; i++) {
                    yield candidates[i];
                }
                if (candidates.length > 1) {
                    const last = truncateRangeByOrigin(candidates[candidates.length - 1].range, range);
                    if (last) yield {
                        range: last,
                        type: candidates[candidates.length - 1].type,
                        isNew: true
                    };
                }
            }
            DOMTextContentRangeExtractor.subListOfRange = subListOfRange;
            function calcOffsetInContent(list, range, hostWorkingRange) {
                const env_1 = {
                    stack: [],
                    error: void 0,
                    hasError: false
                };
                try {
                    let offset = 0;
                    if (list.length === 0) return offset;
                    const point = range.cloneRange();
                    const _ = __addDisposableResource(env_1, new RangeDisposer(point), false);
                    point.collapse(true);
                    const isInsideHost = hostWorkingRange.comparePoint(point.startContainer, point.startOffset) === 0;
                    if (list[0].range.comparePoint(point.startContainer, point.startOffset) === -1) {
                        return isInsideHost ? 0 : undefined;
                    }
                    if (list[list.length - 1].range.comparePoint(point.startContainer, point.startOffset) === 1 && !isInsideHost) {
                        return undefined;
                    }
                    const length = list.length;
                    for (let it = 0; it < length; it++) {
                        const entry = list[it];
                        const pos = entry.range.comparePoint(point.startContainer, point.startOffset);
                        if (pos === 1) {
                            if (entry.type === "text") {
                                offset += entry.range.toString().length;
                            } else if (entry.type === "new-line") {
                                offset += 1;
                            }
                        } else if (pos === 0) {
                            const last = entry.range.cloneRange();
                            if (entry.type === "text") {
                                last.setEnd(point.startContainer, point.startOffset);
                                offset += last.toString().length;
                            } else if (entry.type === "new-line") {
                                last.collapse(true);
                                if (last.comparePoint(point.startContainer, point.startOffset) === 1) {
                                    offset += 1;
                                }
                            }
                            cleanBrowserRange(last);
                        } else break;
                    }
                    return offset;
                } catch (e_1) {
                    env_1.error = e_1;
                    env_1.hasError = true;
                } finally {
                    __disposeResources(env_1);
                }
            }
            DOMTextContentRangeExtractor.calcOffsetInContent = calcOffsetInContent;
            function contentFromRange(range, rangeList) {
                return DOMTextContentRangeExtractor.collectTextContentFromRangeList(DOMTextContentRangeExtractor.subListOfRange(rangeList, range))[0];
            }
            DOMTextContentRangeExtractor.contentFromRange = contentFromRange;
            function rangeFromContent(from, to, subRange, rangeList, withUnknownRanges = false) {
                const range = document.createRange();
                let offset = 0;
                let isStartSet = false;
                let isSet = false;
                for (const entry of subListOfRange(rangeList, subRange)) {
                    if (entry.type === "unknown") {
                        if (entry.isNew) cleanBrowserRange(entry.range);
                        if (!withUnknownRanges && isStartSet) {
                            cleanBrowserRange(range);
                            return null;
                        }
                        continue;
                    }
                    const length = entry.type === "text" ? entry.range.toString().length : 1;
                    if (entry.type === "text") {
                        if (!isStartSet && from <= entry.range.startOffset + offset + length) {
                            isStartSet = true;
                            range.setStart(entry.range.startContainer, Math.max(0, entry.range.startOffset + from - offset));
                        }
                        if (isStartSet && to <= entry.range.startOffset + offset + length) {
                            isSet = true;
                            range.setEnd(entry.range.startContainer, Math.max(0, entry.range.startOffset + to - offset));
                            if (entry.isNew) cleanBrowserRange(entry.range);
                            break;
                        }
                    } else {
                        if (!isStartSet && from === offset) {
                            isStartSet = true;
                            range.setStart(entry.range.startContainer, entry.range.startOffset);
                        }
                        if (!isStartSet && to === offset) {
                            isSet = true;
                            range.setEnd(entry.range.endContainer, entry.range.endOffset);
                        }
                    }
                    offset += length;
                    if (entry.isNew) cleanBrowserRange(entry.range);
                }
                if (!isSet) {
                    loglevel_default().debug(`Can't create range from content, truncating it to the bounds of the range`);
                    if (!isStartSet && from <= offset) {
                        range.setStart(subRange.startContainer, subRange.startOffset);
                        isStartSet = true;
                    }
                    if (isStartSet && to <= offset) {
                        range.setEnd(subRange.endContainer, subRange.endOffset);
                        isSet = true;
                    }
                }
                if (!isSet) {
                    loglevel_default().warn(`Invalid range interval, isStartSet: ${isStartSet}, from: ${from}, to: ${to}`);
                    cleanBrowserRange(range);
                }
                return isSet ? range : null;
            }
            DOMTextContentRangeExtractor.rangeFromContent = rangeFromContent;
        })(DOMTextContentRangeExtractor || (DOMTextContentRangeExtractor = {}));
        function drawDOMRect(rect, color = "green") {
            const div = document.createElement("div");
            div.style.pointerEvents = "none";
            div.style.boxSizing = "border-box";
            div.style.border = `1px solid ${color}`;
            div.style.height = `${rect.bottom - rect.top}px`;
            div.style.width = `${rect.right - rect.left}px`;
            div.style.position = "fixed";
            div.style.top = `${rect.top}px`;
            div.style.left = `${rect.left}px`;
            document.body.append(div);
            return div;
        }
        function debug() {
            var _a;
            const debug = {};
            debug.drawDOMRect = drawDOMRect;
            __webpack_require__.g.grazie = Object.assign((_a = __webpack_require__.g.grazie) !== null && _a !== void 0 ? _a : {}, {
                debug,
                dom: {
                    textExtractor: DOMTextContentRangeExtractor
                }
            });
        }
        var BuildMode;
        (function(BuildMode) {
            BuildMode["PRODUCTION"] = "production";
            BuildMode["DEVELOPMENT"] = "development";
        })(BuildMode || (BuildMode = {}));
        const Environment = {
            mode: "production",
            isMocked: "false" === "true",
            version: "1.7.3",
            browser: undefined
        };
        const EDITOR_ID_ATTRIBUTE = "data-grazie-editor-id";
        const EDITOR_VALUE_BASED_DISABLING_ATTRIBUTES = {
            type: "hidden",
            "data-enable-grazie": "false",
            "data-enable-grammarly": "false"
        };
        const EDITOR_BOOLEAN_DISABLING_ATTRIBUTES = null && [ "readonly", "disabled" ];
        var MessageType;
        (function(MessageType) {
            MessageType[MessageType["TEXT_CHANGED"] = 0] = "TEXT_CHANGED";
            MessageType[MessageType["WINDOW_CHANGED"] = 1] = "WINDOW_CHANGED";
            MessageType[MessageType["SELECTION_CHANGED"] = 2] = "SELECTION_CHANGED";
            MessageType[MessageType["FOLDS_CHANGED"] = 3] = "FOLDS_CHANGED";
            MessageType[MessageType["SHIFTS_CHANGED"] = 4] = "SHIFTS_CHANGED";
            MessageType[MessageType["WRAPS_CHANGED"] = 5] = "WRAPS_CHANGED";
            MessageType[MessageType["TAB_SIZE_CHANGED"] = 6] = "TAB_SIZE_CHANGED";
            MessageType[MessageType["CHANGE_TEXT"] = 7] = "CHANGE_TEXT";
            MessageType[MessageType["SCROLL_TO"] = 8] = "SCROLL_TO";
            MessageType[MessageType["CHANGE_SELECTION"] = 9] = "CHANGE_SELECTION";
            MessageType[MessageType["RESET"] = 10] = "RESET";
            MessageType[MessageType["RESET_SELECTION"] = 11] = "RESET_SELECTION";
            MessageType[MessageType["EXTENSION_DISPOSED"] = 12] = "EXTENSION_DISPOSED";
        })(MessageType || (MessageType = {}));
        class Message {}
        function isMessage(message) {
            return message.type !== undefined && message.editorID !== undefined;
        }
        function hasEditorDisablingAttribute(editor) {
            const hasValueBasedDisablingAttributes = Object.entries(EDITOR_VALUE_BASED_DISABLING_ATTRIBUTES).some((([attribute, value]) => editor.getAttribute(attribute) === value));
            const hasBooleanDisabledAttributes = EDITOR_BOOLEAN_DISABLING_ATTRIBUTES.some((attribute => editor.hasAttribute(attribute)));
            return hasValueBasedDisablingAttributes || hasBooleanDisabledAttributes;
        }
        function isMessageWithMetaData(message) {
            return message.origin !== undefined && isMessage(message);
        }
        var BrokerOrigin;
        (function(BrokerOrigin) {
            BrokerOrigin[BrokerOrigin["EMBEDDED_PAGE"] = 1] = "EMBEDDED_PAGE";
            BrokerOrigin[BrokerOrigin["CONTENT_SCRIPT"] = 2] = "CONTENT_SCRIPT";
        })(BrokerOrigin || (BrokerOrigin = {}));
        class MessageBroker {
            isOutOfSync() {
                return this.outOfSync;
            }
            constructor(editorID, origin, anchor) {
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "origin", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "listeners", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new Map
                });
                Object.defineProperty(this, "syncChangesListeners", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: []
                });
                Object.defineProperty(this, "listener", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "observer", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "anchor", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "outOfSync", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: false
                });
                Object.defineProperty(this, "queue", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: []
                });
                this.editorID = editorID;
                this.origin = origin;
                if (anchor) {
                    this.anchor = anchor;
                } else {
                    const wrapper = document.querySelector(`grazie-wrapper > grazie-editor-wrapper[${EDITOR_ID_ATTRIBUTE}='${editorID}']`);
                    if (wrapper) {
                        this.anchor = wrapper.shadowRoot.querySelector("grazie-sync-anchor");
                    } else throw new Error("Editor not found for MessageBroker");
                }
                this.observer = new ResizeObserver((() => {
                    const orig = parseInt(this.anchor.dataset.origin || "0");
                    if (orig === 0 || orig === this.origin) return;
                    const messages = JSON.parse(this.anchor.dataset.messages || "[]");
                    const attrs = [ ...this.anchor.attributes ];
                    for (const attr of attrs) {
                        if (attr.name !== "style") {
                            this.anchor.removeAttribute(attr.name);
                        }
                    }
                    if (messages.length === 0) return;
                    this.outOfSync = true;
                    this.syncChangesListeners.forEach((listener => listener(false)));
                    for (const message of messages) {
                        if (isMessageWithMetaData(message)) {
                            if (message.origin === this.origin) throw new Error("Received wrong orig message");
                            if (message.editorID !== this.editorID) throw new Error("Received wrong editor message");
                            this.callEventListenersForMessage(message);
                        } else loglevel_default().warn("Received unknown message");
                    }
                    this.outOfSync = false;
                    this.syncChangesListeners.forEach((listener => listener(true)));
                }));
                this.listener = event => {
                    if (event.source !== window) return;
                    const message = event.data;
                    if (isMessageWithMetaData(message)) {
                        if (message.origin === this.origin) return;
                        if (message.editorID !== this.editorID) return;
                        this.callEventListenersForMessage(message);
                    }
                };
            }
            connect() {
                window.addEventListener("message", this.listener, false);
                this.observer.observe(this.anchor);
            }
            disconnect() {
                this.observer.disconnect();
                window.removeEventListener("message", this.listener, false);
            }
            callEventListenersForMessage(message) {
                var _a;
                const listeners = this.listeners.get(message.type);
                if (!listeners) return;
                listeners.forEach((listener => listener.callback(message)));
                for (let i = listeners.length - 1; i >= 0; i--) {
                    if ((_a = listeners[i].options) === null || _a === void 0 ? void 0 : _a.once) listeners.splice(i, 1);
                }
            }
            addEventListener(type, listener, options) {
                if (!this.listeners.has(type)) this.listeners.set(type, []);
                this.listeners.get(type).push({
                    callback: listener,
                    options
                });
            }
            removeEventListener(type, listener) {
                if (!this.listeners.has(type)) return;
                const listeners = this.listeners.get(type);
                const index = listeners.findIndex((l => l.callback === listener));
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            }
            addSyncListener(listener) {
                this.syncChangesListeners.push(listener);
            }
            removeSyncListener(listener) {
                const index = this.syncChangesListeners.indexOf(listener);
                if (index !== -1) {
                    this.syncChangesListeners.splice(index, 1);
                }
            }
            sendMessage(message) {
                const msg = message;
                msg.origin = this.origin;
                window.postMessage(msg, "*");
            }
            addMessageToSyncAnchorQueue(message) {
                const msg = message;
                msg.origin = this.origin;
                this.queue.push(msg);
            }
            isReadyToSyncAnchorMessageQueue() {
                return !this.anchor.hasAttribute("data-origin");
            }
            syncAnchorMessageQueue() {
                if (this.queue.length === 0) return;
                if (!this.isReadyToSyncAnchorMessageQueue()) {
                    throw new Error("Previous message not delivered yet!");
                }
                this.anchor.dataset.origin = this.origin.toString();
                this.anchor.dataset.messages = JSON.stringify(this.queue);
                this.queue = [];
                const width = parseInt(this.anchor.style.width);
                this.anchor.style.width = `${width >= 5 ? 1 : width + 1}px`;
            }
        }
        class ChangeTextMessage extends Message {
            constructor(editorID, from, to, replacement, templateFrom, templateTo) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.CHANGE_TEXT
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "from", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "to", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "replacement", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "templateFrom", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "templateTo", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.from = from;
                this.to = to;
                this.replacement = replacement;
                this.templateFrom = templateFrom;
                this.templateTo = templateTo;
            }
        }
        class FoldsChangedMessage extends Message {
            constructor(editorID, change, folds) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.FOLDS_CHANGED
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "change", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "folds", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.change = change;
                this.folds = folds;
            }
        }
        class ResetMessage extends Message {
            constructor(editorID) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.RESET
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
            }
        }
        class ScrollToMessage extends Message {
            constructor(editorID, scrollToTextOffset) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.SCROLL_TO
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "scrollToTextOffset", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.scrollToTextOffset = scrollToTextOffset;
            }
        }
        class SelectionInfo {
            constructor(offset, length) {
                Object.defineProperty(this, "offset", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "length", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.offset = offset;
                this.length = length;
            }
        }
        class SelectionChangedMessage extends Message {
            constructor(editorID, info) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.SELECTION_CHANGED
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "info", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.info = info;
            }
        }
        class ShiftsChangedMessage extends Message {
            constructor(editorID, change, shifts, rangeToRemove) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.SHIFTS_CHANGED
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "change", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "shifts", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "rangeToRemove", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.change = change;
                this.shifts = shifts;
                this.rangeToRemove = rangeToRemove;
            }
        }
        class TabSizeChangedMessage extends Message {
            constructor(editorID, tabSize) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.TAB_SIZE_CHANGED
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "tabSize", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.tabSize = tabSize;
            }
        }
        class TextChangedMessage extends Message {
            constructor(editorID, changeType, from, to, changes) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.TEXT_CHANGED
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "changeType", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "from", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "to", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "changes", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.changeType = changeType;
                this.from = from;
                this.to = to;
                this.changes = changes;
            }
        }
        class WindowChangedMessage extends Message {
            constructor(editorID, windowTextOffsetStart, windowTextOffsetEnd) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.WINDOW_CHANGED
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "windowTextOffsetStart", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "windowTextOffsetEnd", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.windowTextOffsetStart = windowTextOffsetStart;
                this.windowTextOffsetEnd = windowTextOffsetEnd;
            }
        }
        class WrapsChangedMessage extends Message {
            constructor(editorID, wraps) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: MessageType.WRAPS_CHANGED
                });
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "wraps", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.wraps = wraps;
            }
        }
        class EmbeddedEditor {
            constructor(editorID, editor) {
                Object.defineProperty(this, "editorID", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "editor", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "broker", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.editorID = editorID;
                this.editor = editor;
                this.broker = new MessageBroker(editorID, BrokerOrigin.EMBEDDED_PAGE, editor);
                this.broker.connect();
                this.broker.addEventListener(MessageType.CHANGE_TEXT, (message => {
                    const changes = message;
                    this.onChangeTextRequest(changes.from, changes.to, changes.replacement, changes.templateFrom, changes.templateTo);
                }));
                this.broker.addEventListener(MessageType.SCROLL_TO, (message => {
                    this.onScrollToRequest(message.scrollToTextOffset);
                }));
                this.broker.addEventListener(MessageType.CHANGE_SELECTION, (message => {
                    const actualMessage = message;
                    this.onChangeSelectionRequest(actualMessage.from, actualMessage.to);
                }));
                this.broker.addEventListener(MessageType.RESET_SELECTION, (() => {
                    this.onResetSelectionRequest();
                }));
            }
            textChanged(type, from, to, changes) {
                this.broker.addMessageToSyncAnchorQueue(new TextChangedMessage(this.editorID, type, from, to, changes));
            }
            selectionChanged(info) {
                this.broker.addMessageToSyncAnchorQueue(new SelectionChangedMessage(this.editorID, info));
            }
            windowChanged(startTextOffset, endTextOffset) {
                this.broker.addMessageToSyncAnchorQueue(new WindowChangedMessage(this.editorID, startTextOffset, endTextOffset));
            }
            foldsChanged(change, folds) {
                this.broker.addMessageToSyncAnchorQueue(new FoldsChangedMessage(this.editorID, change, folds));
            }
            shiftsChanged(change, shifts, rangeToRemove) {
                this.broker.addMessageToSyncAnchorQueue(new ShiftsChangedMessage(this.editorID, change, shifts, rangeToRemove));
            }
            wrapsChanged(wraps) {
                this.broker.addMessageToSyncAnchorQueue(new WrapsChangedMessage(this.editorID, wraps));
            }
            tabSizeChanged(tabSize) {
                this.broker.addMessageToSyncAnchorQueue(new TabSizeChangedMessage(this.editorID, tabSize));
            }
            reset() {
                this.broker.addMessageToSyncAnchorQueue(new ResetMessage(this.editorID));
            }
            detach() {
                this.broker.disconnect();
            }
        }
        class RedditLexicalEditor extends EmbeddedEditor {
            constructor(editorID, editor) {
                super(editorID, editor);
                Object.defineProperty(this, "lexicalEditor", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.lexicalEditor = editor["__lexicalEditor"];
                if (!this.lexicalEditor) {
                    throw Error("Lexical editor not found inside Editor element");
                }
            }
            onResetSelectionRequest() {
                this.lexicalEditor._editorState._selection = null;
                this.broker.sendMessage(new SelectionChangedMessage(this.editorID, undefined));
            }
            onChangeTextRequest() {}
            onScrollToRequest() {}
            onChangeSelectionRequest() {}
        }
        const word = "[a-fA-F\\d:]";
        const boundry = options => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
        const v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
        const v6segment = "[a-fA-F\\d]{1,4}";
        const v6 = `\n(?:\n(?:${v6segment}:){7}(?:${v6segment}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:${v6segment}:){5}(?::${v4}|(?::${v6segment}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:${v6segment}:){4}(?:(?::${v6segment}){0,1}:${v4}|(?::${v6segment}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:${v6segment}:){3}(?:(?::${v6segment}){0,2}:${v4}|(?::${v6segment}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:${v6segment}:){2}(?:(?::${v6segment}){0,3}:${v4}|(?::${v6segment}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:${v6segment}:){1}(?:(?::${v6segment}){0,4}:${v4}|(?::${v6segment}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
        const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
        const v4exact = new RegExp(`^${v4}$`);
        const v6exact = new RegExp(`^${v6}$`);
        const ipRegex = options => options && options.exact ? v46Exact : new RegExp(`(?:${boundry(options)}${v4}${boundry(options)})|(?:${boundry(options)}${v6}${boundry(options)})`, "g");
        ipRegex.v4 = options => options && options.exact ? v4exact : new RegExp(`${boundry(options)}${v4}${boundry(options)}`, "g");
        ipRegex.v6 = options => options && options.exact ? v6exact : new RegExp(`${boundry(options)}${v6}${boundry(options)}`, "g");
        const ip_regex = ipRegex;
        var LocationUtils;
        (function(LocationUtils) {
            const HOSTNAME_REGEX = /^(\*\.)?([\p{L}0-9]+(-[\p{L}0-9]+)*\.)+\p{L}[\p{L}0-9]+$/u;
            function isFileProtocol(protocol) {
                return protocol === "file:";
            }
            LocationUtils.isFileProtocol = isFileProtocol;
            function getPageDisplayHostnameFromUrl(url) {
                if (url.hostname) {
                    return url.hostname;
                }
                if (url.protocol === "about:") {
                    return url.pathname;
                }
                return "";
            }
            LocationUtils.getPageDisplayHostnameFromUrl = getPageDisplayHostnameFromUrl;
            function isValidHostname(url) {
                return HOSTNAME_REGEX.test(url) || ip_regex({
                    exact: true
                }).test(url) || url === "localhost";
            }
            LocationUtils.isValidHostname = isValidHostname;
            function getPageDisplayHostname(hints) {
                if (hints.url) {
                    return getPageDisplayHostnameFromUrl(hints.url);
                }
                if (hints.location) {
                    return getPageDisplayHostnameFromUrl(new URL(hints.location.toString()));
                }
                throw new Error("getPageDisplayName was called without hints!");
            }
            LocationUtils.getPageDisplayHostname = getPageDisplayHostname;
            function getHostNameFromWindowLocation() {
                return getPageDisplayHostnameFromUrl(new URL(window.location.toString()));
            }
            LocationUtils.getHostNameFromWindowLocation = getHostNameFromWindowLocation;
        })(LocationUtils || (LocationUtils = {}));
        const EMPTY_PATH = [];
        function findInObject(obj, predicate, options = {}) {
            const visited = new Set;
            const results = [];
            const {maxDepth = 10, terminateOnFirstResult = false, calculatePath = true, maxArrayLengthToProcess = 1e6} = options;
            const rec = (key, parent, value, path, depth = 0) => {
                if (key === "prototype" || value instanceof Window || depth > maxDepth) return false;
                const currentPath = calculatePath ? [ ...path, key ] : EMPTY_PATH;
                if (predicate(key, value)) {
                    results.push({
                        path: currentPath,
                        parent,
                        value
                    });
                    return terminateOnFirstResult;
                }
                if (value !== null && value !== undefined && !visited.has(value)) {
                    visited.add(value);
                    if (Array.isArray(value)) {
                        if (value.length < maxArrayLengthToProcess) {
                            for (const [index, val] of value.entries()) {
                                if (rec(index, value, val, currentPath, depth + 1)) return true;
                            }
                        }
                    } else if (value instanceof Object) {
                        for (const prop of Object.getOwnPropertyNames(value)) {
                            if (rec(prop, value, value[prop], currentPath, depth + 1)) return true;
                        }
                    }
                }
                return false;
            };
            try {
                for (const prop of Object.getOwnPropertyNames(obj)) {
                    if (rec(prop, obj, obj[prop], [])) break;
                }
            } catch (error) {
                loglevel_default().error("Get error while traversing object:", error);
            }
            return results;
        }
        class GoogleDocsEditor extends EmbeddedEditor {
            constructor(editorID, editor) {
                super(editorID, editor);
                Object.defineProperty(this, "isDisposed", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: false
                });
                GoogleDocsEditor.KIX_APP = window["KX_kixApp"];
                if (!GoogleDocsEditor.KIX_APP) {
                    throw new Error("KX_kixApp not found on the page");
                }
                GoogleDocsEditor.GOOGLE_DOCS_EDITORS_IN_USE_COUNTER++;
                if (!GoogleDocsEditor.KIX_ATTRIBUTES && !GoogleDocsEditor.IS_FAILED_TO_FIND_KIX_ATTRIBUTES) {
                    const result = findInObject(GoogleDocsEditor.KIX_APP, ((key, value) => key === "kix-sgc" && value && "setValue" in value && "getValue" in value), {
                        maxDepth: 90,
                        terminateOnFirstResult: true,
                        calculatePath: false,
                        maxArrayLengthToProcess: 5
                    });
                    if (result.length > 0) {
                        GoogleDocsEditor.KIX_ATTRIBUTES = result[0].parent;
                    } else {
                        GoogleDocsEditor.IS_FAILED_TO_FIND_KIX_ATTRIBUTES = true;
                        loglevel_default().error("Failed to find kix attributes");
                    }
                }
                if (GoogleDocsEditor.KIX_ATTRIBUTES) {
                    if (!GoogleDocsEditor.ATTRIBUTES_REGISTRY.completion) {
                        const attribute = GoogleDocsEditor.KIX_ATTRIBUTES["docs-eawsc"];
                        GoogleDocsEditor.ATTRIBUTES_REGISTRY.completion = {
                            attribute,
                            initial: attribute.getValue()
                        };
                        this.updateGoogleDocsAttribute(GoogleDocsEditor.ATTRIBUTES_REGISTRY.completion, false);
                    }
                    if (!GoogleDocsEditor.ATTRIBUTES_REGISTRY.spellcheck) {
                        const attribute = GoogleDocsEditor.KIX_ATTRIBUTES["kix-ssc2"];
                        GoogleDocsEditor.ATTRIBUTES_REGISTRY.spellcheck = {
                            attribute,
                            initial: attribute.getValue()
                        };
                        this.updateGoogleDocsAttribute(GoogleDocsEditor.ATTRIBUTES_REGISTRY.spellcheck, false);
                    }
                    if (!GoogleDocsEditor.ATTRIBUTES_REGISTRY.grammar) {
                        const attribute = GoogleDocsEditor.KIX_ATTRIBUTES["kix-sgc"];
                        GoogleDocsEditor.ATTRIBUTES_REGISTRY.grammar = {
                            attribute,
                            initial: attribute.getValue()
                        };
                        this.updateGoogleDocsAttribute(GoogleDocsEditor.ATTRIBUTES_REGISTRY.grammar, false);
                    }
                }
            }
            updateGoogleDocsAttribute(attribute, value) {
                if (attribute && attribute.attribute.getValue() !== value) {
                    attribute.attribute.setValue(value);
                }
            }
            resetGoogleDocsAttribute(attribute) {
                if (attribute && attribute.initial !== attribute.attribute.getValue()) {
                    attribute.attribute.setValue(attribute.initial);
                }
            }
            detach() {
                if (this.isDisposed) return;
                super.detach();
                GoogleDocsEditor.GOOGLE_DOCS_EDITORS_IN_USE_COUNTER--;
                if (GoogleDocsEditor.GOOGLE_DOCS_EDITORS_IN_USE_COUNTER === 0) {
                    this.resetGoogleDocsAttribute(GoogleDocsEditor.ATTRIBUTES_REGISTRY.completion);
                    this.resetGoogleDocsAttribute(GoogleDocsEditor.ATTRIBUTES_REGISTRY.spellcheck);
                    this.resetGoogleDocsAttribute(GoogleDocsEditor.ATTRIBUTES_REGISTRY.grammar);
                }
                this.isDisposed = true;
            }
            onChangeSelectionRequest() {}
            onChangeTextRequest() {}
            onResetSelectionRequest() {}
            onScrollToRequest() {}
        }
        Object.defineProperty(GoogleDocsEditor, "GOOGLE_DOCS_EDITORS_IN_USE_COUNTER", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(GoogleDocsEditor, "IS_FAILED_TO_FIND_KIX_ATTRIBUTES", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(GoogleDocsEditor, "ATTRIBUTES_REGISTRY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                completion: undefined,
                spellcheck: undefined,
                grammar: undefined
            }
        });
        var _a;
        function createEmbeddedEditorIfNeeded(editorID, editor) {
            const hostname = LocationUtils.getHostNameFromWindowLocation();
            if (hostname.match(/.*\.reddit\.com/) && editor.getAttribute("data-lexical-editor")) {
                return new RedditLexicalEditor(editorID, editor);
            }
            if (editor.classList.contains("kix-page-paginated")) {
                return new GoogleDocsEditor(editorID, editor);
            }
        }
        const editors = new Map;
        function updateEmbeddedEditors() {
            const candidates = document.querySelectorAll(`[${EDITOR_ID_ATTRIBUTE}]`);
            const present = new Set;
            for (const candidate of candidates) {
                const editorID = candidate.getAttribute(EDITOR_ID_ATTRIBUTE);
                if (!editorID) throw Error("Editor ID not found on editor element");
                present.add(editorID);
                if (!editors.has(editorID)) {
                    try {
                        const newEditor = createEmbeddedEditorIfNeeded(editorID, candidate);
                        if (newEditor) {
                            editors.set(editorID, newEditor);
                        }
                    } catch (e) {
                        loglevel_default().error("Error while creating editor", e);
                    }
                }
            }
            for (const editorID of editors.keys()) {
                if (!present.has(editorID)) {
                    const toDelete = editors.get(editorID);
                    toDelete.detach();
                    editors.delete(editorID);
                }
            }
        }
        if (Environment.mode === BuildMode.DEVELOPMENT) {
            debug();
        }
        __webpack_require__.g.grazie = Object.assign((_a = __webpack_require__.g.grazie) !== null && _a !== void 0 ? _a : {}, {
            version: Environment.version
        });
        const editorsUpdateInterval = setInterval(updateEmbeddedEditors, 1e3);
        const removeListenerController = new AbortController;
        window.addEventListener("message", (event => {
            if (event.source !== window) return;
            if (event.data && event.data.type === MessageType.EXTENSION_DISPOSED) {
                clearInterval(editorsUpdateInterval);
                for (const editorID of editors.keys()) {
                    editors.get(editorID).detach();
                }
                editors.clear();
                removeListenerController.abort();
            }
        }), {
            signal: removeListenerController.signal
        });
    })();
})();