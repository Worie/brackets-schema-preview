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
maxerr: 50, browser: true */
/*global $, define, brackets */


define(function (require, exports, module) {
  "use strict";

  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
      NodeDomain     = brackets.getModule("utils/NodeDomain"),
      EditorManager  = brackets.getModule("editor/EditorManager"),
      CommandManager = brackets.getModule("command/CommandManager"),
      Menus          = brackets.getModule("command/Menus"),
      Dialogs        = brackets.getModule("widgets/Dialogs"),
      DefaultDialogs = brackets.getModule("widgets/DefaultDialogs"),
      Strings        = brackets.getModule("strings"),
      Mustache       = brackets.getModule("thirdparty/mustache/mustache"),
      WorkspaceManager = brackets.getModule( 'view/WorkspaceManager' ),
      Resizer        =  brackets.getModule('utils/Resizer');

  var $schemaPreview = null;
  var parserDomain = new NodeDomain("schema-parser", ExtensionUtils.getModulePath(module, "node/SchemaParserDomain"));


  ExtensionUtils.loadStyleSheet(module,'./css/styles.css');

  function _getSelectedText() {
    // TODO: If no selected, get all content
    return EditorManager.getActiveEditor().getSelectedText(true);
  }

  function parseText(text) {
    return parserDomain.exec("getSchema", text);
  }

  function onParseRequest() {
    Resizer.show( $schemaPreview );
      parseText(_getSelectedText()).then(function (result) {
        var $uls = $schemaPreview.children("ul");
        $uls.off('click');
        $('#bracketsSchemaPreviewContents').html(objToHtmlList(result.elems));
        
        $uls = $("#bracketsSchemaPreviewContents ul");
        console.log($uls);
        $uls.on('click',function(){
          $(this).toggleClass("expanded");
        })
      });
  }
  
  function objToHtmlList(obj) {
    if (obj instanceof Array) {
        var ol = document.createElement('ul');
        for (var child in obj) {
            var li = document.createElement('li');
            li.appendChild(objToHtmlList(obj[child]));
            ol.appendChild(li);
        }
        return ol;
    }
    else if (obj instanceof Object && !(obj instanceof String)) {
        var ul = document.createElement('ul');
        for (var child in obj) {
            var li = document.createElement('li');
            if (typeof obj[child] != 'string')
              li.appendChild(document.createTextNode(child + ": "));
            li.appendChild(objToHtmlList(obj[child]));
            ul.appendChild(li);
        }
        return ul;
    }
    else {
        return document.createTextNode(obj);
    }
}

  var PARSE_SCHEMA = "schema-parser.showSchema";
  CommandManager.register("Show Schema", PARSE_SCHEMA, onParseRequest);

  // Create a menu item bound to the command
  var fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
  fileMenu.addMenuItem(PARSE_SCHEMA, "Ctrl-Alt-Q");
  
  var $template = $(
        Mustache.render(require("text!html/menu_template.html"),
        {
          "Strings":Strings
        }));
        
        WorkspaceManager.createBottomPanel( 'worie.brackets-schema-parse.panel', $($template), 100 );
        $schemaPreview = $('#bracketsSchemaPreview');
        Resizer.show( $schemaPreview );
        $('#bracketsSchemaPreview .close').on('click', function(){
          Resizer.hide( $schemaPreview );
        });
}); 