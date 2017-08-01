'use babel';

import { CompositeDisposable } from 'atom';
import { TextEditor } from 'atom';

export default {

    config: {
        acolors: {
            title: 'Colors',
            type: 'object',
            properties: {
                enableThemes: {
                    title: 'Enable Themes',
                    description: 'Allows ui color shifting between file types',
                    type: 'boolean',
                    default: true
                },
                themeColors: {
                    title: 'Theme Colors',
                    description: 'Sets theme colors for specific file types (required format: ".filename:#FFFFFF")',
                    type: 'string',
                    default: '.css:#4285F4,.js:#45B062,.gfm:#45B062,.php:#DD4A4A'
                }
            }
        },
        btreeView: {
            title: 'Tree View',
            type: 'object',
            properties: {
                ahideGitStatus: {
                    title: 'Hide Git Status',
                    description: 'Removes any coloring in tree-view related to file status',
                    type: "string",
                    enum: ["Option Disabled", "Enabled [Dimmed]", "Enabled [Hidden]"],
                    default: "Option Disabled"
                },
                bhideInactiveFiles: {
                    title: "Distraction-Free Mode",
                    description: "Select a setting to minimize the opacity of inactive files",
                    type: "string",
                    enum: ["Option Disabled", "Enabled [Dark]", "Enabled [Light]"],
                    default: "Option Disabled"
                },
                cshowOpenFiles: {
                    title: "Always Show Open Files",
                    description: "Shows open files in Tree View regardless of Distraction-Free Mode setting",
                    type: "boolean",
                    default: false
                },
                dcompactHeaders: {
                    title: "Compact Headers",
                    description: "If left unchecked, headers will match the height of tabs",
                    type: "boolean",
                    default: false
                }
            }
        },
        cFontSize: {
          title: 'Font Size',
          description: 'Set the base font size for the UI',
          type: 'string',
          default: '12px'
        }
    },

    activate: function(state) {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateGrammar));
        this.subscriptions.add(atom.workspace.onDidChangeActiveTextEditor(this.updateGrammar));
        this.subscriptions.add(atom.workspace.onDidAddPaneItem(this.treeListAddOpen));
        this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(this.treeListRemoveOpen));

        this.updateGrammar();

        atom.packages.activatePackage('tree-view').then(function(treeViewPkg){
            this.treeView = treeViewPkg.mainModule.treeView;
            var treeListUpdateOpen = function(){
                var items = atom.workspace.getPaneItems();
                for (i = 0; i < items.length; i++) {
                    var item = items[i];
                    if( item instanceof TextEditor && this.treeView ){
                        var filePath = item.getPath();
                        var entry = this.treeView.entryForPath(filePath);
                        if( entry ){
                            entry.classList.add('open');
                        }
                    }
                }
            };
            treeListUpdateOpen();
        });

        var Options = require('./options');
        Options.apply();
    },

    updateGrammar: function(){
        var activeTextEditor = atom.workspace.getActiveTextEditor();
        if (activeTextEditor !== undefined){
            document.body.setAttribute('active-grammar', activeTextEditor.getGrammar().scopeName);
            activeTextEditor.onDidChangeGrammar(function(){
                document.body.setAttribute('active-grammar', activeTextEditor.getGrammar().scopeName);
            });
        } else {
            document.body.removeAttribute('active-grammar');
            document.querySelectorAll('.tree-view .selected').forEach(function(selected){
              selected.classList.remove('selected')
            })
        }
    },

    treeListAddOpen: function(event){
        if( event.item instanceof TextEditor && this.treeView ){
            var filePath = event.item.getPath();
            var entry = this.treeView.entryForPath(filePath);
            if( entry ){
                entry.classList.add('open');
            }
        }
    },

    treeListRemoveOpen: function(event){
        if( event.item instanceof TextEditor && this.treeView ){
            var filePath = event.item.getPath();
            var entry = this.treeView.entryForPath(filePath);
            if( entry ){
                entry.classList.remove('open');
            }
        }
    },

    deactivate: function() {
        this.subscriptions.dispose();
    }

};