'use babel';

import { CompositeDisposable } from 'atom';
import { TextEditor } from 'atom';

export default {

    config: {
        acolors: {
            title: 'Colors',
            type: 'object',
            properties: {
                themeColors: {
                    title: 'Theme Colors',
                    description: 'Sets theme colors for specific file types (required format: ".filename:#FFFFFF")',
                    type: 'string',
                    default: '.css:#4285F4,.js:#45B062,.gfm:#45B062,.php:#DD4A4A'
                },
            }
        },
        btreeView: {
            title: 'Tree View',
            type: 'object',
            properties: {
                ahideInactiveFiles: {
                    title: "Distraction-Free Mode",
                    description: "Select a setting to minimize the opacity of inactive files",
                    type: "string",
                    enum: ["Disabled", "Enabled [Dark]", "Enabled [Light]"],
                    default: "Disabled"
                },
                bhideGitStatus: {
                    title: 'Hide Git Status',
                    description: 'Removes any coloring in tree-view related to file status',
                    type: "string",
                    enum: ["Disabled", "Dimmed", "Hidden"],
                    default: "Disabled"
                }
            }
        },
    },

    activate: function(state) {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateGrammar));
        this.subscriptions.add(atom.workspace.onDidAddPaneItem(this.treeListAddOpen));
        this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(this.treeListRemoveOpen));

        this.updateGrammar();

        atom.packages.activatePackage('tree-view').then(function(treeViewPkg){
            this.treeView = treeViewPkg.mainModule.createView();
            var treeListUpdateOpen = function(){
                var items = atom.workspace.getPaneItems();
                for (i = 0; i < items.length; i++) {
                    var item = items[i];
                    var filePath = item.getPath();
                    var entry = this.treeView.entryForPath(filePath);
                    if( entry ){
                        entry.classList.add('open');
                    }
                }
            };
            treeListUpdateOpen();
            this.treeView.on('click', '.directory', function(){
                treeListUpdateOpen();
            });
        });

        var Options = require('./options');
        Options.apply();
    },

    updateGrammar: function(){
        var activeItem = atom.workspace.getActiveTextEditor();
        if( activeItem !== undefined ){
            document.body.setAttribute('active-grammar', activeItem.getGrammar().scopeName);
            activeItem.onDidChangeGrammar(function(){
                document.body.setAttribute('active-grammar', activeItem.getGrammar().scopeName);
            });
        } else {
            document.body.removeAttribute('active-grammar');
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