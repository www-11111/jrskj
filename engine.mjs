// Teaching simulation. All amounts are fictional silver units, not historical estimates.
export const money = n => Math.round(n).toLocaleString('zh-CN');
export function initialState(){return {version:1,cash:1600,receivable:800,assets:9000,debt:500,newDebt:0,interest:20,income:600,expense:800,reputation:70,payable:0,month:0,history:[],choices:[],seen:[],talks:[],learned:[],allocation:null,ending:null};}
export const plans = [
 [
  {id:'budget',title:'核账催收，调整用度',short:'催回300两，月支出降至650两',detail:'支付50两核账费用；从原有应收款收回300两。每月压缩150两非必要用度，必要生活不变。',tradeoff:'家望 −8；减少后续固定负担。',reason:'先修复日常收支'},
  {id:'sell',title:'出售闲置铺面',short:'账面1800两，急售收回1500两',detail:'用一项长期资产换取现银。该闲置铺面不计入本模型的每月收入；出售产生300两折价。',tradeoff:'家望 −4；现银增加，长期家底减少。',reason:'先保住眼前周转'},
  {id:'loan',title:'借入周转款',short:'借入1000两，每月另付60两息',detail:'借款本金暂不在三个月内到期，但会计入期末负债。须连续支付利息，原本的收支缺口仍在。',tradeoff:'家望 +4；每月利息从20两升至80两。',reason:'保留资产，以借款争取时间'},
  {id:'hold',title:'维持现有安排',short:'暂不催收、不借款、不变卖',detail:'每月收入600两，开支800两，另付20两利息。每过一个月，现银减少220两。',tradeoff:'家望 +3；现金缺口继续累积。',reason:'等待后续收入改善'}
 ],
 [
  {id:'scale',title:'缩减宴仪，保留礼数',short:'将1600两支出压至700两',detail:'与家人商议，取消额外排场，保留必要仪式。本月支付700两，无新增欠款。',tradeoff:'家望 −18；可保留更多现银。',reason:'让活动规模适应家底'},
  {id:'bridge',title:'借款维持原定规格',short:'借入1200两，支付1600两',detail:'新增本金1200两，每月增加72两利息。借款不会计为收入，本金仍需在未来偿还。',tradeoff:'家望 +5；持续利息增加，仍需补足400两。',reason:'以未来偿债换取当下体面'},
  {id:'sale',title:'变卖另一项闲置资产',short:'折价变现1500两，支付1600两',detail:'出售账面1800两的另一项闲置资产，获得1500两现金。其不产生模型内的月收入。',tradeoff:'家望 −8；再次承担300两急售折价。',reason:'避免新增负债'},
  {id:'defer',title:'与承办方协商分期',short:'本月付900两，下月另付700两',detail:'总支出仍为1600两，不另收利息。尚欠700两计入应付款，下月必须支付。',tradeoff:'家望 −3；压力被移到下月，并未消失。',reason:'用时间安排解决短期缺口'}
 ]
];
function change(s,field,amount,label,ledger){s[field]+=amount;ledger.push({field,amount,label});}
export function settle(source,act,id,reason){
 if(act!==source.month || !plans[act]?.some(p=>p.id===id))throw new Error('当前阶段不能执行这个方案');
 const s=structuredClone(source), before={cash:s.cash,assets:s.assets,debt:s.debt,receivable:s.receivable,payable:s.payable}; const ledger=[];
 const pay=(n,label)=>change(s,'cash',-n,label,ledger), receive=(n,label)=>change(s,'cash',n,label,ledger);
 if(act===0){
  if(id==='budget'){receive(300,'收回应收款');s.receivable-=300;pay(50,'核账费用');s.expense=650;s.reputation-=8;}
  if(id==='sell'){receive(1500,'出售闲置铺面');s.assets-=1800;s.reputation-=4;}
  if(id==='loan'){receive(1000,'借入周转本金');s.debt+=1000;s.newDebt+=1000;s.interest+=60;s.reputation+=4;}
  if(id==='hold')s.reputation+=3;
 }else{
  if(id==='scale'){pay(700,'缩减后的宴仪支出');s.reputation-=18;}
  if(id==='bridge'){receive(1200,'借入宴仪本金');s.debt+=1200;s.newDebt+=1200;s.interest+=72;pay(1600,'宴仪支出');s.reputation+=5;}
  if(id==='sale'){receive(1500,'出售闲置资产');s.assets-=1800;pay(1600,'宴仪支出');s.reputation-=8;}
  if(id==='defer'){pay(900,'宴仪首付款');s.payable+=700;s.reputation-=3;}
 }
 receive(s.income,'本月实际到款');pay(s.expense,'本月日常开支');pay(s.interest,'本月利息');s.month++;
 s.history.push({act,plan:id,before,after:{cash:s.cash,assets:s.assets,debt:s.debt,receivable:s.receivable,payable:s.payable},ledger});s.choices.push({id,reason:String(reason||'未填写').slice(0,100)});return s;
}
export function due(s){return s.expense+s.interest+s.payable;}
export function netWorth(s){return s.cash+s.receivable+s.assets-s.debt-s.payable;}
export function suggestedAllocation(s){const cash=Math.max(0,s.cash), operating=Math.min(cash,due(s)),reserve=Math.min(Math.max(0,cash-operating),200);return {operating,reserve,longterm:cash-operating-reserve};}
export function finish(source,a){
 if(source.month!==2)throw new Error('请先完成前两幕');
 if(!a||!['operating','reserve','longterm'].every(k=>Number.isSafeInteger(a[k])&&a[k]>=0))throw new Error('分配金额必须为非负整数');
 if(a.operating+a.reserve+a.longterm!==Math.max(0,source.cash))throw new Error('请分配全部现有资金，且不得超出总额');
 const s=structuredClone(source),obligation=due(s),shock=200,liquid=a.operating+a.reserve,unpaid=Math.max(0,obligation+shock-liquid),remaining=Math.max(0,liquid-obligation-shock);
 s.receivable+=600; // Month 3 rent is delayed, so no cash receipt. It remains an asset.
 s.assets+=a.longterm;s.cash=remaining;s.payable=unpaid;s.month=3;s.allocation={...a,obligation,shock,unpaid,remaining};
 let type='transition';if(unpaid>0)type='illusion';else if(s.newDebt>=1000)type='debt';else if(a.reserve>=200&&remaining>=100&&s.reputation>=40)type='guardian';
 s.ending=type;return s;
}
export const endings={illusion:{title:'盛世幻象',line:'家底仍在，周转却先一步停了下来。',text:'本次模拟中，能够及时支付的资金不足。请回看长期投入、延期付款和到款时间；账面资产不能自动替你付清今天的账。'},debt:{title:'饮鸩止渴',line:'眼前渡过难关，未来仍有偿债的功课。',text:'本次模拟中，新增借款帮助完成了支付，但本金和持续利息仍然存在。借款有其用途，下一步需要明确偿还来源和时间。'},transition:{title:'艰难转型',line:'重要支出已守住，余地仍然不够宽。',text:'本次模拟中，日常支出和意外修缮都已覆盖。可用结余、应急分层或家人接受度仍有改进空间；这是一段调整的开始。'},guardian:{title:'财富守门人',line:'留出余地，才能为家人留住从容。',text:'本次模拟中，你兼顾了支付、应急和家庭诉求。你为不确定性留出了现金，同时控制了新增借贷；这一结果取决于本案的教学假设。'}};
