if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
}
if(!window.console){
    var div = document.createElement('div');
    div.id = 'console';
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.right = '0';
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.border = '1px solid blue';
    document.body.appendChild(div);
    window.console = function(c){
        var consoleDiv = document.getElementById('console');
        var div = document.createElement('div');
        div.id = 'console';
        div.style.position = 'fixed';
        div.style.top = '50%';
        div.style.right = '0';
        div.style.width = '200px';
        div.style.height = '200px';
        div.style.border = '1px solid blue';
        div.innerHTML = c;
        consoleDiv.appendChild(div);
    }

}
function compareCSS(elem,elem2) {

  var cs = window.getComputedStyle(elem,null);
  var cs2 = window.getComputedStyle(elem2,null);
  var len = cs.length;
  var diff = [];
  for (var i=0;i<len;i++) {
 
    var styleName = cs[i];
    var style = cs.getPropertyValue(styleName);
    var style2 = cs2.getPropertyValue(styleName);
        //console.info(style, style2);
    if(style !== style2){
        //console.info(style, style2);
        diff.push({'styleName':styleName,'style1':style, 'style2':style2});
    }
    
  }
  console.info(diff);
  return diff;
}

function loadCSS(){
    var head = document.getElementsByTagName("head")[0];
    var fileref = document.createElement("style");
    fileref.setAttribute("type", "text/css");
    fileref.innerHTML = '.compareWrapper { position:absolute;top:0;left:10%; background-color: rgba(100,100,100,0.5);z-index:1000;}' +
                        '.result table { border: 1px solid; border-spacing: 0px;}'
                        ;
    head.appendChild(fileref);
}

//create show panel
function showPanel(){
    var div = document.createElement('div');
    div.innerHTML = '<label for="comparecss-elm1">elm1</label><input id="comparecss-elm1" name="elm1"/>' + '<span class="target1">target1</span><span class="target1-elm"></span>' + 
                    '<br/><label for="comparecss-elm2">elm2</label><input id="comparecss-elm2" name="elm2"/>' + '<span class="target2">target2</span><span class="target2-elm"></span>' + 
                    '<br/><button id="comparecss-compare">compare</button>'+
                    '<button id="comparecss-clear">clear</button>'+
                    '<div class="result"></div>'
                    ;
    div.className = 'compareWrapper';
    div = document.body.appendChild(div);
    div.setAttribute('draggable',true);
    //div.setAttribute('ondragstart','return dragStart(event)');
    var compareBtn = div.querySelector('#comparecss-compare');
    var clearBtn = div.querySelector('#comparecss-clear');
    var input1 = div.querySelector('#comparecss-elm1');
    var input2 = div.querySelector('#comparecss-elm2');
    var resultTable = div.querySelector('.result');
    var target1 = div.querySelector('.target1');
    var target2 = div.querySelector('.target2');
    var target1Elm = div.querySelector('.target1-elm');
    var target2Elm = div.querySelector('.target2-elm');
    var elm1 = null, elm2 = null;

    function findTarget1(event){
        if(event.target.className == 'target1'){
            return;
        }
        console.info('elm1:'+event.target);
        elm1 = event.target;
        target1Elm.innerHTML = getElementName(event.target);
        document.body.removeEventListener('click',findTarget1);
    }
    function findTarget2(event){
        if(event.target.className == 'target2'){
            return;
        }
        console.info('elm2:'+event.target);
        elm2 = event.target;
        target2Elm.innerHTML = getElementName(event.target);
        document.body.removeEventListener('click',findTarget2);
    }
    target1.addEventListener('click',function(){
        document.body.addEventListener('click',findTarget1);
    });

    target2.addEventListener('click',function(){
        document.body.addEventListener('click',findTarget2);
    });

    clearBtn.addEventListener('click',function(){
        elm1 = elm2 = null;
        target1Elm.innerHTML = target2Elm.innerHTML = '';
        input1.value = input2.value = '';
        resultTable.innerHTML = '';
    });


    function getElementName(elm){
        var s = elm.tagName;
        if(elm.id) s += ' #'+elm.id;
        if(elm.className) s += ' .'+ elm.className.split(' ').join('.');
        return s;
    }
    compareBtn.addEventListener('click',function(){
        console.info(elm1,input1,elm2,input2);
        if((elm1 || (input1 && input1.value) ) && (elm2 || (input2 && input2.value) ) ){
            var element1 = elm1 || document.querySelector(input1.value);
            var element2 = elm2 || document.querySelector(input2.value);
            if(element1 && element2){
                console.info(element1,element2);
                var diff = compareCSS(element1,element2); 
                var element1Name = input1.value || getElementName(elm1);
                var element2Name = input2.value || getElementName(elm2); 
                var resultHTML = '<table cellpadding="5" cellspacing="5" border="1">';
                resultHTML += '<tr><th>diff</th><th>'+element1Name+'</th><th>'+element2Name+'</th></tr>';
                if(!diff.length){
                    resultHTML += '<tr>';
                    resultHTML += '<td colspan=3>elements are the same </td>';
                    resultHTML += '</tr>';
                }else{
                    for (var i = 0; i < diff.length; i++) {
                        resultHTML += '<tr>';
                        resultHTML += '<td>'+ diff[i].styleName+'</td>';
                        resultHTML += '<td>'+ diff[i].style1+'</td>';
                        resultHTML += '<td>'+ diff[i].style2+'</td>';
                        resultHTML += '</tr>';
                    };
                }
                resultHTML += '</table>';
                resultTable.innerHTML = resultHTML;
            }else{
                resultTable.innerHTML = 'element not found';
            }
        }
    })
}

loadCSS();
showPanel();

//create function to let user select two elements
