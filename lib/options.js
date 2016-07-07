'use babel';

export default {
    apply: function(){
        root = document.documentElement

        var hideInactiveFiles = function(hideStatus){
            console.log( hideStatus );
            if( hideStatus == 'Enabled [Dark]' ){
                root.classList.add('hide-idle-tree-items');
                root.classList.remove('light-tree-on-hover');
            }
            else if( hideStatus == 'Enabled [Light]' ){
                root.classList.add('hide-idle-tree-items');
                root.classList.add('light-tree-on-hover');
            }
            else {
                root.classList.remove('hide-idle-tree-items');
                root.classList.remove('light-tree-on-hover');
            }
        }

        hideInactiveFiles(atom.config.get('climate-ui.hideInactiveFiles'));

        atom.config.onDidChange( 'climate-ui.hideInactiveFiles', function(){
            hideInactiveFiles(atom.config.get('climate-ui.hideInactiveFiles'));
        });


        var hideGitStatus = function(boolean){
            if( boolean ){
                root.classList.add('hide-git-status-in-tree-view');
            } else {
                root.classList.remove('hide-git-status-in-tree-view');
            }
        }

        hideGitStatus(atom.config.get('climate-ui.hideGitStatus.hideStatus'));

        atom.config.onDidChange( 'climate-ui.hideGitStatus.hideStatus', function(){
            hideGitStatus(atom.config.get('climate-ui.hideGitStatus.hideStatus'));
        });

        var isHexCode = function(hexCode){
            return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hexCode);
        }

        var writeCustomStyles = function(colors){
            colors = colors.split(',');

            var custom = '';

            for (var i = 0; i < colors.length; i++) {
                color = colors[i];
                color = color.split(':');

                if( color.length == 2 && color[0] && color[1] && isHexCode(color[1]) ){
                    custom += '.color-to-filetype("'+color[0]+'", '+color[1]+');\n';
                }
            }

            fs.writeFile(`${__dirname}/../styles/color-variances.less`, custom, 'utf8', () => {});
        }

        writeCustomStyles(atom.config.get('climate-ui.themeColors'));

        atom.config.onDidChange( 'climate-ui.themeColors', function(){
            writeCustomStyles(atom.config.get('climate-ui.themeColors'));
        });

    }
};