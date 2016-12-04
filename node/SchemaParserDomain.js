/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global, brackets*/

(function () {
    "use strict";
  
    var SchemaParser = require("semantic-schema-parser");

    function getSchema(text, cb) {
      var onParse = function (msg) {
          cb(null, msg);
        return JSON.stringify(msg);
      };
    
    return SchemaParser
        .parseContent(text, onParse);
    };
  
    /**
     * 
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("schema-parser")) {
          domainManager.registerDomain("schema-parser", {major: 0, minor: 1});
        }
      domainManager.registerCommand(
        "schema-parser",
        "getSchema",
        getSchema,
        true,
        "checks"
//        [{name: "total", // TODO
//            type: "object",
//            description: "True to return total memory, false to return free memory"}],
//        [{name: "Promise", // return values
//            type: "object",
//            description: "Pastebin obj"}]
      );
    }
    
    exports.init = init;
}());