function Markon(selector){
       if(!selector) selector = '.markon';
       this.elements = $(selector);
       if(!Markon.elements){
         //Markon.elements = $(selector);
         Markon.elements = this.elements;
       }else{
         Markon.elements.add(this.elements);
       }
       
       this.start();
   }
   
   function markon(selector){
       return new Markon(selector);
   }
   
   Markon.styles = {bold:{start:'{[',end:']}',css:'font-weight: bold'},italic:{start:'{/',end:'/}',css:'font-style: italic'},strike:{start:'{-',end:'-}',css:'text-decoration: line-through'},underline:{start:'{_',end:'_}',css:'text-decoration: underline'},link:{start:'{#=URL',end:'#}'}};
   Markon.selected = null;
   Markon.elements = null;
   
   Markon.prototype.to = function(style){
       for(var k in this.elements){
           Markon.to(style,this.elements[k])
       }
   }
    
   Markon.to = function(style,markon){
       if(!markon) markon = Markon.selected;
       
       var selection = window.getSelection();
       var range = selection.getRangeAt(0);
       var start = range.startOffset;
       var end = range.endOffset;
       
       var format = Markon.styles[style];
       var text = markon.text();
       var a = text.slice(0,start);
       var b = text.slice(start,end);
       var c = text.slice(end);
       
       markon.text(a+format.start+b+format.end+c);
   }
   
   Markon.getHtml = function(el){
        var text = $(el).text();
        var c,url,link_pattern;
        
        if('link' in Markon.styles){
            link_pattern = Markon.styles.link.start.toLowerCase().split('url').join('');
            alert(link)
        }
        
        for(var k in Markon.styles){
            if(k == 'link'){
                url = 
                text = Markon.replaceAll(text,c.start,'<a>');
                text = Markon.replaceAll(text,c.end,'</a>');
            }else{
                c = Markon.styles[c];
                text = Markon.replaceAll(text,c.start,'<span style="'+c.css+'">');
                text = Markon.replaceAll(text,c.end,'</span>');   
            }
        }

        return text;
   }
   
   Markon.prototype.get = function(){
      return Markon.get(this.elements);
   }
   
   Markon.extend = Markon.prototype.extend = function(key,css,start,end){
     if(jQuery.type(key) == 'object'){
         var ckey,ccss='',cstart,cend;
         for(var k in key){
            if(k == 'key') ckey = key;
            else if(k == 'start') cstart = key;
            else if(k == 'end') cend = key;
            else if(k == 'css') ccss = key;
         }
         
         if(!ckey || !cstart) return false;
         if(!cend) cend = Markon.replaceAll(cstart,'{','').'}';
         
         Markon.styles[ckey] = {start:cstart,end:cend,css:ccss};   
     }else{
        Markon.styles[key] = {start:start,end:end,css:css};   
     }
   }
   
   Markon.get = function(elements){
       if(!elements) elements = Markon.elements;
       var array = new Array();
       var text;
       elements.each(function(){
          array.push(Markon.getHtml(this));
       });
       
       return array;
   }
   
   Markon.replaceAll = function(str,find,replace){
       return str.split(find).join(replace);
   }
   
   Markon.prototype.start = function(elements){
      Markon.start(this.elements);
   }
   
   Markon.start = function(elements){
       if(!elements) elements = Markon.elements;
       var _this;
       elements.each(function(i){
           _this=$(this);
          _this.attr('contenteditable','true');
          _this.attr('data-markon-id',i);
          _this.on('focus',function(){
            Markon.selected = $(this);
          })
       });
   }
   
   Markon.prototype.convert = function(){
       Markon.convert(this.elements);
   }
   
   Markon.convert = function(elements){
       if(!elements) elements = Markon.elements;
       var _this;
       console.log(elements)
        elements.each(function(){
            _this = $(this);
            text = Markon.getHtml(_this);
            _this.html(text);
        });
   }