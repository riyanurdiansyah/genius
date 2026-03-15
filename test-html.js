const draft = [{key:"c1"}, {key:"c2"}];
const c = draft[0];
const ID = "dt123";
const s = '<button class="btn btn-sm btn-outline-danger" style="padding:2px 6px;" onclick="DT_'+ID+'._delCol(&quot;'+c.key+'&quot;)"'+(draft.length<=1?' disabled':'')+' title="Remove"><i class="fas fa-times" style="font-size:11px;"></i></button>';
console.log(s);
