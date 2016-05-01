$(document).ready(function(){
  
  var url='test_survey.json';
  
  $.getJSON(url, function(data){ 
    var surveyHTML='<fieldset id="S1" class="current">';
    var s=1;
    $.each(data,function(i,question){
      if(question.type==="SDesc"){             //Type:Section Description
        surveyHTML+='<h3>'+question.description+'</h3>';
      }else if(question.type==="SEnd"){        //Type: Section End
        if(s===1){
          surveyHTML+='<br><button type="button" class="btn btn-block next_button">Next</button>';
        }else{
          surveyHTML+='<br><button type="button" class="btn btn-block prev_button">Previous</button><button type="button" class="btn btn-block next_button">Next</button>';
        }
        surveyHTML+='</fieldset>';
        s++;
        surveyHTML+='<fieldset id="S'+s+'">';
      }else{                                   //Type: Question
        surveyHTML+='<div class="'+question.visible+'"><h4><br>'+question.description+'</h4>';
           
        if(question.type==="SText"){
          surveyHTML+='<input type="text" name="Q'+i+'" class="form-control"></div>';
        }else if(question.type==="LText"){
          surveyHTML+='<textarea name="Q'+i+'" class="form-control"></textarea></div></div>';
        }else if(question.type==="SMCQ"){
          $.each(question.choices,function(c,choice){
			style_control=question.choices.length-c-1;
            surveyHTML+='<label class="form-control first_'+c+' last_'+style_control+'"><input type="radio" value='+c+' name="Q'+i+'" id="Q'+i+'_'+c+'">'+' '+choice+'</label>';
          });          
          surveyHTML+='</div>';
        }else if(question.type==="MMCQ"){
          $.each(question.choices,function(c,choice){
			style_control=question.choices.length-c-1;
            surveyHTML+='<label class="form-control first_'+c+' last_'+style_control+'"><input type="checkbox" value='+c+' name="Q'+i+'" id="Q'+i+'_'+c+'">'+' '+choice+'</label>';
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
			style_control=question.choices.length-c-1;
            surveyHTML+='<label class="form-control first_'+c+' last_'+style_control+'"><input type="radio" onclick="control($(this),'+question.control+','+question.control_set[c]+')" value='+c+' name="Q'+i+'">'+' '+choice+'</label>';
          });          
          surveyHTML+='</div></div>';
        }        
      }//end Question rendering
    });//end survey rendering
    surveyHTML+='<br><button type="button" class="btn btn-block prev_button">Previous</button><button id="submit" class="btn btn-block btn-success">Submit</button></fieldset>';   
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
  radios=docObj.find('input');
  $.each(radios,function(i,radio){
    radio.onclick();
  });
  checked=docObj.find('input:checked');
  checked[0].onclick();
};


function control(docObj,control_type,start,end){
  if(start>0){
    var ref=1;
    var refObj=docObj.parent().parent().parent().next();
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