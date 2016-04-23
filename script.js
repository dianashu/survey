$(document).ready(function(){
  
  var url='test_survey.json';
  
  $.getJSON(url, function(data){ 
    var surveyHTML='<fieldset id="S1" class="current">';
    var s=1;
    $.each(data,function(i,question){
      if(question.type==="SDesc"){ //Type:Section Description
        surveyHTML+='<div><label>'+question.description+'</label></div>';
      }else if(question.type==="SEnd"){ //Type: Section End
        if(s===1){
          surveyHTML+='<div><button type="button" class="next_button">Next</button></div>';
        }else{
          surveyHTML+='<div><button type="button" class="prev_button">Previous</button><button type="button" class="next_button">Next</button></div>';
        }
        surveyHTML+='</fieldset>';
        s++;
        surveyHTML+='<fieldset id="S'+s+'">';
      }else{ //Type: Question
        surveyHTML+='<div class="'+question.visible+'"><label>'+question.description+'</label><br>';
           
        if(question.type==="SText"){
          surveyHTML+='<input type="text" name="Q'+i+'"></div>';
        }else if(question.type==="LText"){
          surveyHTML+='<textarea name="Q'+i+'"></textarea></div>';
        }else if(question.type==="SMCQ"){
          $.each(question.choices,function(c,choice){
            surveyHTML+='<input type="radio" value='+c+' name="Q'+i+'"><label>'+choice+'</label>';
          });          
          surveyHTML+='</div>';
        }else if(question.type==="MMCQ"){
          $.each(question.choices,function(c,choice){
            surveyHTML+='<input type="checkbox" value='+c+' name="Q'+i+'"><label>'+choice+'</label>';
          });
          surveyHTML+='</div>';
        }else if(question.type==="Menu"){
          surveyHTML+='<select name="Q'+i+'">';
          $.each(question.choices,function(c,choice){
            surveyHTML+='<option value='+c+'">'+choice+'</option>';
          });
          surveyHTML+='</select></div>';
        }else if(question.type==="CSMCQ"){ //Control MCQ
          surveyHTML+='<div onclick="controlAll($(this))">';
          $.each(question.choices,function(c,choice){
            surveyHTML+='<input type="radio" onclick="control($(this),'+question.control+','+question.control_set[c]+')" value='+c+' name="Q'+i+'"><label>'+choice+'</label>';
          });          
          surveyHTML+='</div></div>';
        }        
      }//end Question rendering
    });//end survey rendering
    surveyHTML+='<div><button type="button" onclick="prevPage()">Previous</button></div><div><button id="submit">Submit</button></div></fieldset>';   
    $('#survey').html(surveyHTML);    
  });
  
  $('#survey').on('click','.next_button',nextPage);
  $('#survey').on('click','.prev_button',prevPage);
  
      
});
 
  
function nextPage(){
  var docObj=$('fieldset.current');
  docObj.removeClass('current');
  docObj.next().addClass('current');
};


function prevPage(){
  var docObj=$('fieldset.current');
  docObj.removeClass('current');
  docObj.prev().addClass('current'); 
};


function controlAll(docObj){
  buttons=docObj.children('input');
  $.each(buttons,function(i,button){
    button.onclick();
  });
  checked=docObj.children('input:checked');
  checked[0].onclick();
};


function control(docObj,control_type,start,end){
  if(start>0){
    var ref=1;
    var refObj=docObj.parent().parent().next();
      if((control_type===1&&docObj.is(':checked'))||(control_type===-1&&!docObj.is(':checked'))){
        while(ref<=end){
          if(start<=ref){
            refObj.removeClass('invis');
            refObj.addClass('vis');
          }
          refObj=refObj.next();
          ref++;
        }        
      }else if((control_type===1&&!docObj.is(':checked'))||(control_type===-1&&docObj.is(':checked'))){
         while(ref<=end){
          if(start<=ref){
            refObj.addClass('invis');
            refObj.removeClass('vis');
          }
          refObj=refObj.next();
          ref++;
        }
      }
  }
};